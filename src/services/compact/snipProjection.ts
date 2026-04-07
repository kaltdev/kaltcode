// Stub — snipProjection not included in source snapshot
import type { Message } from "../../types/message.js";

export function projectSnippedView<T extends Message>(messages: T[]): T[] {
    return messages;
}
