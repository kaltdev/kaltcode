import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { getClientType, setClientType } from "../bootstrap/state.js";
import {
    getAttributionTexts,
    getDefaultCommitCoAuthorEmail,
    getDefaultCommitCoAuthorName,
    getEnhancedPRAttribution,
} from "./attribution.js";

import {
    resetSettingsCache,
    setSessionSettingsCache,
} from "./settings/settingsCache.js";
import type { SettingsJson } from "./settings/types.js";

const originalEnv = {
    CLAUDE_CODE_USE_OPENAI: process.env.CLAUDE_CODE_USE_OPENAI,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    OPENCLAUDE_DISABLE_CO_AUTHORED_BY:
        process.env.OPENCLAUDE_DISABLE_CO_AUTHORED_BY,
    CLAUDE_CODE_REMOTE_SESSION_ID: process.env.CLAUDE_CODE_REMOTE_SESSION_ID,
    SESSION_INGRESS_URL: process.env.SESSION_INGRESS_URL,
    USER_TYPE: process.env.USER_TYPE,
};
const originalClientType = getClientType();

const defaultPrAttribution =
    "🤖 Generated with [KaltCode](https://github.com/kaltdev/kaltcode)";

function useSettings(settings: SettingsJson): void {
    setSessionSettingsCache({ settings, errors: [] });
}

function restoreEnv(): void {
    for (const [key, value] of Object.entries(originalEnv)) {
        if (value === undefined) {
            delete process.env[key];
        } else {
            process.env[key] = value;
        }
    }
}

beforeEach(() => {
    resetSettingsCache();
    setClientType("cli");
    process.env.CLAUDE_CODE_USE_OPENAI = "1";
    process.env.OPENAI_MODEL = "gpt-5.5";
    delete process.env.OPENCLAUDE_DISABLE_CO_AUTHORED_BY;
    delete process.env.CLAUDE_CODE_REMOTE_SESSION_ID;
    delete process.env.SESSION_INGRESS_URL;
    delete process.env.USER_TYPE;
});

afterEach(() => {
    resetSettingsCache();
    setClientType(originalClientType);
    restoreEnv();
});

describe("getDefaultCommitCoAuthorName", () => {
    it("does not label unknown non-Claude provider models as Opus", () => {
        expect(
            getDefaultCommitCoAuthorName({
                model: "gpt-5.5",
                apiProvider: "openai",
                isInternalRepo: false,
            }),
        ).toBe("Kalt Code (gpt-5.5)");
    });

    it("does not apply internal Claude formatting to non-Claude providers", () => {
        expect(
            getDefaultCommitCoAuthorName({
                model: "gpt-5.5",
                apiProvider: "openai",
                isInternalRepo: true,
            }),
        ).toBe("Kalt Code (gpt-5.5)");
    });

    it("keeps the codename-safe fallback for unknown first-party models", () => {
        expect(
            getDefaultCommitCoAuthorName({
                model: "unreleased-internal-model",
                apiProvider: "firstParty",
                isInternalRepo: false,
            }),
        ).toBe("Claude Opus 4.6");
    });

    it("sanitizes unknown internal Claude co-author names", () => {
        expect(
            getDefaultCommitCoAuthorName({
                model: "bad\nmodel<id>",
                apiProvider: "firstParty",
                isInternalRepo: true,
            }),
        ).toBe("Claude (bad model id)");
    });

    it("does not duplicate the Claude prefix for Claude model names", () => {
        expect(
            getDefaultCommitCoAuthorName({
                model: "claude-opus-4-6",
                apiProvider: "firstParty",
                isInternalRepo: false,
            }),
        ).toBe("Claude Opus 4.6");
    });

    it("uses the Kalt Code email for commit attribution across providers", () => {
        expect(getDefaultCommitCoAuthorEmail("openai")).toBe(
            "kaltcode@kalt-code.dev",
        );
        expect(getDefaultCommitCoAuthorEmail("firstParty")).toBe(
            "kaltcode@kalt-code.dev",
        );
    });
});
