// Stub — message types not included in source snapshot
// These are the core message types used throughout the application.

import type { UUID } from "crypto";
import type {
    BetaContentBlock,
    BetaMessage,
} from "@anthropic-ai/sdk/resources/beta/messages/messages.mjs";
import type {
    ContentBlockParam,
    ToolResultBlockParam,
} from "@anthropic-ai/sdk/resources/index.mjs";
import type { BetaUsage as Usage } from "@anthropic-ai/sdk/resources/beta/messages/messages.mjs";
import type { APIError } from "@anthropic-ai/sdk";
import type { HookEvent } from "src/entrypoints/agentSdkTypes.js";
import type { PermissionMode } from "./permissions.js";
import type { Progress, AnyObject } from "../Tool.js";

/** Direction for partial compaction */
export type PartialCompactDirection = "oldest" | "newest";

/** Origin of a message */
export type MessageOrigin =
    | { type: "human" }
    | { type: "hook"; hookName: string }
    | { type: "scheduled_task"; taskId: string }
    | { type: "teammate"; agentId: string }
    | { type: "sdk" }
    | { type: "remote_control" };

/** SDK assistant message error */
export type SDKAssistantMessageError = {
    type: string;
    message: string;
};

/** Base user message */
export interface UserMessage {
    type: "user";
    uuid: UUID;
    timestamp: string;
    message: {
        role: "user";
        content: string | ContentBlockParam[];
    };
    isMeta?: true;
    isVisibleInTranscriptOnly?: true;
    isVirtual?: true;
    isCompactSummary?: true;
    summarizeMetadata?: {
        messagesSummarized: number;
        userContext?: string;
        direction?: PartialCompactDirection;
    };
    toolUseResult?: unknown;
    mcpMeta?: {
        _meta?: Record<string, unknown>;
        structuredContent?: Record<string, unknown>;
    };
    imagePasteIds?: number[];
    sourceToolAssistantUUID?: UUID;
    sourceToolUseID?: string;
    permissionMode?: PermissionMode;
    origin?: MessageOrigin;
}

/** Assistant message */
export interface AssistantMessage {
    type: "assistant";
    uuid: UUID;
    timestamp: string;
    message: BetaMessage & { context_management: unknown };
    isMeta?: true;
    isVirtual?: true;
    requestId?: string;
    isApiErrorMessage?: boolean;
    apiError?: {
        status?: number;
        error?: { type?: string; message?: string };
    };
    error?: SDKAssistantMessageError;
    errorDetails?: string;
    advisorModel?: string;
}

/** Attachment base */
export interface AttachmentMessage {
    type: "attachment";
    uuid: UUID;
    timestamp: string;
    attachment: Record<string, unknown>;
}

/** Progress message */
export interface ProgressMessage<P extends Progress = Progress> {
    type: "progress";
    data: P;
    toolUseID: string;
    parentToolUseID: string;
    uuid: UUID;
    timestamp: string;
}

/** System message level */
export type SystemMessageLevel = "info" | "warning" | "error";

/** Base system message */
export interface BaseSystemMessage {
    type: "system";
    uuid: UUID;
    timestamp: string;
    level?: SystemMessageLevel;
}

/** System informational message */
export interface SystemInformationalMessage extends BaseSystemMessage {
    subtype: "informational";
    text: string;
    toolUseID?: string;
    parentToolUseID?: string;
}

/** System API error message */
export interface SystemAPIErrorMessage extends BaseSystemMessage {
    subtype: "api_error";
    text: string;
    error?: APIError;
}

/** System API metrics message */
export interface SystemApiMetricsMessage extends BaseSystemMessage {
    subtype: "api_metrics";
    inputTokens: number;
    outputTokens: number;
    cacheCreationTokens: number;
    cacheReadTokens: number;
    cost?: number;
}

/** System compact boundary message */
export interface SystemCompactBoundaryMessage extends BaseSystemMessage {
    subtype: "compact_boundary";
    messagesSummarized?: number;
}

/** System microcompact boundary message */
export interface SystemMicrocompactBoundaryMessage extends BaseSystemMessage {
    subtype: "microcompact_boundary";
}

/** System local command message */
export interface SystemLocalCommandMessage extends BaseSystemMessage {
    subtype: "local_command";
    command: string;
    output?: string;
}

/** System memory saved message */
export interface SystemMemorySavedMessage extends BaseSystemMessage {
    subtype: "memory_saved";
    text: string;
}

/** System bridge status message */
export interface SystemBridgeStatusMessage extends BaseSystemMessage {
    subtype: "bridge_status";
    status: string;
}

/** System agents killed message */
export interface SystemAgentsKilledMessage extends BaseSystemMessage {
    subtype: "agents_killed";
    agentCount: number;
}

/** System away summary message */
export interface SystemAwaySummaryMessage extends BaseSystemMessage {
    subtype: "away_summary";
    text: string;
}

/** System permission retry message */
export interface SystemPermissionRetryMessage extends BaseSystemMessage {
    subtype: "permission_retry";
    text: string;
}

/** System scheduled task fire message */
export interface SystemScheduledTaskFireMessage extends BaseSystemMessage {
    subtype: "scheduled_task_fire";
    taskId: string;
    taskPrompt: string;
}

/** System stop hook summary message */
export interface SystemStopHookSummaryMessage extends BaseSystemMessage {
    subtype: "stop_hook_summary";
    text: string;
}

/** System turn duration message */
export interface SystemTurnDurationMessage extends BaseSystemMessage {
    subtype: "turn_duration";
    durationMs: number;
}

/** Tombstone message */
export interface TombstoneMessage {
    type: "tombstone";
    uuid: UUID;
    timestamp: string;
    originalType: string;
}

/** Tool use summary message */
export interface ToolUseSummaryMessage {
    type: "tool_use_summary";
    uuid: UUID;
    timestamp: string;
    toolName: string;
    summary: string;
}

/** Union of all system messages */
export type SystemMessage =
    | SystemInformationalMessage
    | SystemAPIErrorMessage
    | SystemApiMetricsMessage
    | SystemCompactBoundaryMessage
    | SystemMicrocompactBoundaryMessage
    | SystemLocalCommandMessage
    | SystemMemorySavedMessage
    | SystemBridgeStatusMessage
    | SystemAgentsKilledMessage
    | SystemAwaySummaryMessage
    | SystemPermissionRetryMessage
    | SystemScheduledTaskFireMessage
    | SystemStopHookSummaryMessage
    | SystemTurnDurationMessage;

/** Union of all messages */
export type Message =
    | UserMessage
    | AssistantMessage
    | AttachmentMessage
    | ProgressMessage
    | SystemMessage;

/** Normalized messages have single content blocks */
export type NormalizedAssistantMessage = AssistantMessage & {
    message: AssistantMessage["message"] & { content: [BetaContentBlock] };
};

export type NormalizedUserMessage = UserMessage & {
    message: UserMessage["message"] & { content: ContentBlockParam[] };
};

export type NormalizedMessage =
    | NormalizedAssistantMessage
    | NormalizedUserMessage
    | AttachmentMessage
    | ProgressMessage
    | SystemMessage;

/** Stream event types */
export type StreamEvent =
    | { type: "text"; text: string }
    | { type: "thinking"; thinking: string }
    | { type: "tool_use"; id: string; name: string; input: unknown }
    | { type: "content_block_stop" }
    | { type: "message_stop" }
    | { type: "error"; error: unknown };

/** Request start event */
export type RequestStartEvent = {
    type: "request_start";
    requestId: string;
};

/** Stop hook info */
export type StopHookInfo = {
    hookName: string;
    hookEvent: HookEvent;
    toolUseID?: string;
};
