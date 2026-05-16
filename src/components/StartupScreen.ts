/**
 * Kalt Code startup screen.
 * Called once at CLI startup before the Ink UI renders.
 *
 * Addresses: https://github.com/kaltdev/kaltcode/issues/55
 */

import { homedir } from "os";
import { sep } from "path";
import {
    isLocalProviderUrl,
    resolveProviderRequest,
} from "../services/api/providerConfig.js";
import {
    getRouteLabel,
    resolveRouteIdFromBaseUrl,
} from "../integrations/routeMetadata.js";
import { getLocalOpenAICompatibleProviderLabel } from "../utils/providerDiscovery.js";
import { getSettings_DEPRECATED } from "../utils/settings/settings.js";
import { parseUserSpecifiedModel } from "../utils/model/model.js";
import { DEFAULT_GEMINI_MODEL } from "../utils/providerProfile.js";

export function detectProvider(modelOverride?: string): {
    name: string;
    model: string;
    baseUrl: string;
    isLocal: boolean;
} {
    const useGemini =
        process.env.CLAUDE_CODE_USE_GEMINI === "1" ||
        process.env.CLAUDE_CODE_USE_GEMINI === "true";
    const useGithub =
        process.env.CLAUDE_CODE_USE_GITHUB === "1" ||
        process.env.CLAUDE_CODE_USE_GITHUB === "true";
    const useOpenAI =
        process.env.CLAUDE_CODE_USE_OPENAI === "1" ||
        process.env.CLAUDE_CODE_USE_OPENAI === "true";
    const useMistral =
        process.env.CLAUDE_CODE_USE_MISTRAL === "1" ||
        process.env.CLAUDE_CODE_USE_MISTRAL === "true";

    if (useGemini) {
        const model =
            modelOverride || process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;
        const baseUrl =
            process.env.GEMINI_BASE_URL ||
            "https://generativelanguage.googleapis.com/v1beta/openai";
        return { name: "Google Gemini", model, baseUrl, isLocal: false };
    }

    if (useMistral) {
        const model =
            modelOverride || process.env.MISTRAL_MODEL || "devstral-latest";
        const baseUrl =
            process.env.MISTRAL_BASE_URL || "https://api.mistral.ai/v1";
        return { name: "Mistral", model, baseUrl, isLocal: false };
    }

    if (useGithub) {
        const model =
            modelOverride || process.env.OPENAI_MODEL || "github:copilot";
        const baseUrl =
            process.env.OPENAI_BASE_URL || "https://api.githubcopilot.com";
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
        else if (/api\.kimi\.com/i.test(baseUrl))
            name = "Moonshot AI - Kimi Code";
        else if (routeId && routeId !== "openai" && routeId !== "custom")
            name = getRouteLabel(routeId) ?? name;
        else if (/moonshot/i.test(baseUrl)) name = "Moonshot AI - API";
        else if (/deepseek/i.test(baseUrl)) name = "DeepSeek";
        else if (/mistral/i.test(baseUrl)) name = "Mistral";
        // rawModel fallback — fires only when base URL is generic/custom.
        else if (/nvidia/i.test(rawModel)) name = "NVIDIA NIM";
        else if (/minimax/i.test(rawModel)) name = "MiniMax";
        else if (/\bkimi-for-coding\b/i.test(rawModel))
            name = "Moonshot AI - Kimi Code";
        else if (/\bkimi-k/i.test(rawModel) || /moonshot/i.test(rawModel))
            name = "Moonshot AI - API";
        else if (/deepseek/i.test(rawModel)) name = "DeepSeek";
        else if (/mistral/i.test(rawModel)) name = "Mistral";
        else if (/llama/i.test(rawModel)) name = "Meta Llama";
        else if (/bankr/i.test(baseUrl)) name = "Bankr";
        else if (/bankr/i.test(rawModel)) name = "Bankr";
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
    const baseUrl =
        process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com";
    const isLocal = isLocalProviderUrl(baseUrl);
    return { name: "Anthropic", model: resolvedModel, baseUrl, isLocal };
}

const DEFAULT_PANEL_WIDTH = 110;
const MIN_HORIZONTAL_PANEL_WIDTH = 78;
const LEFT_PANEL_WIDTH = 39;
const ELLIPSIS = "…";

function charWidth(char: string): number {
    const codePoint = char.codePointAt(0) ?? 0;
    if (
        codePoint === 0 ||
        (codePoint >= 0x0300 && codePoint <= 0x036f) ||
        (codePoint >= 0xfe00 && codePoint <= 0xfe0f)
    ) {
        return 0;
    }
    if (
        codePoint >= 0x1100 &&
        (codePoint <= 0x115f ||
            codePoint === 0x2329 ||
            codePoint === 0x232a ||
            (codePoint >= 0x2e80 && codePoint <= 0xa4cf) ||
            (codePoint >= 0xac00 && codePoint <= 0xd7a3) ||
            (codePoint >= 0xf900 && codePoint <= 0xfaff) ||
            (codePoint >= 0xfe10 && codePoint <= 0xfe19) ||
            (codePoint >= 0xfe30 && codePoint <= 0xfe6f) ||
            (codePoint >= 0xff00 && codePoint <= 0xff60) ||
            (codePoint >= 0xffe0 && codePoint <= 0xffe6))
    ) {
        return 2;
    }
    return 1;
}

function displayWidth(text: string): number {
    let width = 0;
    for (const char of text) {
        width += charWidth(char);
    }
    return width;
}

function truncateToWidth(text: string, maxWidth: number): string {
    if (displayWidth(text) <= maxWidth) return text;
    if (maxWidth <= 0) return "";
    if (maxWidth === 1) return ELLIPSIS;

    let width = 0;
    let result = "";
    for (const char of text) {
        const nextWidth = charWidth(char);
        if (width + nextWidth > maxWidth - 1) break;
        result += char;
        width += nextWidth;
    }
    return `${result}${ELLIPSIS}`;
}

function truncateToWidthNoEllipsis(text: string, maxWidth: number): string {
    if (displayWidth(text) <= maxWidth) return text;
    if (maxWidth <= 0) return "";

    let width = 0;
    let result = "";
    for (const char of text) {
        const nextWidth = charWidth(char);
        if (width + nextWidth > maxWidth) break;
        result += char;
        width += nextWidth;
    }
    return result;
}

function truncateStartToWidth(text: string, maxWidth: number): string {
    if (displayWidth(text) <= maxWidth) return text;
    if (maxWidth <= 0) return "";
    if (maxWidth === 1) return ELLIPSIS;

    let width = 0;
    let result = "";
    const chars = Array.from(text);
    for (let i = chars.length - 1; i >= 0; i--) {
        const char = chars[i]!;
        const nextWidth = charWidth(char);
        if (width + nextWidth > maxWidth - 1) break;
        result = char + result;
        width += nextWidth;
    }
    return `${ELLIPSIS}${result}`;
}

function truncatePathMiddle(path: string, maxWidth: number): string {
    if (displayWidth(path) <= maxWidth) return path;
    if (maxWidth <= 0) return "";

    const slashIndex = Math.max(
        path.lastIndexOf("/"),
        path.lastIndexOf("\\"),
    );
    if (slashIndex === -1) return truncateToWidth(path, maxWidth);

    const filename = path.slice(slashIndex);
    const directory = path.slice(0, slashIndex);
    if (displayWidth(filename) >= maxWidth - 1) {
        return truncateStartToWidth(filename, maxWidth);
    }

    const directoryWidth = maxWidth - displayWidth(filename) - 1;
    return `${truncateToWidthNoEllipsis(
        directory,
        directoryWidth,
    )}${ELLIPSIS}${filename}`;
}

function getDisplayCwd(): string {
    const cwd = process.cwd();
    const home = homedir();
    if (cwd === home) return "~";
    if (cwd.startsWith(home + sep)) {
        return `~${cwd.slice(home.length)}`;
    }
    return cwd;
}

function repeat(char: string, width: number): string {
    return width > 0 ? char.repeat(width) : "";
}

function fit(text: string, width: number): string {
    if (width <= 0) return "";
    const truncated = truncateToWidth(text, width);
    return truncated + repeat(" ", width - displayWidth(truncated));
}

function center(text: string, width: number): string {
    if (width <= 0) return "";
    const truncated = truncateToWidth(text, width);
    const padding = Math.max(0, width - displayWidth(truncated));
    const left = Math.floor(padding / 2);
    return repeat(" ", left) + truncated + repeat(" ", padding - left);
}

function titledTopBorder(width: number, title: string): string {
    const prefix = "╭─── ";
    const suffix = "╮";
    const titleWidth = Math.max(0, width - displayWidth(prefix) - 2);
    const fittedTitle =
        titleWidth > 0 ? truncateToWidth(title, titleWidth) : "";
    return `${prefix}${fittedTitle} ${repeat(
        "─",
        width - displayWidth(prefix) - displayWidth(fittedTitle) - 2,
    )}${suffix}`;
}

function bottomBorder(width: number): string {
    return `╰${repeat("─", width - 2)}╯`;
}

function row(
    left: string,
    right: string,
    leftWidth: number,
    rightWidth: number,
) {
    return `│${fit(left, leftWidth)}│${fit(right, rightWidth)}│`;
}

function fullRow(content: string, width: number): string {
    return `│${fit(content, width - 2)}│`;
}

function getPanelWidth(): number {
    const columns = process.stdout.columns;
    if (!columns || columns <= 0) return DEFAULT_PANEL_WIDTH;
    return Math.max(42, Math.min(columns, DEFAULT_PANEL_WIDTH));
}

function getBillingLabel(providerName: string): string {
    if (/\bAPI$/i.test(providerName)) return `${providerName} Billing`;
    return `${providerName} API Billing`;
}

function buildHorizontalStartupPanel(
    width: number,
    title: string,
    modelLine: string,
    cwdLine: string,
): string {
    const innerWidth = width - 2;
    const leftWidth = LEFT_PANEL_WIDTH;
    const rightWidth = innerWidth - leftWidth - 1;
    const rightDivider = ` ${repeat("─", Math.max(0, rightWidth - 1))}`;
    const clawd = ["▐▛███▜▌", "▝▜█████▛▘", "▘▘ ▝▝"];

    return [
        titledTopBorder(width, title),
        row("", " Tips for getting started", leftWidth, rightWidth),
        row(
            center("Welcome back!", leftWidth),
            " Run /init to create a CLAUDE.md file with instructions for Claude",
            leftWidth,
            rightWidth,
        ),
        row("", rightDivider, leftWidth, rightWidth),
        row("", " Recent activity", leftWidth, rightWidth),
        row(
            center(clawd[0], leftWidth),
            " No recent activity",
            leftWidth,
            rightWidth,
        ),
        row(center(clawd[1], leftWidth), "", leftWidth, rightWidth),
        row(center(clawd[2], leftWidth), "", leftWidth, rightWidth),
        row("", "", leftWidth, rightWidth),
        row(center(modelLine, leftWidth), "", leftWidth, rightWidth),
        row(center(cwdLine, leftWidth), "", leftWidth, rightWidth),
        bottomBorder(width),
    ].join("\n");
}

function buildCompactStartupPanel(
    width: number,
    title: string,
    modelLine: string,
    cwdLine: string,
): string {
    const innerWidth = width - 2;
    const clawd = ["▐▛███▜▌", "▝▜█████▛▘", "▘▘ ▝▝"];

    return [
        titledTopBorder(width, title),
        fullRow(center("Welcome back!", innerWidth), width),
        fullRow("", width),
        ...clawd.map((line) => fullRow(center(line, innerWidth), width)),
        fullRow("", width),
        fullRow(center(modelLine, innerWidth), width),
        fullRow(center(cwdLine, innerWidth), width),
        fullRow(repeat("─", innerWidth), width),
        fullRow(" Tips for getting started", width),
        fullRow(
            " Run /init to create a CLAUDE.md file with instructions for Claude",
            width,
        ),
        fullRow(repeat("─", innerWidth), width),
        fullRow(" Recent activity", width),
        fullRow(" No recent activity", width),
        bottomBorder(width),
    ].join("\n");
}

export function renderStartupPanel(modelOverride?: string): string {
    const provider = detectProvider(modelOverride);
    const width = getPanelWidth();
    const title = `Kalt Code v${MACRO.DISPLAY_VERSION ?? MACRO.VERSION}`;
    const contentWidth =
        width >= MIN_HORIZONTAL_PANEL_WIDTH ? LEFT_PANEL_WIDTH : width - 2;
    const modelLine = truncateToWidth(
        `${provider.model} · ${getBillingLabel(provider.name)}`,
        contentWidth,
    );
    const cwdLine = truncatePathMiddle(getDisplayCwd(), contentWidth);

    if (width >= MIN_HORIZONTAL_PANEL_WIDTH) {
        return buildHorizontalStartupPanel(width, title, modelLine, cwdLine);
    }

    return buildCompactStartupPanel(width, title, modelLine, cwdLine);
}

export async function printStartupScreen(modelOverride?: string): Promise<void> {
    // Skip in non-interactive / CI / print mode
    if (process.env.CI || !process.stdout.isTTY) return;

    process.stdout.write(`${renderStartupPanel(modelOverride)}\n`);
}
