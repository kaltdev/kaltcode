/**
 * Utilities for handling local installation
 */

import { access, chmod, writeFile } from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import {
    DEPRECATED_OPENCLAUDE_CONFIG_DIR_NAME,
    KALTCODE_CONFIG_DIR_NAME,
    LEGACY_CLAUDE_CONFIG_DIR_NAME,
    PRODUCT_CLI_NAME,
    PRODUCT_PACKAGE_TOKEN,
} from "../constants/product.js";
import { type ReleaseChannel, saveGlobalConfig } from "./config.js";
import { getClaudeConfigHomeDir } from "./envUtils.js";
import { getErrnoCode } from "./errors.js";
import { execFileNoThrowWithCwd } from "./execFileNoThrow.js";
import { getFsImplementation } from "./fsOperations.js";
import { logError } from "./log.js";
import { jsonStringify } from "./slowOperations.js";

// Lazy getters: getClaudeConfigHomeDir() is memoized and reads process.env.
// Evaluating at module scope would capture the value before entrypoints like
// hfi.tsx get a chance to set config env vars in main(), and would also
// populate the memoize cache with that stale value for all 150+ other callers.
function getLocalInstallDir(): string {
    return join(getClaudeConfigHomeDir(), "local");
}

function getDeprecatedOpenClaudeLocalInstallDir(homeDir = homedir()): string {
    return join(homeDir, DEPRECATED_OPENCLAUDE_CONFIG_DIR_NAME, "local");
}

function getLegacyLocalInstallDir(homeDir = homedir()): string {
    return join(homeDir, LEGACY_CLAUDE_CONFIG_DIR_NAME, "local");
}

export function getCandidateLocalInstallDirs(options?: {
    configHomeDir?: string;
    homeDir?: string;
}): string[] {
    const homeDir = options?.homeDir ?? homedir();
    const configHomeDir = options?.configHomeDir ?? getClaudeConfigHomeDir();
    return Array.from(
        new Set([
            join(configHomeDir, "local"),
            getDeprecatedOpenClaudeLocalInstallDir(homeDir),
            getLegacyLocalInstallDir(homeDir),
        ]),
    );
}

function getCandidateLocalBinaryPaths(localInstallDir: string): string[] {
    return [
        join(localInstallDir, "node_modules", ".bin", PRODUCT_CLI_NAME),
        join(localInstallDir, "node_modules", ".bin", PRODUCT_PACKAGE_TOKEN),
        join(localInstallDir, "node_modules", ".bin", "openclaude"),
        join(localInstallDir, "node_modules", ".bin", "claude"),
    ];
}

export function isManagedLocalInstallationPath(execPath: string): boolean {
    const normalizedExecPath = execPath.replace(/\\+/g, "/");
    return (
        normalizedExecPath.includes(
            `/${KALTCODE_CONFIG_DIR_NAME}/local/node_modules/`,
        ) ||
        normalizedExecPath.includes(
            `/${DEPRECATED_OPENCLAUDE_CONFIG_DIR_NAME}/local/node_modules/`,
        ) ||
        normalizedExecPath.includes(
            `/${LEGACY_CLAUDE_CONFIG_DIR_NAME}/local/node_modules/`,
        )
    );
}

export function getLocalKaltCodePath(): string {
    return join(getLocalInstallDir(), PRODUCT_CLI_NAME);
}

export function getLocalClaudePath(): string {
    return getLocalKaltCodePath();
}

/**
 * Check if we're running from our managed local installation
 */
export function isRunningFromLocalInstallation(): boolean {
    return isManagedLocalInstallationPath(process.argv[1] || "");
}

/**
 * Write `content` to `path` only if the file does not already exist.
 * Uses O_EXCL ('wx') for atomic create-if-missing.
 */
async function writeIfMissing(
    path: string,
    content: string,
    mode?: number,
): Promise<boolean> {
    try {
        await writeFile(path, content, { encoding: "utf8", flag: "wx", mode });
        return true;
    } catch (e) {
        if (getErrnoCode(e) === "EEXIST") return false;
        throw e;
    }
}

/**
 * Ensure the local package environment is set up
 * Creates the directory, package.json, and wrapper script
 */
export async function ensureLocalPackageEnvironment(): Promise<boolean> {
    try {
        const localInstallDir = getLocalInstallDir();

        // Create installation directory (recursive, idempotent)
        await getFsImplementation().mkdir(localInstallDir);

        // Create package.json if it doesn't exist
        await writeIfMissing(
            join(localInstallDir, "package.json"),
            jsonStringify(
                { name: "kaltcode-local", version: "0.0.1", private: true },
                null,
                2,
            ),
        );

        // Create the wrapper script if it doesn't exist
        const wrapperPath = getLocalClaudePath();
        const created = await writeIfMissing(
            wrapperPath,
            `#!/bin/sh\nexec "${localInstallDir}/node_modules/.bin/${PRODUCT_CLI_NAME}" "$@"`,
            0o755,
        );
        if (created) {
            // Mode in writeFile is masked by umask; chmod to ensure executable bit.
            await chmod(wrapperPath, 0o755);
        }

        return true;
    } catch (error) {
        logError(error);
        return false;
    }
}

/**
 * Install or update Kalt Code package in the local directory.
 * @param channel - Release channel to use (latest or stable)
 * @param specificVersion - Optional specific version to install (overrides channel)
 */
export async function installOrUpdateClaudePackage(
    channel: ReleaseChannel,
    specificVersion?: string | null,
): Promise<"in_progress" | "success" | "install_failed"> {
    try {
        // First ensure the environment is set up
        if (!(await ensureLocalPackageEnvironment())) {
            return "install_failed";
        }

        // Use specific version if provided, otherwise use channel tag
        const versionSpec = specificVersion
            ? specificVersion
            : channel === "stable"
              ? "stable"
              : "latest";
        const result = await execFileNoThrowWithCwd(
            "npm",
            ["install", `${MACRO.PACKAGE_URL}@${versionSpec}`],
            { cwd: getLocalInstallDir(), maxBuffer: 1000000 },
        );

        if (result.code !== 0) {
            const error = new Error(
                `Failed to install Kalt Code package: ${result.stderr}`,
            );
            logError(error);
            return result.code === 190 ? "in_progress" : "install_failed";
        }

        // Set installMethod to 'local' to prevent npm permission warnings
        saveGlobalConfig((current) => ({
            ...current,
            installMethod: "local",
        }));

        return "success";
    } catch (error) {
        logError(error);
        return "install_failed";
    }
}

/**
 * Check if local installation exists.
 * Pure existence probe — callers use this to choose update path / UI hints.
 */
export async function localInstallationExists(): Promise<boolean> {
    for (const localInstallDir of getCandidateLocalInstallDirs()) {
        for (const binaryPath of getCandidateLocalBinaryPaths(
            localInstallDir,
        )) {
            try {
                await access(binaryPath);
                return true;
            } catch {
                // Try next candidate
            }
        }
    }
    return false;
}

export async function getDetectedLocalInstallDir(): Promise<string | null> {
    for (const localInstallDir of getCandidateLocalInstallDirs()) {
        for (const binaryPath of getCandidateLocalBinaryPaths(
            localInstallDir,
        )) {
            try {
                await access(binaryPath);
                return localInstallDir;
            } catch {
                // Try next candidate
            }
        }
    }
    return null;
}

/**
 * Get shell type to determine appropriate path setup
 */
export function getShellType(): string {
    const shellPath = process.env.SHELL || "";
    if (shellPath.includes("zsh")) return "zsh";
    if (shellPath.includes("bash")) return "bash";
    if (shellPath.includes("fish")) return "fish";
    return "unknown";
}
