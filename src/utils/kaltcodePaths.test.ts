import { afterEach, describe, expect, mock, test } from "bun:test";
import {
    existsSync,
    mkdirSync,
    mkdtempSync,
    readFileSync,
    rmSync,
    writeFileSync,
} from "fs";
import * as fsPromises from "fs/promises";
import { homedir, tmpdir } from "os";
import { join } from "path";
import { getDefaultPlansDirectory } from "./plans.ts";

const originalEnv = { ...process.env };
const originalArgv = [...process.argv];

async function importFreshEnvUtils() {
    return import(`./envUtils.ts?ts=${Date.now()}-${Math.random()}`);
}

async function importFreshSettings() {
    return import(`./settings/settings.ts?ts=${Date.now()}-${Math.random()}`);
}

async function importFreshLocalInstaller() {
    return import(`./localInstaller.ts?ts=${Date.now()}-${Math.random()}`);
}

afterEach(() => {
    process.env = { ...originalEnv };
    process.argv = [...originalArgv];
    mock.restore();
});

describe("Kalt Code paths", () => {
    test("defaults user config home to ~/.kalt-code", async () => {
        delete process.env.CLAUDE_CONFIG_DIR;
        const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils();

        expect(
            resolveClaudeConfigHomeDir({
                homeDir: homedir(),
            }),
        ).toBe(join(homedir(), ".kalt-code"));
    });

    test("hard-cuts user config home to ~/.kalt-code by default", async () => {
        delete process.env.CLAUDE_CONFIG_DIR;
        const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils();

        expect(
            resolveClaudeConfigHomeDir({
                homeDir: homedir(),
            }),
        ).toBe(join(homedir(), ".kalt-code"));
    });

    test("migrates legacy config home and global config files to .kalt-code", async () => {
        const tempHome = mkdtempSync(join(tmpdir(), "kalt-code-paths-test-"));
        try {
            mkdirSync(join(tempHome, ".claude", "skills", "legacy-skill"), {
                recursive: true,
            });
            writeFileSync(
                join(tempHome, ".claude", "skills", "legacy-skill", "SKILL.md"),
                "legacy skill",
            );
            writeFileSync(join(tempHome, ".claude", "settings.json"), "{}");
            writeFileSync(join(tempHome, ".claude.json"), '{"legacy":true}');
            writeFileSync(
                join(tempHome, ".claude-custom-oauth.json"),
                '{"custom":true}',
            );

            const { migrateLegacyClaudeConfigHome } =
                await importFreshEnvUtils();

            expect(migrateLegacyClaudeConfigHome({ homeDir: tempHome })).toBe(
                true,
            );
            expect(
                readFileSync(
                    join(
                        tempHome,
                        ".kalt-code",
                        "skills",
                        "legacy-skill",
                        "SKILL.md",
                    ),
                    "utf8",
                ),
            ).toBe("legacy skill");
            expect(
                existsSync(join(tempHome, ".kalt-code", "settings.json")),
            ).toBe(true);
            expect(
                readFileSync(join(tempHome, ".kalt-code.json"), "utf8"),
            ).toBe('{"legacy":true}');
            expect(
                readFileSync(
                    join(tempHome, ".kalt-code-custom-oauth.json"),
                    "utf8",
                ),
            ).toBe('{"custom":true}');
        } finally {
            rmSync(tempHome, { recursive: true, force: true });
        }
    });

    test("migration preserves existing .kalt-code data while copying missing legacy data", async () => {
        const tempHome = mkdtempSync(join(tmpdir(), "kalt-code-paths-test-"));
        try {
            mkdirSync(join(tempHome, ".claude", "skills", "legacy-skill"), {
                recursive: true,
            });
            mkdirSync(join(tempHome, ".kalt-code", "skills"), {
                recursive: true,
            });
            writeFileSync(join(tempHome, ".claude", "settings.json"), "legacy");
            writeFileSync(
                join(tempHome, ".kalt-code", "settings.json"),
                "current",
            );
            writeFileSync(
                join(tempHome, ".claude", "skills", "legacy-skill", "SKILL.md"),
                "legacy skill",
            );

            const { migrateLegacyClaudeConfigHome } =
                await importFreshEnvUtils();

            expect(migrateLegacyClaudeConfigHome({ homeDir: tempHome })).toBe(
                true,
            );
            expect(
                readFileSync(
                    join(tempHome, ".kalt-code", "settings.json"),
                    "utf8",
                ),
            ).toBe("current");
            expect(
                readFileSync(
                    join(
                        tempHome,
                        ".kalt-code",
                        "skills",
                        "legacy-skill",
                        "SKILL.md",
                    ),
                    "utf8",
                ),
            ).toBe("legacy skill");
        } finally {
            rmSync(tempHome, { recursive: true, force: true });
        }
    });

    test("migration skips explicit CLAUDE_CONFIG_DIR overrides", async () => {
        const tempHome = mkdtempSync(join(tmpdir(), "kalt-code-paths-test-"));
        try {
            mkdirSync(join(tempHome, ".claude"), { recursive: true });
            writeFileSync(join(tempHome, ".claude", "settings.json"), "legacy");

            const { migrateLegacyClaudeConfigHome } =
                await importFreshEnvUtils();

            expect(
                migrateLegacyClaudeConfigHome({
                    configDirEnv: join(tempHome, "custom-config"),
                    homeDir: tempHome,
                }),
            ).toBe(true);
            expect(existsSync(join(tempHome, ".kalt-code"))).toBe(false);
        } finally {
            rmSync(tempHome, { recursive: true, force: true });
        }
    });

    test("migration fails closed when .kalt-code collides with a non-directory", async () => {
        const tempHome = mkdtempSync(join(tmpdir(), "kalt-code-paths-test-"));
        try {
            writeFileSync(join(tempHome, ".kalt-code"), "not a directory");
            mkdirSync(join(tempHome, ".claude"), { recursive: true });
            writeFileSync(join(tempHome, ".claude", "settings.json"), "legacy");

            const { migrateLegacyClaudeConfigHome } =
                await importFreshEnvUtils();

            expect(migrateLegacyClaudeConfigHome({ homeDir: tempHome })).toBe(
                false,
            );
        } finally {
            rmSync(tempHome, { recursive: true, force: true });
        }
    });

    test("migration ignores non-directory legacy config homes", async () => {
        const tempHome = mkdtempSync(join(tmpdir(), "kalt-code-paths-test-"));
        try {
            writeFileSync(join(tempHome, ".claude"), "not a directory");

            const { migrateLegacyClaudeConfigHome } =
                await importFreshEnvUtils();

            expect(migrateLegacyClaudeConfigHome({ homeDir: tempHome })).toBe(
                true,
            );
            expect(existsSync(join(tempHome, ".kalt-code"))).toBe(false);
        } finally {
            rmSync(tempHome, { recursive: true, force: true });
        }
    });

    test("config home falls back to legacy when migration fails on a non-directory .kalt-code collision", async () => {
        const tempHome = mkdtempSync(join(tmpdir(), "kalt-code-paths-test-"));
        try {
            writeFileSync(join(tempHome, ".kalt-code"), "not a directory");
            mkdirSync(join(tempHome, ".claude"), { recursive: true });
            mock.module("os", () => ({
                homedir: () => tempHome,
                tmpdir,
            }));
            delete process.env.CLAUDE_CONFIG_DIR;

            const { getClaudeConfigHomeDir } = await importFreshEnvUtils();

            expect(getClaudeConfigHomeDir()).toBe(join(tempHome, ".claude"));
        } finally {
            rmSync(tempHome, { recursive: true, force: true });
        }
    });

    test("default plans directory uses ~/.kalt-code/plans", async () => {
        delete process.env.CLAUDE_CONFIG_DIR;

        expect(
            getDefaultPlansDirectory({
                configDirEnv: "",
                legacyConfigDirEnv: "",
                homeDir: homedir(),
            }),
        ).toBe(join(homedir(), ".kalt-code", "plans"));
    });

    test("default plans directory respects explicit CLAUDE_CONFIG_DIR", async () => {
        expect(
            getDefaultPlansDirectory({
                configDirEnv: "/tmp/custom-kalt-code",
            }),
        ).toBe(join("/tmp/custom-kalt-code", "plans"));
    });

    test("default plans directory normalizes generated path to NFC", async () => {
        expect(
            getDefaultPlansDirectory({
                configDirEnv: "",
                legacyConfigDirEnv: "",
                homeDir: "/tmp/cafe\u0301",
            }),
        ).toBe(join("/tmp/caf\u00e9", ".kalt-code", "plans"));
    });

    test("default plans directory normalizes explicit CLAUDE_CONFIG_DIR to NFC", async () => {
        expect(
            getDefaultPlansDirectory({
                configDirEnv: "/tmp/cafe\u0301-kalt-code",
            }),
        ).toBe(join("/tmp/caf\u00e9-kalt-code", "plans"));
    });

    test("uses CLAUDE_CONFIG_DIR override when provided", async () => {
        process.env.CLAUDE_CONFIG_DIR = "/tmp/custom-kalt-code";
        const { getClaudeConfigHomeDir, resolveClaudeConfigHomeDir } =
            await importFreshEnvUtils();

        expect(getClaudeConfigHomeDir()).toBe("/tmp/custom-kalt-code");
        expect(
            resolveClaudeConfigHomeDir({
                configDirEnv: "/tmp/custom-kalt-code",
            }),
        ).toBe("/tmp/custom-kalt-code");
    });

    test("project and local settings paths use .kalt-code", async () => {
        const { getRelativeSettingsFilePathForSource } =
            await importFreshSettings();

        expect(getRelativeSettingsFilePathForSource("projectSettings")).toBe(
            ".kalt-code/settings.json",
        );
        expect(getRelativeSettingsFilePathForSource("localSettings")).toBe(
            ".kalt-code/settings.local.json",
        );
    });

    test("local installer uses kalt-code wrapper path", async () => {
        // Force .kalt-code config home so the test doesn't fall back to
        // ~/.claude when ~/.kalt-code doesn't exist on this machine.
        process.env.CLAUDE_CONFIG_DIR = join(homedir(), ".kalt-code");
        const { getLocalClaudePath } = await importFreshLocalInstaller();

        expect(getLocalClaudePath()).toBe(
            join(homedir(), ".kalt-code", "local", "kalt-code"),
        );
    });

    test("local installation detection matches .kalt-code path", async () => {
        const { isManagedLocalInstallationPath } =
            await importFreshLocalInstaller();

        expect(
            isManagedLocalInstallationPath(
                `${join(homedir(), ".kalt-code", "local")}/node_modules/.bin/kalt-code`,
            ),
        ).toBe(true);
    });

    test("local installation detection still matches legacy .claude path", async () => {
        const { isManagedLocalInstallationPath } =
            await importFreshLocalInstaller();

        expect(
            isManagedLocalInstallationPath(
                `${join(homedir(), ".claude", "local")}/node_modules/.bin/openclaude`,
            ),
        ).toBe(true);
    });

    test("candidate local install dirs include Kalt Code and legacy Claude paths", async () => {
        const { getCandidateLocalInstallDirs } =
            await importFreshLocalInstaller();

        expect(
            getCandidateLocalInstallDirs({
                configHomeDir: join(homedir(), ".kalt-code"),
                homeDir: homedir(),
            }),
        ).toEqual([
            join(homedir(), ".kalt-code", "local"),
            join(homedir(), ".claude", "local"),
        ]);
    });

    test("legacy local installs are detected when they still expose the claude binary", async () => {
        mock.module("fs/promises", () => ({
            ...fsPromises,
            access: async (path: string) => {
                if (
                    path ===
                    join(
                        homedir(),
                        ".claude",
                        "local",
                        "node_modules",
                        ".bin",
                        "claude",
                    )
                ) {
                    return;
                }
                throw Object.assign(new Error("ENOENT"), { code: "ENOENT" });
            },
        }));

        const { getDetectedLocalInstallDir, localInstallationExists } =
            await importFreshLocalInstaller();

        expect(await localInstallationExists()).toBe(true);
        expect(await getDetectedLocalInstallDir()).toBe(
            join(homedir(), ".claude", "local"),
        );
    });
});
