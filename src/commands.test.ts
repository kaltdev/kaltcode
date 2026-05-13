import { describe, expect, test } from "bun:test";
import {
    builtInCommandNames,
    formatDescriptionWithSource,
    isCommand,
} from "./commands.js";

describe("builtInCommandNames", () => {
    test("includes the LSP command", () => {
        expect(builtInCommandNames()).toContain("lsp");
    });
});

describe("isCommand", () => {
    test("rejects null and undefined", () => {
        expect(isCommand(null)).toBe(false);
        expect(isCommand(undefined)).toBe(false);
    });

    test("rejects primitive values", () => {
        expect(isCommand(0)).toBe(false);
        expect(isCommand("")).toBe(false);
        expect(isCommand(true)).toBe(false);
    });

    test("rejects bare noop functions (tree-shaking stubs)", () => {
        const noop0 = () => {};
        const noop1 = (_a: unknown) => {};
        expect(isCommand(noop0)).toBe(false);
        expect(isCommand(noop1)).toBe(false);
    });

    test("rejects objects missing required fields", () => {
        expect(isCommand({})).toBe(false);
        expect(isCommand({ name: "test" })).toBe(false);
        expect(isCommand({ name: "test", description: "desc" })).toBe(false);
        expect(isCommand({ name: "test", type: "prompt" })).toBe(false);
        expect(isCommand({ description: "desc", type: "local" })).toBe(false);
    });

    test("rejects objects with empty name", () => {
        expect(
            isCommand({ name: "", description: "desc", type: "local" }),
        ).toBe(false);
    });

    test("rejects objects with invalid type", () => {
        expect(
            isCommand({ name: "test", description: "desc", type: "invalid" }),
        ).toBe(false);
        expect(
            isCommand({ name: "test", description: "desc", type: "noop" }),
        ).toBe(false);
    });

    test("accepts valid local command object", () => {
        const cmd = {
            name: "test-cmd",
            description: "A test command",
            type: "local",
            supportsNonInteractive: false,
            load: async () => ({
                call: async () => ({ type: "text" as const, value: "" }),
            }),
        };
        expect(isCommand(cmd)).toBe(true);
    });

    test("accepts valid prompt command object", () => {
        const cmd = {
            name: "test-prompt",
            description: "A test prompt command",
            type: "prompt",
            progressMessage: "testing",
            contentLength: 0,
            source: "builtin",
            getPromptForCommand: async () => [],
        };
        expect(isCommand(cmd)).toBe(true);
    });

    test("accepts valid local-jsx command object", () => {
        const cmd = {
            name: "test-jsx",
            description: "A test JSX command",
            type: "local-jsx",
            load: async () => ({ call: async () => null }),
        };
        expect(isCommand(cmd)).toBe(true);
    });
});

describe("formatDescriptionWithSource", () => {
    test("returns empty text for prompt commands missing a description", () => {
        const command = {
            name: "example",
            type: "prompt",
            source: "builtin",
            description: undefined,
        } as any;

        expect(formatDescriptionWithSource(command)).toBe("");
    });

    test("formats plugin commands with missing description safely", () => {
        const command = {
            name: "example",
            type: "prompt",
            source: "plugin",
            description: undefined,
            pluginInfo: {
                pluginManifest: {
                    name: "MyPlugin",
                },
            },
        } as any;

        expect(formatDescriptionWithSource(command)).toBe("(MyPlugin) ");
    });
});
