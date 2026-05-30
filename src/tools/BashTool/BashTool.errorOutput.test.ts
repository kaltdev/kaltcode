import { describe, expect, test } from "bun:test";
import { ShellError } from "../../utils/errors.js";
import { formatError } from "../../utils/toolErrors.js";

// Regression for #1231 — non-zero exit must not hide captured stdout/stderr.
// The Bash tool runs with a merged-fd setup (both streams to one file), so
// captured output lives on result.stdout. Before the fix, the throw passed
// stdout='' and put the merged output in the stderr slot of ShellError, which
// worked through formatError but lost the semantic mapping and made it easy
// for the failure path to drop output if downstream consumers only inspected
// stdout. These tests lock the contract: getErrorParts/formatError surface
// the captured output alongside the exit code.
//
// These tests construct ShellError directly (matching how BashTool.tsx throws
// it at line ~968) instead of calling BashTool.call(), which spawns real shell
// processes and progress-polling infrastructure that can hang in CI.

describe("BashTool error output (#1231)", () => {
    test("captured stdout/stderr appear in formatted error on non-zero exit", () => {
        // BashTool merges stdout+stderr into the stdout slot; stderr slot
        // carries the raw stderr (empty in file mode, populated in pipe mode).
        const err = new ShellError(
            "stdout-line\nstderr-line",
            "",
            1,
            false,
        );
        expect(err.code).toBe(1);
        const formatted = formatError(err);
        expect(formatted).toContain("Exit code 1");
        expect(formatted).toContain("stdout-line");
        expect(formatted).toContain("stderr-line");
    });

    test('"command not found" message reaches the formatted error', () => {
        const err = new ShellError("not found\n", "", 127, false);
        expect(err.code).toBe(127);
        const formatted = formatError(err);
        expect(formatted).toContain(`Exit code ${err.code}`);
        expect(formatted.toLowerCase()).toContain("not found");
    });

    test("captured output is carried on the stdout slot (semantic mapping)", () => {
        const err = new ShellError("merged-line\n", "", 2, false);
        expect(err.stdout).toContain("merged-line");
        expect(err.code).toBe(2);
    });

    test("empty-output failure still surfaces the exit code", () => {
        const err = new ShellError("", "", 1, false);
        expect(err.code).toBe(1);
        expect(formatError(err)).toBe("Exit code 1");
    });
});
