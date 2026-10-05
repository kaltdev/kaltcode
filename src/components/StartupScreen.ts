/**
 * Kalt Code startup screen — quadrant-block KALT CODE logo on a dark
 * purple field, followed by a compact left-aligned info block.
 * Called once at CLI startup before the Ink UI renders.
 */

import { isLocalProviderUrl, resolveProviderRequest } from "../services/api/providerConfig.js";
import {
    getRouteLabel,
    isMiniMaxBaseUrl,
    resolveRouteIdFromBaseUrl,
} from "../integrations/routeMetadata.js";
import { getLocalOpenAICompatibleProviderLabel } from "../utils/providerDiscovery.js";
import { getSettings_DEPRECATED } from "../utils/settings/settings.js";
import { parseUserSpecifiedModel } from "../utils/model/model.js";
import { DEFAULT_GEMINI_MODEL } from "../utils/providerProfile.js";
import { ANSI_BOLD, ANSI_DIM, ANSI_RESET, ansiBgRgb, ansiRgb } from "../utils/terminalAnsi.js";
import type { RGB } from "./StartupScreen.palettes.js";

declare const MACRO: { VERSION: string; DISPLAY_VERSION?: string };

const RESET = ANSI_RESET;
const BOLD = ANSI_BOLD;
const DIM = ANSI_DIM;

// ─── KALT CODE quadrant logo ─────────────────────────────────────────────────

const LOGO = [
    `███  ███ ████████ ███   █████████ ████████ ████████ ████████ ████████`,
    `███  ███ ███  ███ ███      ███    ███      ███  ███ ███  ███ ███     `,
    `██████   ████████ ███      ███    ███      ███  ███ ███  ███ ████████`,
    `███  ███ ███  ███ ███      ███    ███      ███  ███ ███  ███ ███     `,
    `███  ███ ███  ███ ████████ ███    ████████ ████████ ████████ ████████`,
];

// Splash colors: light lavender glyphs on a dark purple field.
const GLYPH: RGB = [203, 186, 235];
const FIELD_BG: RGB = [48, 35, 78];
const LEFT_MARGIN = 2;
const PAD_X = 2;
const PAD_Y = 1;

// ─── Provider detection ───────────────────────────────────────────────────────

export function detectProvider(modelOverride?: string): {
    name: string;
    model: string;
    baseUrl: string;
    isLocal: boolean;
} {
    const useGemini =
        process.env.CLAUDE_CODE_USE_GEMINI === "1" || process.env.CLAUDE_CODE_USE_GEMINI === "true";
    const useGithub =
        process.env.CLAUDE_CODE_USE_GITHUB === "1" || process.env.CLAUDE_CODE_USE_GITHUB === "true";
    const useOpenAI =
        process.env.CLAUDE_CODE_USE_OPENAI === "1" || process.env.CLAUDE_CODE_USE_OPENAI === "true";
    const useMistral =
        process.env.CLAUDE_CODE_USE_MISTRAL === "1" ||
        process.env.CLAUDE_CODE_USE_MISTRAL === "true";

    if (useGemini) {
        const model = modelOverride || process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
        const baseUrl =
            process.env.GEMINI_BASE_URL ||
            "https://generativelanguage.googleapis.com/v1beta/openai";
        return { name: "Google AI / Gemini", model, baseUrl, isLocal: false };
    }

    if (useMistral) {
        const model = modelOverride || process.env.MISTRAL_MODEL || "devstral-latest";
        const baseUrl = process.env.MISTRAL_BASE_URL || "https://api.mistral.ai/v1";
        return { name: "Mistral", model, baseUrl, isLocal: false };
    }

    if (useGithub) {
        const model = modelOverride || process.env.OPENAI_MODEL || "github:copilot";
        const baseUrl = process.env.OPENAI_BASE_URL || "https://api.githubcopilot.com";
        return { name: "GitHub Copilot", model, baseUrl, isLocal: false };
    }

    if (useOpenAI) {
        const rawModel = modelOverride || process.env.OPENAI_MODEL || "gpt-4o";
        const resolvedRequest = resolveProviderRequest({
            model: rawModel,
            baseUrl: process.env.OPENAI_BASE_URL,
        });
        const baseUrl = resolvedRequest.baseUrl;
        const isLocal = isLocalProviderUrl(baseUrl);
        const routeId = resolveRouteIdFromBaseUrl(baseUrl);
        let name = "OpenAI";
        // Explicit dedicated-provider env flags win.
        if (process.env.NVIDIA_NIM) name = "NVIDIA NIM";
        else if (process.env.MINIMAX_API_KEY) name = "MiniMax";
        else if (
            resolvedRequest.transport === "codex_responses" ||
            baseUrl.includes("chatgpt.com/backend-api/codex")
        )
            name = "Codex";
        // Base URL is authoritative — must precede rawModel checks so aggregators
        // (OpenRouter/Together/Groq) aren't mislabelled as DeepSeek/Kimi/etc.
        // when routed to models whose IDs contain a vendor prefix. See issue #855.
        else if (/openrouter/i.test(baseUrl)) name = "OpenRouter";
        else if (/together/i.test(baseUrl)) name = "Together AI";
        else if (/groq/i.test(baseUrl)) name = "Groq";
        else if (/azure/i.test(baseUrl)) name = "Azure OpenAI";
        else if (/nvidia/i.test(baseUrl)) name = "NVIDIA NIM";
        else if (/minimax/i.test(baseUrl)) name = "MiniMax";
        else if (/api\.kimi\.com/i.test(baseUrl)) name = "Moonshot AI - Kimi Code";
        else if (routeId && routeId !== "openai" && routeId !== "custom")
            name = getRouteLabel(routeId) ?? name;
        else if (/moonshot/i.test(baseUrl)) name = "Moonshot AI - API";
        else if (/deepseek/i.test(baseUrl)) name = "DeepSeek";
        else if (/mistral/i.test(baseUrl)) name = "Mistral";
        else if (/atlascloud/i.test(baseUrl)) name = "Atlas Cloud";
        // rawModel fallback — fires only when base URL is generic/custom.
        else if (/nvidia/i.test(rawModel)) name = "NVIDIA NIM";
        else if (/minimax/i.test(rawModel)) name = "MiniMax";
        else if (/\bkimi-for-coding\b/i.test(rawModel)) name = "Moonshot AI - Kimi Code";
        else if (/\bkimi-k/i.test(rawModel) || /moonshot/i.test(rawModel))
            name = "Moonshot AI - API";
        else if (/deepseek/i.test(rawModel)) name = "DeepSeek";
        else if (/mistral/i.test(rawModel)) name = "Mistral";
        else if (/llama/i.test(rawModel)) name = "Meta Llama";
        else if (/bankr/i.test(baseUrl)) name = "Bankr";
        else if (/bankr/i.test(rawModel)) name = "Bankr";
        else if (/atlas\.cloud/i.test(rawModel)) name = "Atlas Cloud";
        else if (isLocal) name = getLocalOpenAICompatibleProviderLabel(baseUrl);

        // Resolve model alias to actual model name + reasoning effort
        let displayModel = resolvedRequest.resolvedModel;
        if (resolvedRequest.reasoning?.effort) {
            displayModel = `${displayModel} (${resolvedRequest.reasoning.effort})`;
        }

        return { name, model: displayModel, baseUrl, isLocal };
    }

    // Default: Anthropic - check settings.model first, then env vars
    const settings = getSettings_DEPRECATED() || {};
    const modelSetting =
        modelOverride ||
        process.env.ANTHROPIC_MODEL ||
        process.env.CLAUDE_MODEL ||
        settings.model ||
        "claude-sonnet-4-6";
    const resolvedModel = parseUserSpecifiedModel(modelSetting);
    const baseUrl = process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com";
    const isLocal = isLocalProviderUrl(baseUrl);
    const name = isMiniMaxBaseUrl(baseUrl) ? "MiniMax" : "Anthropic";
    return { name, model: resolvedModel, baseUrl, isLocal };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function printStartupScreen(modelOverride?: string): void {
    // Skip in non-interactive / CI / print mode
    if (process.env.CI || !process.stdout.isTTY) return;

    const p = detectProvider(modelOverride);

    const logoWidth = Math.max(...LOGO.map((row) => row.length));
    const boxWidth = logoWidth + PAD_X * 2;
    const margin = " ".repeat(LEFT_MARGIN);
    const padX = " ".repeat(PAD_X);
    const bg = ansiBgRgb(...FIELD_BG);
    const fg = ansiRgb(...GLYPH);
    const out: string[] = [];

    out.push("");

    // Colored field with the logo, left-aligned
    const emptyRow = `${margin}${bg}${" ".repeat(boxWidth)}${RESET}`;
    for (let i = 0; i < PAD_Y; i++) out.push(emptyRow);
    for (const row of LOGO) {
        out.push(`${margin}${bg}${padX}${fg}${row}${padX}${RESET}`);
    }
    for (let i = 0; i < PAD_Y; i++) out.push(emptyRow);

    out.push("");

    // Compact info block, left-aligned with the logo
    const version = MACRO.DISPLAY_VERSION ?? MACRO.VERSION;
    out.push(`${margin}${DIM}#${RESET} ${BOLD}Kalt Code${RESET} v${version}`);
    out.push(`${margin}${DIM}#${RESET} models: ${p.model}`);
    out.push(`${margin}${DIM}#${RESET} endpoint: ${p.baseUrl}`);

    out.push("");

    process.stdout.write(out.join("\n") + "\n");
}
