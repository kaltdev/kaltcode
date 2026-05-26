import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "bun:test";

const BIN_PATH = join(import.meta.dir, "..", "bin", "kalt-code");

describe("kaltcode launcher heap guard", () => {
    test("raises the current Node heap before loading dist/cli.mjs", () => {
        const source = readFileSync(BIN_PATH, "utf-8");

        expect(source).toContain("--max-old-space-size=");
        expect(source).toContain("--expose-gc");
        expect(source).toMatch(/spawnSync\s*\(\s*process\.execPath/);

        const relaunchCall = source.indexOf(
            "relaunchWithLongSessionHeapIfNeeded();",
        );
        const cliImport = source.indexOf(
            "await import(pathToFileURL(distPath).href)",
        );

        expect(relaunchCall).toBeGreaterThan(-1);
        expect(cliImport).toBeGreaterThan(-1);
        expect(relaunchCall).toBeLessThan(cliImport);
    });

    test("keeps user and troubleshooting escape hatches", () => {
        const source = readFileSync(BIN_PATH, "utf-8");

        expect(source).toContain("KALTCODE_DISABLE_HEAP_RELAUNCH");
        expect(source).toContain("KALTCODE_NODE_MAX_OLD_SPACE_SIZE_MB");
        expect(source).toContain("process.env.NODE_OPTIONS");
        expect(source).toMatch(
            /hasNodeOptionFlag\(\s*['"]--max-old-space-size['"]\s*\)/,
        );
    });
});
