/**
 * Runtime overrides for OpenAI-compatible model limits.
 *
<<<<<<< HEAD
 * When KALT_CODE_USE_OPENAI=1, getContextWindowForModel() falls through to
 * MODEL_CONTEXT_WINDOW_DEFAULT (200k). This causes the warning and blocking
 * thresholds to be set at 200k even for models like gpt-4o (128k) or llama3 (8k),
 * meaning users get no warning before hitting a hard API error.
 *
 * Prices in tokens as of April 2026 — update as needed.
=======
 * Built-in model limits, including legacy aliases, live in
 * src/integrations/models. These helpers only preserve the documented JSON env
 * override path for custom/private deployments.
>>>>>>> upstream/main
 */

type LimitEnvVar =
  | 'CLAUDE_CODE_OPENAI_CONTEXT_WINDOWS'
  | 'CLAUDE_CODE_OPENAI_MAX_OUTPUT_TOKENS'

<<<<<<< HEAD
  // DeepSeek (V3: 128k context per official docs)
  'deepseek-chat':            128_000,
  'deepseek-reasoner':        128_000,

  // Groq (fast inference)
  'llama-3.3-70b-versatile':  128_000,
  'llama-3.1-8b-instant':     128_000,
  'mixtral-8x7b-32768':        32_768,

  // Mistral
  'mistral-large-latest':     131_072,
  'mistral-small-latest':     131_072,

  // Google (via OpenRouter)
  'google/gemini-2.0-flash':1_048_576,
  'google/gemini-2.5-pro':  1_048_576,

  // Google (native via KALT_CODE_USE_GEMINI)
  'gemini-2.0-flash':       1_048_576,
  'gemini-2.5-pro':         1_048_576,
  'gemini-2.5-flash':       1_048_576,

  // Ollama local models
  // Llama 3.1+ models support 128k context natively (Meta official specs).
  // Ollama defaults to num_ctx=8192 but users can configure higher values.
  'llama3.3:70b':             128_000,
  'llama3.1:8b':              128_000,
  'llama3.2:3b':              128_000,
  'qwen2.5-coder:32b':        32_768,
  'qwen2.5-coder:7b':         32_768,
  'deepseek-coder-v2:16b':    163_840,
  'deepseek-r1:14b':           65_536,
  'mistral:7b':                32_768,
  'phi4:14b':                  16_384,
  'gemma2:27b':                 8_192,
  'codellama:13b':              16_384,
  'llama3.2:1b':              128_000,
  'qwen3:8b':                 128_000,
  'codestral':                 32_768,
}

/**
 * Max output (completion) tokens per model.
 * This is separate from the context window (input limit).
 * Fixes: 400 error "max_tokens is too large" when default 32k exceeds model limit.
 */
const OPENAI_MAX_OUTPUT_TOKENS: Record<string, number> = {
  // OpenAI
  'gpt-5.4':                 128_000,
  'gpt-5.4-mini':            128_000,
  'gpt-5.4-nano':            128_000,
  'gpt-4o':                   16_384,
  'gpt-4o-mini':              16_384,
  'gpt-4.1':                  32_768,
  'gpt-4.1-mini':             32_768,
  'gpt-4.1-nano':             32_768,
  'gpt-4-turbo':               4_096,
  'gpt-4':                     4_096,
  'o1':                       100_000,
  'o1-mini':                   65_536,
  'o1-preview':                32_768,
  'o1-pro':                   100_000,
  'o3':                       100_000,
  'o3-mini':                  100_000,
  'o4-mini':                  100_000,

  // DeepSeek
  'deepseek-chat':              8_192,
  'deepseek-reasoner':         32_768,

  // Groq
  'llama-3.3-70b-versatile':  32_768,
  'llama-3.1-8b-instant':      8_192,
  'mixtral-8x7b-32768':       32_768,

  // Mistral
  'mistral-large-latest':     32_768,
  'mistral-small-latest':     32_768,

  // Google (via OpenRouter)
  'google/gemini-2.0-flash':   8_192,
  'google/gemini-2.5-pro':    65_536,

  // Google (native via KALT_CODE_USE_GEMINI)
  'gemini-2.0-flash':          8_192,
  'gemini-2.5-pro':           65_536,
  'gemini-2.5-flash':         65_536,

  // Ollama local models (conservative safe defaults)
  'llama3.3:70b':               4_096,
  'llama3.1:8b':                4_096,
  'llama3.2:3b':                4_096,
  'qwen2.5-coder:32b':         8_192,
  'qwen2.5-coder:7b':          8_192,
  'deepseek-coder-v2:16b':     8_192,
  'deepseek-r1:14b':            8_192,
  'mistral:7b':                 4_096,
  'phi4:14b':                   4_096,
  'gemma2:27b':                 4_096,
  'codellama:13b':              4_096,
  'llama3.2:1b':                4_096,
  'qwen3:8b':                   8_192,
  'codestral':                   8_192,
}

function lookupByModel<T>(table: Record<string, T>, model: string): T | undefined {
  if (table[model] !== undefined) return table[model]
  // Sort keys by length descending so the most specific prefix wins.
  // Without this, 'gpt-4-turbo-preview' could match 'gpt-4' (8k) instead
  // of 'gpt-4-turbo' (128k) depending on V8's key iteration order.
  const sortedKeys = Object.keys(table).sort((a, b) => b.length - a.length)
  for (const key of sortedKeys) {
    if (model.startsWith(key)) return table[key]
=======
function readExternalLimits(
  envVarName: LimitEnvVar,
  processEnv: NodeJS.ProcessEnv,
): Record<string, number> {
  const raw = processEnv[envVarName]
  if (!raw) {
    return {}
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(
          (entry): entry is [string, number] =>
            typeof entry[0] === 'string' &&
            typeof entry[1] === 'number' &&
            Number.isFinite(entry[1]) &&
            entry[1] > 0,
        )
        .map(([key, value]) => [key.trim(), value])
        .filter(([key]) => key.length > 0),
    )
  } catch {
    return {}
>>>>>>> upstream/main
  }
}

function lookupExactByKey(
  entries: Record<string, number>,
  key: string | undefined,
): number | undefined {
  const normalizedKey = key?.trim()
  if (!normalizedKey) {
    return undefined
  }

  return entries[normalizedKey] ?? entries[normalizedKey.toLowerCase()]
}

function lookupPrefixByKey(
  entries: Record<string, number>,
  key: string | undefined,
): number | undefined {
  const normalizedKey = key?.trim()
  if (!normalizedKey) {
    return undefined
  }

  const prefixKey = Object.keys(entries)
    .sort((left, right) => right.length - left.length)
    .find(entryKey => normalizedKey.startsWith(entryKey))

  return prefixKey ? entries[prefixKey] : undefined
}

function getOpenAIBaseUrlHost(processEnv: NodeJS.ProcessEnv): string | undefined {
  const baseUrl =
    processEnv.OPENAI_BASE_URL?.trim() || processEnv.OPENAI_API_BASE?.trim()
  if (!baseUrl) {
    return undefined
  }

  try {
    return new URL(baseUrl).host
  } catch {
    return undefined
  }
}

function lookupByModel(
  entries: Record<string, number>,
  model: string | undefined,
  processEnv: NodeJS.ProcessEnv,
): number | undefined {
  const modelName = model?.trim() || processEnv.OPENAI_MODEL?.trim()
  const baseUrlHost = getOpenAIBaseUrlHost(processEnv)
  const hostQualifiedModel =
    baseUrlHost && modelName ? `${baseUrlHost}:${modelName}` : undefined

  return (
    lookupExactByKey(entries, hostQualifiedModel) ??
    lookupExactByKey(entries, modelName) ??
    lookupPrefixByKey(entries, hostQualifiedModel) ??
    lookupPrefixByKey(entries, modelName)
  )
}

function lookupExternalLimit(
  envVarName: LimitEnvVar,
  model: string | undefined,
  processEnv: NodeJS.ProcessEnv,
): number | undefined {
  return lookupByModel(
    readExternalLimits(envVarName, processEnv),
    model,
    processEnv,
  )
}

export function getOpenAIContextWindow(
  model: string | undefined,
  processEnv: NodeJS.ProcessEnv = process.env,
): number | undefined {
  return lookupExternalLimit(
    'CLAUDE_CODE_OPENAI_CONTEXT_WINDOWS',
    model,
    processEnv,
  )
}

export function getOpenAIMaxOutputTokens(
  model: string | undefined,
  processEnv: NodeJS.ProcessEnv = process.env,
): number | undefined {
  return lookupExternalLimit(
    'CLAUDE_CODE_OPENAI_MAX_OUTPUT_TOKENS',
    model,
    processEnv,
  )
}
