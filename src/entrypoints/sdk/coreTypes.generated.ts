// Stub — generated types not included in source snapshot

import type { HOOK_EVENTS } from "./coreTypes.js";

/** Hook event type derived from HOOK_EVENTS const array */
export type HookEvent = (typeof HOOK_EVENTS)[number];

/** SDK assistant message error */
export type SDKAssistantMessageError = {
    type: string;
    message: string;
};

/** SDK message types */
export type SDKMessage = {
    type: string;
    [key: string]: unknown;
};

export type SDKResultMessage = SDKMessage & {
    type: "result";
};

export type SDKUserMessage = {
    content: string | unknown[];
};

export type SDKSessionInfo = {
    sessionId: string;
    title?: string;
    [key: string]: unknown;
};

/** Hook input type */
export type HookInput = {
    hookEvent: HookEvent;
    toolName?: string;
    toolInput?: Record<string, unknown>;
    toolOutput?: unknown;
    toolError?: string;
    userMessage?: string;
    [key: string]: unknown;
};

/** Hook JSON output types */
export type SyncHookJSONOutput = {
    continue?: boolean;
    suppressOutput?: boolean;
    stopReason?: string;
    decision?: "approve" | "block";
    reason?: string;
    systemMessage?: string;
    hookSpecificOutput?: Record<string, unknown>;
};

export type AsyncHookJSONOutput = {
    async: true;
    asyncTimeout?: number;
};

export type HookJSONOutput = SyncHookJSONOutput | AsyncHookJSONOutput;

/** Permission update type */
export type PermissionUpdate = {
    tool: string;
    permission: string;
    [key: string]: unknown;
};

/** Non-nullable usage type */
export type NonNullableUsage = {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens: number;
    cache_read_input_tokens: number;
};
