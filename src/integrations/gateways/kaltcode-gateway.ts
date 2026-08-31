import { defineGateway } from '../define.js'
import type { ModelCatalogEntry } from '../descriptors.js'
import { ZAI_GLM_OPENAI_SHIM } from '../transport/zaiGlmShim.js'
import {
  firstPositiveNumber,
  getTrimmedString,
  isFreeModel,
  isKnownNonCodingModelId,
  isRecord,
} from '../modelMapping.js'

/**
 * Normalizes kaltcode-gateway model IDs by removing the `xiaomi/` prefix when
 * the remainder starts with `mimo` (the gateway exposes some Xiaomi models both
 * with and without the vendor prefix; we keep the shorter form for the catalog).
 */
function normalizeGatewayModelId(id: string): string {
  return id.replace(/^xiaomi\/(?=mimo(?:-|$))/i, '')
}

/**
 * Map kaltcode-gateway's public GET /v1/models payload into a catalog entry.
 * The gateway already curates what it exposes, so every non-empty id is kept
 * except clearly non-coding names if they ever appear.
 */
export function mapGatewayModel(raw: unknown): ModelCatalogEntry | null {
  if (!isRecord(raw)) {
    return null
  }

  const rawId = getTrimmedString(raw, 'id')
  if (!rawId || isKnownNonCodingModelId(rawId)) {
    return null
  }
  const id = normalizeGatewayModelId(rawId)

  const name =
    getTrimmedString(raw, 'name') ||
    getTrimmedString(raw, 'display_name') ||
    getTrimmedString(raw, 'title')
  const free = isFreeModel(id, raw)
  let label = name || id
  if (free && !label.toLowerCase().includes('free')) {
    label = `${label} (free)`
  }

  const contextWindow = firstPositiveNumber(
    raw.context_window,
    raw.contextWindow,
    raw.context_length,
    raw.max_context_length,
  )

  return {
    id,
    apiName: id,
    label,
    ...(contextWindow ? { contextWindow } : {}),
    ...(free ? { notes: 'Free' } : {}),
  }
}

export default defineGateway({
  id: 'kaltcode-gateway',
  label: 'KaltCode Gateway',
  category: 'aggregating',
  defaultBaseUrl: 'https://kaltcode.my.id/v1',
  defaultModel: 'mimo-v2.5-pro',
  supportsModelRouting: true,
  vendorId: 'openai',
  setup: {
    requiresAuth: true,
    authMode: 'api-key',
    credentialEnvVars: ['KALTCODE_GATEWAY_API_KEY', 'OPENAI_API_KEYS', 'OPENAI_API_KEY'],
  },
  validation: {
    kind: 'credential-env',
    // KALTCODE_GATEWAY_API_KEY first so users who set both don't get their
    // generic OpenAI key sent to the gateway by accident. OPENAI_API_KEYS /
    // OPENAI_API_KEY kept as fallbacks because existing Kalt Code configs may
    // already hold generic credentials there.
    credentialEnvVars: ['KALTCODE_GATEWAY_API_KEY', 'OPENAI_API_KEYS', 'OPENAI_API_KEY'],
    missingCredentialMessage:
      'KALTCODE_GATEWAY_API_KEY is required to use KaltCode Gateway.\n' +
      'Mint a free API key at https://kaltcode.my.id/keys and set it as KALTCODE_GATEWAY_API_KEY (or OPENAI_API_KEYS / OPENAI_API_KEY when OPENAI_BASE_URL points at the gateway).',
    routing: {
      matchBaseUrlHosts: ['kaltcode.my.id'],
    },
  },
  transportConfig: {
    kind: 'openai-compatible',
    openaiShim: {
      // The gateway expects `Authorization: Bearer kc_live_...`. Previous
      // `api-key` raw header was a leftover from the direct-Xiaomi era.
      headers: {
        'Accept-Encoding': 'identity',
      },
      defaultAuthHeader: {
        name: 'authorization',
        scheme: 'bearer',
      },
      maxTokensField: 'max_completion_tokens',
      removeBodyFields: ['store', 'stream_options'],
      supportsApiFormatSelection: false,
      supportsAuthHeaders: false,
    },
  },
  preset: {
    id: 'kaltcode-gateway',
    description: 'KaltCode Gateway - (API key required, signup at https://kaltcode.my.id/keys)',
    apiKeyEnvVars: ['KALTCODE_GATEWAY_API_KEY'],
    label: 'KaltCode Gateway',
    name: 'KaltCode Gateway',
    badge: {
      text: 'Recommended',
      color: 'success',
    },
    vendorId: 'openai',
    modelEnvVars: ['OPENAI_MODEL'],
    baseUrlEnvVars: ['KALTCODE_GATEWAY_BASE_URL', 'OPENAI_BASE_URL'],
    fallbackBaseUrl: 'https://kaltcode.my.id/v1',
    fallbackModel: 'mimo-v2.5-pro',
  },
  catalog: {
    // Hybrid: curated defaults stay first for labels/descriptor links; live
    // GET /v1/models fills in new gateway routes without a catalog PR.
    source: 'hybrid',
    discovery: {
      kind: 'openai-compatible',
      // Public model list works without a key (chat still requires auth).
      requiresAuth: false,
      mapModel: mapGatewayModel,
    },
    discoveryCacheTtl: '1d',
    discoveryRefreshMode: 'startup',
    allowManualRefresh: true,
    models: [
      // Virtual model: the gateway's smart router picks the cheapest model
      // expected to handle the request and escalates on upstream failure
      // (see kaltcode-gateway routing). Billed at the serving model's rate;
      // the x-gateway-served-model response header names who answered.
      {
        id: 'kaltcode-gateway-auto',
        apiName: 'auto',
        label: 'Auto — Smart Routing (via KaltCode Gateway)',
        notes: 'Gateway picks the cheapest capable model and escalates on failure',
      },
      {
        id: 'kaltcode-gateway-mimo-v2.5-pro',
        apiName: 'mimo-v2.5-pro',
        label: 'MiMo V2.5 Pro (via KaltCode Gateway)',
        modelDescriptorId: 'mimo-v2.5-pro',
      },
      {
        id: 'kaltcode-gateway-mimo-v2.5',
        apiName: 'mimo-v2.5',
        label: 'MiMo V2.5 (via KaltCode Gateway)',
        modelDescriptorId: 'mimo-v2.5',
      },
      {
        id: 'kaltcode-gateway-mimo-v2-flash',
        apiName: 'mimo-v2-flash',
        label: 'MiMo V2 Flash (via KaltCode Gateway)',
        modelDescriptorId: 'mimo-v2-flash',
      },
      // Non-Xiaomi models reachable through the same gateway endpoint. The
      // gateway routes by model name, so the gateway URL stays unchanged; only
      // the apiName the client sends determines the upstream.
      {
        id: 'kaltcode-gateway-gemini-3.1-flash-lite',
        apiName: 'google/gemini-3.1-flash-lite',
        label: 'Gemini 3.1 Flash Lite (via KaltCode Gateway)',
        modelDescriptorId: 'gemini-3.1-flash-lite',
      },
      {
        id: 'kaltcode-gateway-minimax-m3',
        apiName: 'minimax/minimax-m3',
        label: 'MiniMax M3 (via KaltCode Gateway)',
        modelDescriptorId: 'minimax-m3',
      },
      {
        id: 'kaltcode-gateway-qwen3.7-max',
        apiName: 'qwen/qwen3.7-max',
        label: 'Qwen 3.7 Max (via KaltCode Gateway)',
        modelDescriptorId: 'qwen3.7-max',
      },
      {
        id: 'kaltcode-gateway-glm-5.2',
        apiName: 'z-ai/glm-5.2',
        label: 'GLM 5.2 (via KaltCode Gateway)',
        modelDescriptorId: 'glm-5.2',
        transportOverrides: {
          openaiShim: {
            ...ZAI_GLM_OPENAI_SHIM,
            maxTokensField: 'max_completion_tokens',
            removeBodyFields: ['store', 'stream_options'],
          },
        },
      },
      // OpenRouter :free endpoint — bills $0 and bypasses the gateway credit
      // gate, so it works even with an empty credit balance. The one free
      // model kept through the gateway's 2026-08-10 free retirement;
      // OpenRouter rate-limits it via a shared account-level pool.
      {
        id: 'kaltcode-gateway-nemotron-3-ultra-free',
        apiName: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        label: 'Nemotron 3 Ultra Free (via KaltCode Gateway)',
        modelDescriptorId: 'nvidia/nemotron-3-ultra-550b-a55b:free',
        notes: 'Free (rate limited)',
      },
      // Throttle-free paid sibling of the :free row above.
      {
        id: 'kaltcode-gateway-nemotron-3-ultra',
        apiName: 'nvidia/nemotron-3-ultra-550b-a55b',
        label: 'Nemotron 3 Ultra (via KaltCode Gateway)',
        modelDescriptorId: 'nvidia/nemotron-3-ultra-550b-a55b',
      },
      // Paid since the gateway's 2026-08-10 free retirement. The ling entry
      // id keeps its historical "-free" suffix so saved user selections
      // still resolve; the gateway aliases the old :free api id to paid.
      {
        id: 'kaltcode-gateway-ling-3.0-flash-free',
        apiName: 'inclusionai/ling-3.0-flash',
        label: 'Ling 3.0 Flash (via KaltCode Gateway)',
        modelDescriptorId: 'inclusionai/ling-3.0-flash',
      },
      // Day-0 Novita launch via the gateway's OpenRouter wiring. Lifecycle:
      // the gateway time-boxes the id server-side and 400s requests after the
      // window; `availableUntil` below is the client-side guard — catalog
      // resolution drops the entry at the same instant, so the picker never
      // offers an id the gateway rejects. Keep the two dates in sync if the
      // window moves.
      {
        id: 'kaltcode-gateway-ling-3.0-tiny-free',
        apiName: 'inclusionai/ling-3.0-tiny:free',
        label: 'Ling 3.0 Tiny Free (via KaltCode Gateway)',
        modelDescriptorId: 'inclusionai/ling-3.0-tiny:free',
        notes: 'Free through August 13, 2026 (rate limited)',
        availableUntil: '2026-08-13T10:00:00Z',
      },
      // Macaron — served by the gateway via direct Novita (not on
      // OpenRouter). Paid since 2026-08-10.
      {
        id: 'kaltcode-gateway-macaron-v1-tall',
        apiName: 'mindai/macaron-v1-tall',
        label: 'Macaron V1 Tall (via KaltCode Gateway)',
        modelDescriptorId: 'mindai/macaron-v1-tall',
      },
      {
        id: 'kaltcode-gateway-macaron-v1-venti',
        apiName: 'mindai/macaron-v1-venti',
        label: 'Macaron V1 Venti (via KaltCode Gateway)',
        modelDescriptorId: 'mindai/macaron-v1-venti',
      },
      {
        id: 'kaltcode-gateway-tencent-hy3',
        apiName: 'tencent/hy3',
        label: 'Tencent HY3 (via KaltCode Gateway)',
        modelDescriptorId: 'tencent/hy3',
      },
    ],
  },
  usage: { supported: false },
})
