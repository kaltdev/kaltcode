# Kalt Code Branding Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the OpenClaude to Kalt Code rebrand across repository metadata, docs, runtime strings, paths, assets, protocols, extension metadata, tests, and compatibility shims.

**Architecture:** Make Kalt Code the primary identity everywhere, with `.kaltcode`, `kalt-code`, `kaltcode`, `KaltCode`, and `KALTCODE` chosen by technical context. Keep legacy OpenClaude names only as deprecated fallback reads for existing users or as explicit upstream/history references. Add a branding verification script so future upstream syncs cannot silently reintroduce first-party OpenClaude branding.

**Tech Stack:** Bun, TypeScript, React/Vite, CommonJS VS Code extension code, Markdown, JSON, YAML, gRPC proto-loader, git

---

## File Structure Map

- `src/constants/product.ts`: central Kalt Code naming, package, repository, config directory, and release URL constants.
- `src/utils/envUtils.ts`: config directory resolution and env-var compatibility helpers.
- `src/utils/env.ts`: global config filename resolution for `.kaltcode*.json` with deprecated fallbacks.
- `src/utils/localInstaller.ts`: managed local install paths, local wrapper name, and legacy install detection.
- `src/proto/kaltcode.proto`: canonical gRPC protocol definition.
- `src/grpc/server.ts` and `scripts/grpc-cli.ts`: canonical `kaltcode.v1` proto loading.
- `vscode-extension/kalt-code-vscode/**`: the only VS Code extension package retained after consolidation.
- `web/**`: Kalt Code website metadata, copy, package name, storage key, and asset references.
- `scripts/verify-kaltcode-branding.ts`: permanent branding audit with explicit allowlist for upstream/history/compatibility references.
- `src/**`, `scripts/**`, `tests/**`, `docs/**`, root metadata: first-party text and identifiers updated to the approved Kalt Code naming rules.

## Allowed Remaining OpenClaude References

After implementation, OpenClaude references are allowed only in:

- `CHANGELOG.md` historical release entries.
- `docs/superpowers/specs/2026-04-11-upstream-sync-automation-design.md`.
- `docs/plans/2026-04-11-upstream-sync-automation-implementation-plan.md`.
- `docs/superpowers/specs/2026-05-11-kalt-code-branding-migration-design.md`.
- `docs/superpowers/plans/2026-05-11-kalt-code-branding-migration-implementation-plan.md`.
- `scripts/upstream-sync-port.ts` and `src/upstreamSync/**` where the text names the upstream repository or the branding guard.
- Deprecated fallback code paths that explicitly mention OpenClaude in comments or string constants for migration from old user state.

No user-facing current product copy should say OpenClaude.

### Task 1: Capture Baseline Inventory

**Files:**
- Inspect: `README.md`
- Inspect: `.env.example`
- Inspect: `package.json`
- Inspect: `bun.lock`
- Inspect: `web/package.json`
- Inspect: `web/bun.lock`
- Inspect: `src/**`
- Inspect: `scripts/**`
- Inspect: `tests/**`
- Inspect: `vscode-extension/**`
- Inspect: `docs/**`

- [ ] **Step 1: Confirm the worktree is clean before implementation**

```bash
git status --short
```

Expected: no output. If the plan file is uncommitted, commit it or keep it staged separately before touching implementation files.

- [ ] **Step 2: Capture content matches**

```bash
rg -n --hidden -S "OpenClaude|openclaude|OPENCLAUDE|Open Claude|open-claude|open_claude|openClaude|OPEN_CLAUDE" -g '!.git' -g '!node_modules' -g '!dist' -g '!build' -g '!coverage' | tee /tmp/kaltcode-branding-content-before.txt
```

Expected: the file lists root docs, docs, source, tests, website, lockfiles, and the legacy VS Code extension folder. It must not include `.git` or `node_modules`.

- [ ] **Step 3: Capture path matches**

```bash
rg --files --hidden -g '!.git' -g '!node_modules' -g '!dist' -g '!build' -g '!coverage' | rg "OpenClaude|openclaude|OPENCLAUDE|Open Claude|open-claude|open_claude|openClaude|OPEN_CLAUDE" | tee /tmp/kaltcode-branding-paths-before.txt
```

Expected: includes `src/proto/openclaude.proto`, `web/public/openclaude.png`, `src/utils/openclaude*.test.ts`, and `vscode-extension/openclaude-vscode/**`.

- [ ] **Step 4: Capture current focused test behavior**

```bash
bun test src/constants/promptIdentity.test.ts src/utils/openclaudePaths.test.ts src/utils/openclaudeInstallSurfaces.test.ts src/utils/openclaudeUiSurfaces.test.ts tests/sdk/package-consumer-types.test.ts
```

Expected: tests may pass with old branding or fail on existing extension/config drift. Record the exact failure lines in the implementation notes if they fail.

### Task 2: Add Canonical Brand Constants and Compatibility Helpers

**Files:**
- Modify: `src/constants/product.ts`
- Modify: `src/utils/envUtils.ts`
- Modify: `src/utils/env.ts`
- Modify: `src/utils/localInstaller.ts`
- Rename: `src/utils/openclaudePaths.test.ts` -> `src/utils/kaltcodePaths.test.ts`
- Rename: `src/utils/openclaudeInstallSurfaces.test.ts` -> `src/utils/kaltcodeInstallSurfaces.test.ts`
- Rename: `src/utils/openclaudeUiSurfaces.test.ts` -> `src/utils/kaltcodeUiSurfaces.test.ts`

- [ ] **Step 1: Add product constants**

Add these exports to `src/constants/product.ts` while preserving the existing remote-session URL functions:

```ts
export const PRODUCT_DISPLAY_NAME = 'Kalt Code'
export const PRODUCT_PASCAL_NAME = 'KaltCode'
export const PRODUCT_CAMEL_NAME = 'kaltCode'
export const PRODUCT_PACKAGE_TOKEN = 'kaltcode'
export const PRODUCT_CLI_NAME = 'kalt-code'
export const PRODUCT_NPM_PACKAGE = '@kaltdev/kaltcode'
export const PRODUCT_REPOSITORY = 'https://github.com/kaltdev/kaltcode'
export const PRODUCT_ISSUES_URL = `${PRODUCT_REPOSITORY}/issues`
export const PRODUCT_DISCUSSIONS_URL = `${PRODUCT_REPOSITORY}/discussions`
export const PRODUCT_RELEASES_URL = `${PRODUCT_REPOSITORY}/releases`
export const KALTCODE_CONFIG_DIR_NAME = '.kaltcode'
export const DEPRECATED_OPENCLAUDE_CONFIG_DIR_NAME = '.openclaude'
export const LEGACY_CLAUDE_CONFIG_DIR_NAME = '.claude'
export const KALTCODE_CONFIG_DIR_ENV = 'KALTCODE_CONFIG_DIR'
export const LEGACY_CLAUDE_CONFIG_DIR_ENV = 'CLAUDE_CONFIG_DIR'
```

Expected: existing exports such as `PRODUCT_URL`, `KALT_CODE_AI_BASE_URL`, and `getRemoteSessionUrl()` still compile.

- [ ] **Step 2: Update config directory resolution**

In `src/utils/envUtils.ts`, import the new constants and replace the current `resolveClaudeConfigHomeDir()` implementation with a Kalt Code primary resolver plus a compatibility alias:

```ts
import {
  KALTCODE_CONFIG_DIR_ENV,
  KALTCODE_CONFIG_DIR_NAME,
  DEPRECATED_OPENCLAUDE_CONFIG_DIR_NAME,
  LEGACY_CLAUDE_CONFIG_DIR_ENV,
  LEGACY_CLAUDE_CONFIG_DIR_NAME,
} from '../constants/product.js'

export function resolveKaltCodeConfigHomeDir(options?: {
  configDirEnv?: string
  legacyConfigDirEnv?: string
  homeDir?: string
  kaltCodeExists?: boolean
  deprecatedOpenClaudeExists?: boolean
  legacyClaudeExists?: boolean
}): string {
  if (options?.configDirEnv) {
    return options.configDirEnv.normalize('NFC')
  }
  if (options?.legacyConfigDirEnv) {
    return options.legacyConfigDirEnv.normalize('NFC')
  }

  const homeDir = options?.homeDir ?? homedir()
  const kaltCodeDir = join(homeDir, KALTCODE_CONFIG_DIR_NAME)
  const deprecatedOpenClaudeDir = join(homeDir, DEPRECATED_OPENCLAUDE_CONFIG_DIR_NAME)
  const legacyClaudeDir = join(homeDir, LEGACY_CLAUDE_CONFIG_DIR_NAME)
  const kaltCodeExists = options?.kaltCodeExists ?? existsSync(kaltCodeDir)
  const deprecatedOpenClaudeExists =
    options?.deprecatedOpenClaudeExists ?? existsSync(deprecatedOpenClaudeDir)
  const legacyClaudeExists =
    options?.legacyClaudeExists ?? existsSync(legacyClaudeDir)

  if (kaltCodeExists) return kaltCodeDir.normalize('NFC')
  if (deprecatedOpenClaudeExists) return deprecatedOpenClaudeDir.normalize('NFC')
  if (legacyClaudeExists) return legacyClaudeDir.normalize('NFC')
  return kaltCodeDir.normalize('NFC')
}

/**
 * @deprecated Use resolveKaltCodeConfigHomeDir. Kept for internal call-site
 * compatibility while Kalt Code still reads legacy Claude/OpenClaude state.
 */
export function resolveClaudeConfigHomeDir(
  options?: Parameters<typeof resolveKaltCodeConfigHomeDir>[0],
): string {
  return resolveKaltCodeConfigHomeDir(options)
}
```

Then update the memoized getter to make `KALTCODE_CONFIG_DIR` win over the deprecated `CLAUDE_CONFIG_DIR`:

```ts
export const getClaudeConfigHomeDir = memoize(
  (): string =>
    resolveKaltCodeConfigHomeDir({
      configDirEnv: process.env[KALTCODE_CONFIG_DIR_ENV],
      legacyConfigDirEnv: process.env[LEGACY_CLAUDE_CONFIG_DIR_ENV],
    }),
  () =>
    `${process.env[KALTCODE_CONFIG_DIR_ENV] ?? ''}\0${
      process.env[LEGACY_CLAUDE_CONFIG_DIR_ENV] ?? ''
    }`,
)
```

Expected: existing callers of `getClaudeConfigHomeDir()` continue to work, but new installs default to `~/.kaltcode`.

- [ ] **Step 3: Add env fallback helpers**

Add these helpers to `src/utils/envUtils.ts` below `isEnvDefinedFalsy()`:

```ts
export function getEnvWithDeprecatedFallback(
  primaryKey: string,
  deprecatedKey: string,
): string | undefined {
  return process.env[primaryKey] ?? process.env[deprecatedKey]
}

export function isEnvTruthyWithDeprecatedFallback(
  primaryKey: string,
  deprecatedKey: string,
): boolean {
  return isEnvTruthy(getEnvWithDeprecatedFallback(primaryKey, deprecatedKey))
}

export function isEnvDefinedFalsyWithDeprecatedFallback(
  primaryKey: string,
  deprecatedKey: string,
): boolean {
  return isEnvDefinedFalsy(getEnvWithDeprecatedFallback(primaryKey, deprecatedKey))
}
```

Expected: later tasks can migrate `OPENCLAUDE_*` reads without duplicating precedence logic.

- [ ] **Step 4: Update global config filename resolution**

In `src/utils/env.ts`, use `.kaltcode*.json` as primary and `.openclaude*.json` as deprecated fallback before `.claude*.json`:

```ts
const configDir =
  process.env.KALTCODE_CONFIG_DIR || process.env.CLAUDE_CONFIG_DIR || homedir()
const newFilename = `.kaltcode${oauthSuffix}.json`
const deprecatedOpenClaudeFilename = `.openclaude${oauthSuffix}.json`
const legacyClaudeFilename = `.claude${oauthSuffix}.json`

if (
  !getFsImplementation().existsSync(join(configDir, newFilename)) &&
  getFsImplementation().existsSync(join(configDir, deprecatedOpenClaudeFilename))
) {
  return join(configDir, deprecatedOpenClaudeFilename)
}
if (
  !getFsImplementation().existsSync(join(configDir, newFilename)) &&
  !getFsImplementation().existsSync(join(configDir, deprecatedOpenClaudeFilename)) &&
  getFsImplementation().existsSync(join(configDir, legacyClaudeFilename))
) {
  return join(configDir, legacyClaudeFilename)
}
return join(configDir, newFilename)
```

Expected: new writes target `~/.kaltcode.json`; existing `~/.openclaude.json` and `~/.claude.json` continue to read when no new file exists.

- [ ] **Step 5: Update local installer naming**

In `src/utils/localInstaller.ts`, keep legacy detection but make new local state Kalt Code branded:

```ts
function getDeprecatedOpenClaudeLocalInstallDir(homeDir = homedir()): string {
  return join(homeDir, ".openclaude", "local");
}

function getLegacyLocalInstallDir(homeDir = homedir()): string {
  return join(homeDir, ".claude", "local");
}

function getCandidateLocalBinaryPaths(localInstallDir: string): string[] {
  return [
    join(localInstallDir, "node_modules", ".bin", "kalt-code"),
    join(localInstallDir, "node_modules", ".bin", "kaltcode"),
    join(localInstallDir, "node_modules", ".bin", "openclaude"),
    join(localInstallDir, "node_modules", ".bin", "claude"),
  ];
}
```

Also change the managed path check to include `/.kaltcode/local/node_modules/`, update the local package JSON name to `kaltcode-local`, update wrapper content to execute `node_modules/.bin/kalt-code`, and change install error text from `Claude CLI package` to `Kalt Code package`.

Expected: Kalt Code installs use `~/.kaltcode/local/kalt-code`, while old `.openclaude` and `.claude` local installs are still detected.

- [ ] **Step 6: Rename and update focused path tests**

Use `git mv` for the three test files:

```bash
git mv src/utils/openclaudePaths.test.ts src/utils/kaltcodePaths.test.ts
git mv src/utils/openclaudeInstallSurfaces.test.ts src/utils/kaltcodeInstallSurfaces.test.ts
git mv src/utils/openclaudeUiSurfaces.test.ts src/utils/kaltcodeUiSurfaces.test.ts
```

Update assertions so they expect:

```ts
expect(resolveClaudeConfigHomeDir({ homeDir, kaltCodeExists: false, deprecatedOpenClaudeExists: false, legacyClaudeExists: false })).toBe(join(homeDir, '.kaltcode'))
expect(resolveClaudeConfigHomeDir({ homeDir, kaltCodeExists: false, deprecatedOpenClaudeExists: true, legacyClaudeExists: false })).toBe(join(homeDir, '.openclaude'))
expect(resolveClaudeConfigHomeDir({ configDirEnv: '/tmp/custom-kaltcode', legacyConfigDirEnv: '/tmp/custom-openclaude' })).toBe('/tmp/custom-kaltcode')
expect(getInstallationPath()).toBe('~/.local/bin/kalt-code')
```

Expected: test names say Kalt Code, `.kaltcode` is primary, and `.openclaude` appears only in deprecated fallback cases.

- [ ] **Step 7: Run focused compatibility tests**

```bash
bun test src/utils/kaltcodePaths.test.ts src/utils/kaltcodeInstallSurfaces.test.ts src/utils/kaltcodeUiSurfaces.test.ts
```

Expected: all focused compatibility tests pass.

- [ ] **Step 8: Commit config compatibility work**

```bash
git add src/constants/product.ts src/utils/envUtils.ts src/utils/env.ts src/utils/localInstaller.ts src/utils/kaltcodePaths.test.ts src/utils/kaltcodeInstallSurfaces.test.ts src/utils/kaltcodeUiSurfaces.test.ts
git commit -m "chore: add Kalt Code compatibility foundations"
```

Expected: commit succeeds with only config, installer, product constants, and renamed focused tests.

### Task 3: Rename Canonical Paths, Protocols, and Assets

**Files:**
- Keep: `src/proto/kaltcode.proto`
- Delete: `src/proto/openclaude.proto`
- Modify: `src/grpc/server.ts`
- Modify: `scripts/grpc-cli.ts`
- Modify: `scripts/start-grpc.ts`
- Rename: `web/public/openclaude.png` -> `web/public/kalt-code.png`
- Delete: `vscode-extension/openclaude-vscode/**`
- Modify: `README.md`

- [ ] **Step 1: Update gRPC server to load the Kalt Code proto**

In `src/grpc/server.ts`, change the proto constants to:

```ts
const PROTO_PATH = path.resolve(import.meta.dirname, '../proto/kaltcode.proto')
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any
const kaltCodeProto = protoDescriptor.kaltcode.v1
```

Then change the service registration:

```ts
this.server.addService(kaltCodeProto.AgentService.service, {
  Chat: this.handleChat.bind(this),
})
```

Expected: no `openclaudeProto` identifier remains in `src/grpc/server.ts`.

- [ ] **Step 2: Update the gRPC CLI helper**

In `scripts/grpc-cli.ts`, change:

```ts
const PROTO_PATH = path.resolve(import.meta.dirname, '../src/proto/kaltcode.proto')
const kaltCodeProto = protoDescriptor.kaltcode.v1
```

Then instantiate:

```ts
const client = new kaltCodeProto.AgentService(
  `${host}:${port}`,
  grpc.credentials.createInsecure(),
)
```

Update the banner to:

```ts
console.log('\x1b[32mKalt Code gRPC CLI\x1b[0m')
```

Expected: no `openclaudeProto` identifier remains in `scripts/grpc-cli.ts`.

- [ ] **Step 3: Update gRPC startup text**

In `scripts/start-grpc.ts`, change the package URL default and startup log:

```ts
PACKAGE_URL: '@kaltdev/kaltcode',
```

```ts
console.log('Starting Kalt Code gRPC Server...')
```

Expected: gRPC startup output uses Kalt Code.

- [ ] **Step 4: Remove the old proto file**

```bash
git rm src/proto/openclaude.proto
```

Expected: `src/proto/kaltcode.proto` remains and `rg --files src/proto | rg openclaude` prints no output.

- [ ] **Step 5: Rename the website image asset**

```bash
git mv web/public/openclaude.png web/public/kalt-code.png
```

Expected: `web/public/kalt-code.png` exists and `web/public/openclaude.png` is removed.

- [ ] **Step 6: Remove the stale legacy extension folder**

```bash
git rm -r vscode-extension/openclaude-vscode
```

Expected: `vscode-extension/kalt-code-vscode` is the only checked-in extension package.

- [ ] **Step 7: Update README path references for renamed artifacts**

Change current references to:

```md
*Note: The gRPC definitions are located in `src/proto/kaltcode.proto`. You can use this file to generate clients in Python, Go, Rust, or any other language.*

- `vscode-extension/kalt-code-vscode/` - VS Code extension

The repo includes a VS Code extension in [`vscode-extension/kalt-code-vscode`](vscode-extension/kalt-code-vscode) for Kalt Code launch integration, provider-aware control-center UI, and theme support.
```

Expected: README no longer points to `src/proto/openclaude.proto` or `vscode-extension/openclaude-vscode`.

- [ ] **Step 8: Commit path and protocol renames**

```bash
git add src/grpc/server.ts scripts/grpc-cli.ts scripts/start-grpc.ts README.md src/proto/kaltcode.proto web/public/kalt-code.png
git commit -m "chore: rename Kalt Code paths and protocol metadata"
```

Expected: commit includes the old proto removal, old website asset rename, and legacy extension folder removal.

### Task 4: Update Package, Release, Documentation, and Website Branding

**Files:**
- Modify: `package.json`
- Modify: `bun.lock`
- Modify: `release-please-config.json`
- Modify: `.release-please-manifest.json`
- Modify: `.gitignore`
- Modify: `.env.example`
- Modify: `README.md`
- Modify: `ANDROID_INSTALL.md`
- Modify: `PLAYBOOK.md`
- Modify: `CONTRIBUTING.md`
- Modify: `SECURITY.md`
- Modify: `.github/ISSUE_TEMPLATE/bug_report.md`
- Modify: `.github/ISSUE_TEMPLATE/config.yml`
- Modify: `.github/ISSUE_TEMPLATE/feature_request.md`
- Modify: `.github/pull_request_template.md`
- Modify: `.github/workflows/pr-checks.yml`
- Modify: `.github/workflows/release.yml`
- Modify: `Dockerfile`
- Modify: `docs/advanced-setup.md`
- Modify: `docs/architecture/integrations.md`
- Modify: `docs/hook-chains.md`
- Modify: `docs/integrations/how-to/add-gateway.md`
- Modify: `docs/integrations/how-to/add-vendor.md`
- Modify: `docs/litellm-setup.md`
- Modify: `src/tools/WebSearchTool/README_SEARCH_PROVIDERS.md`
- Modify: `web/package.json`
- Modify: `web/bun.lock`
- Modify: `web/index.html`
- Modify: `web/src/App.tsx`
- Modify: `web/src/content.ts`

- [ ] **Step 1: Update root package metadata**

Ensure `package.json` uses this metadata:

```json
{
  "name": "@kaltdev/kaltcode",
  "description": "Kalt Code opens coding-agent workflows to any LLM — OpenAI, Gemini, DeepSeek, Ollama, and 200+ models",
  "bin": {
    "kaltcode": "./bin/kalt-code",
    "kalt-code": "./bin/kalt-code"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/kaltdev/kaltcode.git"
  }
}
```

Expected: `package.json` has no `@gitlawb/openclaude`, `OpenClaude`, or `openclaude` product metadata.

- [ ] **Step 2: Update release-please metadata**

In `release-please-config.json`, set:

```json
"package-name": "@kaltdev/kaltcode"
```

Expected: release automation names the Kalt Code npm package.

- [ ] **Step 3: Update ignore rules**

In `.gitignore`, keep deprecated entries ignored and add Kalt Code entries:

```gitignore
.kaltcode-profile.json
.kaltcode/
.openclaude-profile.json
.openclaude/
```

Expected: new config artifacts and legacy config artifacts are not accidentally committed.

- [ ] **Step 4: Update root docs and setup examples**

Use these canonical replacements in README and setup docs:

```md
# Kalt Code

Kalt Code is an open-source coding-agent CLI for cloud and local model providers.
```

```bash
npm install -g @kaltdev/kaltcode
kalt-code
ollama launch kalt-code --model qwen2.5-coder:7b
```

```md
Add to `~/.kaltcode.json`:
```

Expected: active setup instructions use Kalt Code, `@kaltdev/kaltcode`, `kalt-code`, and `.kaltcode`.

- [ ] **Step 5: Update `.env.example` with new env vars and deprecated aliases**

Replace user-facing OpenClaude env examples with Kalt Code names:

```dotenv
# KALTCODE_ENABLE_EXTENDED_KEYS=1
# KALTCODE_DISABLE_CO_AUTHORED_BY=1
# KALTCODE_DISABLE_STRICT_TOOLS=1
# KALTCODE_DISABLE_TOOL_REMINDERS=1
# KALTCODE_LOG_TOKEN_USAGE=verbose
```

Add a short compatibility note near those variables:

```dotenv
# Deprecated OPENCLAUDE_* aliases are still read for existing environments, but
# KALTCODE_* names take precedence when both are set.
```

Expected: `.env.example` presents Kalt Code as primary and mentions OpenClaude only as deprecated aliases.

- [ ] **Step 6: Update docs with client headers and package names**

In integration docs, change example first-party client headers from:

```ts
'X-Acme-Client': 'openclaude'
```

to:

```ts
'X-Acme-Client': 'kalt-code'
```

Expected: vendor/gateway examples identify Kalt Code, not OpenClaude.

- [ ] **Step 7: Update website package and content**

In `web/package.json`, set:

```json
"name": "kaltcode-web"
```

In `web/src/content.ts`, set:

```ts
export const installCommand = 'npm install -g @kaltdev/kaltcode'
```

Update feature copy to use `.kaltcode-profile.json`, `kalt-code`, and `https://github.com/kaltdev/kaltcode`.

Expected: web package and copy are Kalt Code branded.

- [ ] **Step 8: Update website HTML and app asset references**

In `web/index.html`, use:

```html
<meta name="description" content="Kalt Code — runs anywhere, uses anything. Open source, model-neutral, terminal-first." />
<meta property="og:title" content="Kalt Code — runs anywhere, uses anything" />
<meta property="og:site_name" content="Kalt Code" />
<meta name="twitter:title" content="Kalt Code — runs anywhere, uses anything" />
<title>Kalt Code — runs anywhere, uses anything</title>
<link rel="icon" type="image/png" href="/kalt-code.png" />
```

In the theme bootstrap, read legacy storage but write the new key later:

```js
var stored = localStorage.getItem('kalt-code-theme') || localStorage.getItem('openclaude-theme');
```

In `web/src/App.tsx`, write:

```ts
localStorage.setItem('kalt-code-theme', theme)
```

Use `/kalt-code.png`, `aria-label="Kalt Code home"`, visible text `Kalt Code`, and command text `kalt-code`.

Expected: website metadata, storage, visible brand, and asset paths are Kalt Code branded.

- [ ] **Step 9: Regenerate lockfiles**

```bash
bun install --lockfile-only
bun install --cwd web --lockfile-only
```

Expected: `bun.lock` root package name is `@kaltdev/kaltcode`, and `web/bun.lock` package name is `kaltcode-web`.

- [ ] **Step 10: Run docs and website searches**

```bash
rg -n "OpenClaude|openclaude|OPENCLAUDE" README.md .env.example docs web package.json bun.lock release-please-config.json .github Dockerfile
```

Expected: remaining matches are only in approved upstream/history docs or deprecated alias notes.

- [ ] **Step 11: Commit package, docs, and website work**

```bash
git add package.json bun.lock release-please-config.json .release-please-manifest.json .gitignore .env.example README.md ANDROID_INSTALL.md PLAYBOOK.md CONTRIBUTING.md SECURITY.md .github Dockerfile docs src/tools/WebSearchTool/README_SEARCH_PROVIDERS.md web
git commit -m "chore: update package docs and website branding"
```

Expected: commit succeeds with docs, metadata, website, and lockfile branding changes.

### Task 5: Update Runtime Product Strings, Env Vars, Telemetry, and Tests

**Files:**
- Modify: `src/constants/system.ts`
- Modify: `src/constants/prompts.ts`
- Modify: `src/constants/promptIdentity.test.ts`
- Modify: `src/commands.ts`
- Modify: `src/screens/Doctor.tsx`
- Modify: `src/entrypoints/cli.tsx`
- Modify: `src/ink/components/App.tsx`
- Modify: `src/ink/termio/osc.ts`
- Modify: `src/ink/termio/osc.test.ts`
- Modify: `src/tools/FileReadTool/FileReadTool.ts`
- Modify: `src/utils/messages.ts`
- Modify: `src/services/api/openaiShim.ts`
- Modify: `src/utils/knowledgeGraph.ts`
- Modify: `src/utils/knowledgeGraph.test.ts`
- Modify: `src/utils/knowledgeGraph.stress.test.ts`
- Modify: `src/utils/providerProfile.ts`
- Modify: `src/utils/providerProfile.test.ts`
- Modify: `src/utils/providerProfiles.test.ts`
- Modify: `src/utils/secureStorage/windowsCredentialStorage.ts`
- Modify: `src/utils/secureStorage/platformStorage.test.ts`
- Modify: `src/utils/releaseNotes.ts`
- Modify: `src/utils/releaseNotes.test.ts`
- Modify: `src/utils/version.ts`
- Modify: `src/utils/attribution.ts`
- Modify: `src/utils/attribution.test.ts`
- Modify: `src/utils/providerFlag.ts`
- Modify: `src/utils/providerValidation.ts`
- Modify: `src/utils/doctorDiagnostic.ts`
- Modify: `src/utils/auth.ts`
- Modify: `src/utils/model/modelCache.ts`
- Modify: `src/utils/model/benchmark.ts`
- Modify: `src/services/wiki/paths.ts`
- Modify: `src/utils/permissions/filesystem.ts`
- Modify: `src/utils/markdownConfigLoader.ts`
- Modify: `src/tools/AgentTool/built-in/generalPurposeAgent.ts`
- Modify: `src/tools/AgentTool/built-in/planAgent.ts`
- Modify: `src/tools/AgentTool/built-in/exploreAgent.ts`
- Modify: `src/tools/AgentTool/built-in/statuslineSetup.ts`
- Modify: `src/tools/AgentTool/built-in/claudeCodeGuideAgent.ts`
- Modify: `tests/sdk/package-consumer-types.test.ts`

- [ ] **Step 1: Update system prompt identity**

In `src/constants/system.ts`, replace the three prefixes with:

```ts
const DEFAULT_PREFIX =
  `You are Kalt Code, an open-source coding agent and CLI.`
const AGENT_SDK_CLAUDE_CODE_PRESET_PREFIX =
  `You are Kalt Code, an open-source coding agent and CLI running within the Claude Agent SDK.`
const AGENT_SDK_PREFIX =
  `You are Kalt Code, built on the Claude Agent SDK.`
```

Expected: `getCLISyspromptPrefix()` returns Kalt Code text.

- [ ] **Step 2: Update prompt identity tests**

In `src/constants/promptIdentity.test.ts`, update the mock constants and assertions:

```ts
ISSUES_EXPLAINER: 'report the issue at https://github.com/kaltdev/kaltcode/issues',
PACKAGE_URL: '@kaltdev/kaltcode',
```

Assertions should contain `Kalt Code` and should not contain `OpenClaude`:

```ts
expect(getCLISyspromptPrefix()).toContain('Kalt Code')
expect(getCLISyspromptPrefix()).not.toContain('OpenClaude')
```

Expected: prompt tests validate Kalt Code identity.

- [ ] **Step 3: Update built-in prompts and agent prompts**

Use these replacements in first-party prompt strings:

```ts
`/help: Get help with using Kalt Code`
`If the user reports a bug, slowness, or unexpected behavior with Kalt Code itself`
`You are Kalt Code, an open-source coding agent and CLI.`
`Kalt Code is available as a CLI in the terminal and can be used across local development environments and IDE workflows.`
`Fast mode for Kalt Code uses the same ${FRONTIER_MODEL_NAME} model with faster output.`
export const DEFAULT_AGENT_PROMPT = `You are an agent for Kalt Code, an open-source coding agent and CLI. Given the user's message, you should use the tools available to complete the task. Complete the task fully—don't gold-plate, but don't leave it half-done. When you complete the task, respond with a concise report covering what was done and any key findings — the caller will relay this to the user, so it only needs the essentials.`
```

Expected: built-in agents identify as Kalt Code, while references to Claude Code docs remain only where they identify upstream compatibility docs.

- [ ] **Step 4: Migrate `OPENCLAUDE_*` env reads with deprecated fallback**

Use `getEnvWithDeprecatedFallback()` or `isEnvTruthyWithDeprecatedFallback()` for each runtime env var:

```ts
isEnvTruthyWithDeprecatedFallback(
  'KALTCODE_DISABLE_TOOL_REMINDERS',
  'OPENCLAUDE_DISABLE_TOOL_REMINDERS', // deprecated alias
)
```

```ts
const v = (
  getEnvWithDeprecatedFallback(
    'KALTCODE_LOG_TOKEN_USAGE',
    'OPENCLAUDE_LOG_TOKEN_USAGE', // deprecated alias
  ) ?? ''
).trim().toLowerCase()
```

```ts
process.env.KALTCODE_DISABLE_EARLY_INPUT !== '1' &&
  process.env.OPENCLAUDE_DISABLE_EARLY_INPUT !== '1' // deprecated alias
```

```ts
isEnvTruthyWithDeprecatedFallback(
  'KALTCODE_DISABLE_STRICT_TOOLS',
  'OPENCLAUDE_DISABLE_STRICT_TOOLS', // deprecated alias
)
```

Expected: `KALTCODE_*` env vars win, `OPENCLAUDE_*` aliases remain only as deprecated fallbacks.

- [ ] **Step 5: Update clipboard temp env names**

In `src/ink/termio/osc.ts`, rename the generated temp file prefix and env key to Kalt Code:

```ts
const tempPath = generateTempFilePath('kaltcode-clipboard', '.txt')
```

```ts
KALTCODE_CLIPBOARD_TEXT_B64: encodedText
```

In `src/ink/termio/osc.test.ts`, update the expected path and env key:

```ts
const mockedClipboardPath = join(process.cwd(), 'kaltcode-clipboard.txt')
```

```ts
KALTCODE_CLIPBOARD_TEXT_B64: expect.any(String)
```

Expected: clipboard fallback no longer emits OpenClaude identifiers.

- [ ] **Step 6: Update attribution and release metadata**

In `src/utils/attribution.ts`, use Kalt Code names:

```ts
return sanitizedModel ? `Kalt Code (${sanitizedModel})` : 'Kalt Code'
```

```ts
return 'kaltcode@kaltdev.dev'
```

```ts
'🤖 Generated with [Kalt Code](https://github.com/kaltdev/kaltcode)'
```

In `src/utils/version.ts`, rename `OPENCLAUDE_RELEASES_URL` to `KALTCODE_RELEASES_URL` and point it to:

```ts
export const KALTCODE_RELEASES_URL =
  'https://github.com/kaltdev/kaltcode/releases'
```

Expected: commit trailers, release URLs, and tests use Kalt Code.

- [ ] **Step 7: Update SDK package consumer tests**

In `tests/sdk/package-consumer-types.test.ts`, use:

```ts
const pkgDir = join(tmpDir, 'node_modules', '@kaltdev', 'kaltcode')
```

```ts
name: '@kaltdev/kaltcode',
```

```ts
`} from '@kaltdev/kaltcode/sdk'`
```

Expected: SDK consumer tests match the canonical npm package.

- [ ] **Step 8: Update project config path surfaces**

In `src/utils/permissions/filesystem.ts`, `src/utils/markdownConfigLoader.ts`, and related tests, make `.kaltcode` primary and `.openclaude` deprecated fallback:

```ts
const PROJECT_CONFIG_DIR_NAMES = [".kaltcode", ".openclaude", ".claude"] as const;
```

Use `.kaltcode/settings.json`, `.kaltcode/settings.local.json`, `.kaltcode/agents`, `.kaltcode/commands`, and `.kaltcode/skills` for new examples and writes. Keep `.openclaude` only in reads/tests that prove fallback behavior.

Expected: UI save destinations and validation tips display `.kaltcode`.

- [ ] **Step 9: Run runtime-focused tests**

```bash
bun test src/constants/promptIdentity.test.ts src/utils/attribution.test.ts src/utils/knowledgeGraph.test.ts src/utils/knowledgeGraph.stress.test.ts src/ink/termio/osc.test.ts tests/sdk/package-consumer-types.test.ts src/utils/kaltcodePaths.test.ts src/utils/kaltcodeInstallSurfaces.test.ts src/utils/kaltcodeUiSurfaces.test.ts
```

Expected: all listed tests pass.

- [ ] **Step 10: Commit runtime branding work**

```bash
git add src scripts tests
git commit -m "chore: rename runtime branding to Kalt Code"
```

Expected: commit succeeds with runtime strings, env aliases, tests, package consumer names, and config path surfaces.

### Task 6: Consolidate and Repair the VS Code Extension Package

**Files:**
- Modify: `vscode-extension/kalt-code-vscode/package.json`
- Modify: `vscode-extension/kalt-code-vscode/README.md`
- Modify: `vscode-extension/kalt-code-vscode/src/state.js`
- Modify: `vscode-extension/kalt-code-vscode/src/state.test.js`
- Modify: `vscode-extension/kalt-code-vscode/src/presentation.js`
- Modify: `vscode-extension/kalt-code-vscode/src/presentation.test.js`
- Create or restore: `vscode-extension/kalt-code-vscode/src/extension.js`
- Modify: `vscode-extension/kalt-code-vscode/src/extension.test.js`
- Modify: `vscode-extension/kalt-code-vscode/themes/Kalt-Code-Terminal-Black.json`

- [ ] **Step 1: Verify legacy folder removal**

```bash
test ! -d vscode-extension/openclaude-vscode
```

Expected: command exits 0.

- [ ] **Step 2: Fix extension package npm metadata**

In `vscode-extension/kalt-code-vscode/package.json`, ensure:

```json
{
  "name": "kalt-code-vscode",
  "displayName": "Kalt Code",
  "description": "Practical VS Code companion for Kalt Code with project-aware launch behavior and a real Control Center.",
  "publisher": "kaltdev",
  "main": "./src/extension.js",
  "repository": {
    "type": "git",
    "url": "https://github.com/kaltdev/kaltcode"
  }
}
```

Expected: command IDs and configuration IDs use `kalt-code`, visible names use `Kalt Code`, and there are no `openclaude` identifiers.

- [ ] **Step 3: Create or restore `src/extension.js`**

The package currently declares `./src/extension.js`; make that file exist and export the functions expected by `src/extension.test.js`:

```js
const vscode = require('vscode');
const crypto = require('crypto');
const path = require('path');
const { buildControlCenterViewModel } = require('./presentation');
const {
  chooseLaunchWorkspace,
  describeProviderState,
  findCommandPath,
  isPathInsideWorkspace,
  parseProfileFile,
} = require('./state');
```

The file must export:

```js
module.exports = {
  KaltCodeControlCenterProvider,
  activate,
  deactivate,
  renderControlCenterHtml,
  resolveLaunchTargets,
};
```

Expected: `require('./extension')` works in `src/extension.test.js`.

- [ ] **Step 4: Ensure profile paths use `.kaltcode-profile.json`**

In extension state and tests, use:

```js
const WORKSPACE_PROFILE_FILENAME = '.kaltcode-profile.json';
const DEPRECATED_WORKSPACE_PROFILE_FILENAME = '.openclaude-profile.json';
```

Read `.kaltcode-profile.json` first and `.openclaude-profile.json` second. Display `.kaltcode-profile.json` in UI hints.

Expected: workspace profile UI displays Kalt Code profile paths and still detects deprecated profiles.

- [ ] **Step 5: Run extension checks**

```bash
npm --prefix vscode-extension/kalt-code-vscode run lint
npm --prefix vscode-extension/kalt-code-vscode test
```

Expected: lint and tests pass. If `npm` tries to install packages, stop and use the existing local dependencies or ask before network access.

- [ ] **Step 6: Commit extension consolidation**

```bash
git add vscode-extension/kalt-code-vscode
git commit -m "chore: consolidate Kalt Code VS Code extension"
```

Expected: commit includes only canonical extension files and no legacy extension folder.

### Task 7: Add Branding Verification Tooling

**Files:**
- Create: `scripts/verify-kaltcode-branding.ts`
- Modify: `package.json`

- [ ] **Step 1: Create the branding verifier**

Create `scripts/verify-kaltcode-branding.ts` with this structure:

```ts
import { spawnSync } from 'child_process'

const forbiddenPattern =
  'OpenClaude|openclaude|OPENCLAUDE|Open Claude|open-claude|open_claude|openClaude|OPEN_CLAUDE'

const allowedPathPatterns = [
  /^\.gitignore$/,
  /^CHANGELOG\.md$/,
  /^docs\/superpowers\/specs\/2026-04-11-upstream-sync-automation-design\.md$/,
  /^docs\/plans\/2026-04-11-upstream-sync-automation-implementation-plan\.md$/,
  /^docs\/superpowers\/specs\/2026-05-11-kalt-code-branding-migration-design\.md$/,
  /^docs\/superpowers\/plans\/2026-05-11-kalt-code-branding-migration-implementation-plan\.md$/,
  /^scripts\/upstream-sync-port\.ts$/,
  /^src\/upstreamSync\//,
]

const allowedLinePatterns = [
  /deprecated/i,
  /compat/i,
  /compatibility/i,
  /upstream/i,
  /historical/i,
  /history/i,
  /provenance/i,
  /branding guard/i,
]

function runRg(args: string[]): string {
  const result = spawnSync('rg', args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  if (result.status === 1) return ''
  if (result.status !== 0) {
    throw new Error(result.stderr || `rg failed with status ${result.status}`)
  }
  return result.stdout
}

function isAllowed(line: string): boolean {
  const filePath = line.split(':', 1)[0] ?? ''
  if (allowedPathPatterns.some(pattern => pattern.test(filePath))) {
    return true
  }
  return allowedLinePatterns.some(pattern => pattern.test(line))
}

const contentOutput = runRg([
  '-n',
  '--hidden',
  '-S',
  forbiddenPattern,
  '-g',
  '!.git',
  '-g',
  '!node_modules',
  '-g',
  '!dist',
  '-g',
  '!build',
  '-g',
  '!coverage',
])

const pathOutput = runRg([
  '--files',
  '--hidden',
  '-g',
  '!.git',
  '-g',
  '!node_modules',
  '-g',
  '!dist',
  '-g',
  '!build',
  '-g',
  '!coverage',
])
  .split('\n')
  .filter(Boolean)
  .filter(path => new RegExp(forbiddenPattern).test(path))
  .join('\n')

const failures = [
  ...contentOutput.split('\n').filter(Boolean).filter(line => !isAllowed(line)),
  ...pathOutput.split('\n').filter(Boolean).filter(line => !isAllowed(`${line}:path match`)),
]

if (failures.length > 0) {
  console.error('Forbidden OpenClaude branding remains:')
  for (const failure of failures) console.error(failure)
  process.exit(1)
}

console.log('Kalt Code branding verification passed')
```

Expected: the script fails on unapproved first-party OpenClaude references and passes allowed upstream/history/compatibility references.

- [ ] **Step 2: Add package script**

In `package.json`, add:

```json
"verify:branding": "bun run scripts/verify-kaltcode-branding.ts"
```

Expected: `bun run verify:branding` is available.

- [ ] **Step 3: Run the branding verifier**

```bash
bun run verify:branding
```

Expected: prints `Kalt Code branding verification passed`.

- [ ] **Step 4: Commit branding verification tooling**

```bash
git add scripts/verify-kaltcode-branding.ts package.json
git commit -m "chore: add Kalt Code branding verification"
```

Expected: commit succeeds with the new audit script and package script.

### Task 8: Final Validation, Classification, and Reporting

**Files:**
- Inspect: full repository
- Modify only when validation finds stale first-party branding

- [ ] **Step 1: Run final raw branding search**

```bash
rg -n --hidden -S "OpenClaude|openclaude|OPENCLAUDE|Open Claude|open-claude|open_claude|openClaude|OPEN_CLAUDE" -g '!.git' -g '!node_modules' -g '!dist' -g '!build' -g '!coverage'
```

Expected: every remaining match is in the allowed remaining reference categories from this plan.

- [ ] **Step 2: Run path branding search**

```bash
rg --files --hidden -g '!.git' -g '!node_modules' -g '!dist' -g '!build' -g '!coverage' | rg "OpenClaude|openclaude|OPENCLAUDE|Open Claude|open-claude|open_claude|openClaude|OPEN_CLAUDE"
```

Expected: no path output except approved upstream/history plan or spec files. Source, website, package, and extension paths must not contain OpenClaude variants.

- [ ] **Step 3: Run project validation**

```bash
bun run build
bun run typecheck
bun test
bun run web:typecheck
bun run web:build
npm --prefix vscode-extension/kalt-code-vscode run lint
npm --prefix vscode-extension/kalt-code-vscode test
bun run verify:branding
```

Expected: all commands pass. If the full `bun test` suite is too large for the environment, run focused tests from Tasks 2, 5, and 6 and record that the full suite was skipped for runtime constraints.

- [ ] **Step 4: Inspect final diff by category**

```bash
git diff --stat HEAD
git status --short
```

Expected: either no uncommitted changes after task commits, or only final fixes ready for one validation commit.

- [ ] **Step 5: Commit final fixes if validation required edits**

```bash
git add .
git commit -m "chore: finish Kalt Code branding migration"
```

Expected: use this commit only if Task 8 validation found additional stale branding or broken references after earlier commits.

- [ ] **Step 6: Prepare final implementation report**

Include these sections in the final response:

```md
Summary:
- Package/docs/web metadata now use Kalt Code, `@kaltdev/kaltcode`, and `kalt-code`.
- Runtime prompts, attribution, env vars, config paths, and tests use Kalt Code variants.
- Canonical gRPC proto is `src/proto/kaltcode.proto`.
- Canonical VS Code extension is `vscode-extension/kalt-code-vscode`.

Manual decisions:
- `.kaltcode` is the primary config directory.
- `.openclaude` remains only as deprecated fallback where needed for existing users.
- `Gitlawb/openclaude` remains only for upstream sync or history.

Validation:
- List every command run and whether it passed.
- List any command skipped and the concrete reason.
```

Expected: the report names changed areas, retained compatibility shims, intentional upstream/history references, skipped replacements, validation results, and follow-up cleanup tasks.
