export const PRODUCT_DISPLAY_NAME = "Kalt Code";
export const PRODUCT_PASCAL_NAME = "KaltCode";
export const PRODUCT_CAMEL_NAME = "kaltCode";
export const PRODUCT_PACKAGE_TOKEN = "kaltcode";
export const PRODUCT_CLI_NAME = "kalt-code";
export const PRODUCT_NPM_PACKAGE = "@kaltdev/kaltcode";
export const PRODUCT_REPOSITORY = "https://github.com/kaltdev/kaltcode";
export const PRODUCT_ISSUES_URL = `${PRODUCT_REPOSITORY}/issues`;
export const PRODUCT_DISCUSSIONS_URL = `${PRODUCT_REPOSITORY}/discussions`;
export const PRODUCT_RELEASES_URL = `${PRODUCT_REPOSITORY}/releases`;
export const KALTCODE_CONFIG_DIR_NAME = ".kalt-code";
export const LEGACY_CLAUDE_CONFIG_DIR_NAME = ".claude";
export const KALTCODE_CONFIG_DIR_ENV = "KALTCODE_CONFIG_DIR";
export const LEGACY_CLAUDE_CONFIG_DIR_ENV = "CLAUDE_CONFIG_DIR";

export const PRODUCT_URL = "https://claude.com/kalt-code";

// Kalt Code Remote session URLs
export const KALT_CODE_AI_BASE_URL = "https://claude.ai";
export const KALT_CODE_AI_STAGING_BASE_URL =
    "https://claude-ai.staging.ant.dev";
export const KALT_CODE_AI_LOCAL_BASE_URL = "http://localhost:4000";

/**
 * Determine if we're in a staging environment for remote sessions.
 * Checks session ID format and ingress URL.
 */
export function isRemoteSessionStaging(
    sessionId?: string,
    ingressUrl?: string,
): boolean {
    return (
        sessionId?.includes("_staging_") === true ||
        ingressUrl?.includes("staging") === true
    );
}

/**
 * Determine if we're in a local-dev environment for remote sessions.
 * Checks session ID format (e.g. `session_local_...`) and ingress URL.
 */
export function isRemoteSessionLocal(
    sessionId?: string,
    ingressUrl?: string,
): boolean {
    return (
        sessionId?.includes("_local_") === true ||
        ingressUrl?.includes("localhost") === true
    );
}

/**
 * Get the base URL for Claude AI based on environment.
 */
export function getClaudeAiBaseUrl(
    sessionId?: string,
    ingressUrl?: string,
): string {
    if (isRemoteSessionLocal(sessionId, ingressUrl)) {
        return KALT_CODE_AI_LOCAL_BASE_URL;
    }
    if (isRemoteSessionStaging(sessionId, ingressUrl)) {
        return KALT_CODE_AI_STAGING_BASE_URL;
    }
    return KALT_CODE_AI_BASE_URL;
}

/**
 * Get the full session URL for a remote session.
 *
 * The cse_→session_ translation is a temporary shim gated by
 * tengu_bridge_repl_v2_cse_shim_enabled (see isCseShimEnabled). Worker
 * endpoints (/v1/code/sessions/{id}/worker/*) want `cse_*` but the claude.ai
 * frontend currently routes on `session_*` (compat/convert.go:27 validates
 * TagSession). Same UUID body, different tag prefix. Once the server tags by
 * environment_kind and the frontend accepts `cse_*` directly, flip the gate
 * off. No-op for IDs already in `session_*` form. See toCompatSessionId in
 * src/bridge/sessionIdCompat.ts for the canonical helper (lazy-required here
 * to keep constants/ leaf-of-DAG at module-load time).
 */
export function getRemoteSessionUrl(
    sessionId: string,
    ingressUrl?: string,
): string {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { toCompatSessionId } =
        require("../bridge/sessionIdCompat.js") as typeof import("../bridge/sessionIdCompat.js");
    /* eslint-enable @typescript-eslint/no-require-imports */
    const compatId = toCompatSessionId(sessionId);
    const baseUrl = getClaudeAiBaseUrl(compatId, ingressUrl);
    return `${baseUrl}/code/${compatId}`;
}
