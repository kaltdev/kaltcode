import { afterEach, expect, test } from "bun:test";

// MACRO is replaced at build time by Bun.define but not in test mode.
// Define it globally so tests that import modules using MACRO don't crash.
(globalThis as Record<string, unknown>).MACRO = {
    VERSION: "99.0.0",
    DISPLAY_VERSION: "0.0.0-test",
    BUILD_TIME: new Date().toISOString(),
    ISSUES_EXPLAINER:
        "report the issue at https://github.com/kaltdev/kaltcode/issues",
    PACKAGE_URL: "@kaltdev/kaltcode",
    NATIVE_PACKAGE_URL: undefined,
};

import { clearSystemPromptSections } from "./systemPromptSections.js";
import { getSystemPrompt, DEFAULT_AGENT_PROMPT } from "./prompts.js";
import { CLI_SYSPROMPT_PREFIXES, getCLISyspromptPrefix } from "./system.js";
import { KALT_CODE_GUIDE_AGENT } from "../tools/AgentTool/built-in/kaltCodeGuideAgent.js";
import { GENERAL_PURPOSE_AGENT } from "../tools/AgentTool/built-in/generalPurposeAgent.js";
import { EXPLORE_AGENT } from "../tools/AgentTool/built-in/exploreAgent.js";
import { PLAN_AGENT } from "../tools/AgentTool/built-in/planAgent.js";
import { STATUSLINE_SETUP_AGENT } from "../tools/AgentTool/built-in/statuslineSetup.js";

const originalSimpleEnv = process.env.CLAUDE_CODE_SIMPLE;

afterEach(() => {
    process.env.CLAUDE_CODE_SIMPLE = originalSimpleEnv;
    clearSystemPromptSections();
});

test("CLI identity prefixes describe Kalt Code instead of Claude Code", () => {
    expect(getCLISyspromptPrefix()).toContain("Kalt Code");
    expect(getCLISyspromptPrefix()).not.toContain("Claude Code");
    expect(getCLISyspromptPrefix()).not.toContain(
        "Anthropic's official CLI for Claude",
    );

    for (const prefix of CLI_SYSPROMPT_PREFIXES) {
        expect(prefix).toContain("Kalt Code");
        expect(prefix).not.toContain("Claude Code");
        expect(prefix).not.toContain("Anthropic's official CLI for Claude");
    }
});

test("simple mode identity describes Kalt Code instead of Claude Code", async () => {
    process.env.CLAUDE_CODE_SIMPLE = "1";

    const prompt = await getSystemPrompt([], "gpt-4o");

    expect(prompt[0]).toContain("Kalt Code");
    expect(prompt[0]).not.toContain("Claude Code");
    expect(prompt[0]).not.toContain("Anthropic's official CLI for Claude");
}, 20_000);

test("system prompt model identity updates when model changes mid-session", async () => {
    delete process.env.CLAUDE_CODE_SIMPLE;
    clearSystemPromptSections();

    const firstPrompt = await getSystemPrompt([], "old-test-model");
    const secondPrompt = await getSystemPrompt([], "new-test-model");

    const firstText = firstPrompt.join("\n");
    const secondText = secondPrompt.join("\n");

    expect(firstText).toContain("You are powered by the model old-test-model.");
    expect(secondText).toContain(
        "You are powered by the model new-test-model.",
    );
    expect(secondText).not.toContain(
        "You are powered by the model old-test-model.",
    );
}, 20_000);

test("built-in agent prompts describe Kalt Code instead of Claude Code", () => {
    expect(DEFAULT_AGENT_PROMPT).toContain("Kalt Code");
    expect(DEFAULT_AGENT_PROMPT).not.toContain("Claude Code");
    expect(DEFAULT_AGENT_PROMPT).not.toContain(
        "Anthropic's official CLI for Claude",
    );

    const generalPrompt = GENERAL_PURPOSE_AGENT.getSystemPrompt({
        toolUseContext: { options: {} as never },
    });
    expect(generalPrompt).toContain("Kalt Code");
    expect(generalPrompt).not.toContain("Claude Code");
    expect(generalPrompt).not.toContain("Anthropic's official CLI for Claude");

    const explorePrompt = EXPLORE_AGENT.getSystemPrompt({
        toolUseContext: { options: {} as never },
    });
    expect(explorePrompt).toContain("Kalt Code");
    expect(explorePrompt).not.toContain("Claude Code");
    expect(explorePrompt).not.toContain("Anthropic's official CLI for Claude");

    const planPrompt = PLAN_AGENT.getSystemPrompt({
        toolUseContext: { options: {} as never },
    });
    expect(planPrompt).toContain("Kalt Code");
    expect(planPrompt).not.toContain("Claude Code");

    const statuslinePrompt = STATUSLINE_SETUP_AGENT.getSystemPrompt({
        toolUseContext: { options: {} as never },
    });
    expect(statuslinePrompt).toContain("Kalt Code");
    expect(statuslinePrompt).not.toContain("Claude Code");

    const guidePrompt = KALT_CODE_GUIDE_AGENT.getSystemPrompt({
        toolUseContext: {
            options: {
                commands: [],
                agentDefinitions: { activeAgents: [] },
                mcpClients: [],
            } as never,
        },
    });
    expect(guidePrompt).toContain("Kalt Code");
    expect(guidePrompt).toContain("You are the Kalt Code guide agent.");
    expect(guidePrompt).toContain("**Kalt Code** (the CLI tool)");
    expect(guidePrompt).not.toContain("You are the Claude guide agent.");
    expect(guidePrompt).not.toContain("**Claude Code** (the CLI tool)");
});
