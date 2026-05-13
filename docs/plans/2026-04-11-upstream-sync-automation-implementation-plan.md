# Upstream Sync Automation Implementation Plan

> For Hermes: Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build a fully automatic upstream-sync workflow that scans Gitlawb/openclaude, ports applicable commits into Kalt Code with branding safeguards, pushes each synced change to its own branch, and prepares successful syncs for npm release evaluation.

**Architecture:** Add a small upstream-sync subsystem under `src/upstreamSync/` for pure logic and state handling, plus Bun CLI scripts under `scripts/` for scan/port/release operations. Keep git and npm side effects in thin script entrypoints, keep classification/branding/ledger logic unit-testable, and persist durable state under `.kalt-sync/`.

**Tech Stack:** Bun, TypeScript, Bun test, existing `semver` dependency, git CLI via `spawnSync`, npm CLI, JSON state files, Markdown report generation.

---

## Implementation notes before coding

- Keep Kalt Code branding protected at all times.
- Treat `@kaltdev/kalt-code`, `kalt-code`, and Kalt Code repo URLs as immutable identity fields.
- Prefer pure functions in `src/upstreamSync/` and thin shell adapters in `scripts/`.
- Each task below should land as its own commit on the active working branch.
- Use focused Bun tests first, then broader validation.
- When a task adds new user-facing automation, update `README.md` in the final documentation tasks only.

---

### Task 1: Create the upstream sync module skeleton

**Objective:** Establish a dedicated module layout so later tasks can add logic without mixing concerns.

**Files:**
- Create: `src/upstreamSync/types.ts`
- Create: `src/upstreamSync/constants.ts`
- Create: `src/upstreamSync/index.ts`
- Create: `src/upstreamSync/paths.ts`
- Test: no test in this task

**Step 1: Create shared types**

Add `src/upstreamSync/types.ts` with the core domain types:

```ts
export type SyncStatus =
  | 'queued'
  | 'success'
  | 'blocked_conflict'
  | 'blocked_branding'
  | 'verification_failed'
  | 'skipped'

export type SyncLane = 'direct_apply' | 'intent_adaptation'

export type CommitCategory =
  | 'fix'
  | 'feature'
  | 'docs'
  | 'deps'
  | 'tests'
  | 'branding'
  | 'release'
  | 'provider'
  | 'refactor'
  | 'unknown'

export type RiskLevel = 'low' | 'medium' | 'high'

export type UpstreamCommitRef = {
  sha: string
  shortSha: string
  subject: string
  authoredAt?: string
}

export type ClassifiedCommit = UpstreamCommitRef & {
  files: string[]
  category: CommitCategory
  risk: RiskLevel
  lane: SyncLane
  reasons: string[]
}

export type VerificationResult = {
  command: string
  ok: boolean
  exitCode: number
  stdout: string
  stderr: string
}

export type SyncLedgerEntry = {
  upstreamSha: string
  upstreamShortSha: string
  upstreamSubject: string
  lane: SyncLane
  category: CommitCategory
  risk: RiskLevel
  status: SyncStatus
  branchName: string | null
  kaltCommitSha: string | null
  brandingRewriteApplied: boolean
  verification: VerificationResult[]
  notes: string[]
  createdAt: string
  updatedAt: string
  includedInRelease: boolean
}

export type SyncState = {
  lastScannedUpstreamSha: string | null
  processedShas: Record<string, SyncLedgerEntry>
}

export type QueuedSyncItem = ClassifiedCommit & {
  discoveredAt: string
}

export type SyncQueue = {
  items: QueuedSyncItem[]
}
```

**Step 2: Create constants**

Add `src/upstreamSync/constants.ts`:

```ts
export const KALT_SYNC_DIR = '.kalt-sync'
export const STATE_FILE = 'state.json'
export const QUEUE_FILE = 'queue.json'
export const REPORTS_DIR = 'reports'
export const RELEASES_DIR = 'releases'

export const PROTECTED_BRANDING_PATTERNS = [
  '@kaltdev/kalt-code',
  'kalt-code',
  'https://github.com/kaltdev/kaltcode',
] as const

export const FORBIDDEN_UPSTREAM_BRANDING = [
  'openclaude',
  'OpenClaude',
  'Gitlawb/openclaude',
  '@openclaude',
] as const
```

**Step 3: Create path helpers**

Add `src/upstreamSync/paths.ts`:

```ts
import { join, resolve } from 'node:path'
import {
  KALT_SYNC_DIR,
  QUEUE_FILE,
  RELEASES_DIR,
  REPORTS_DIR,
  STATE_FILE,
} from './constants.js'

export function syncRoot(cwd = process.cwd()): string {
  return resolve(cwd, KALT_SYNC_DIR)
}

export function syncStatePath(cwd = process.cwd()): string {
  return join(syncRoot(cwd), STATE_FILE)
}

export function syncQueuePath(cwd = process.cwd()): string {
  return join(syncRoot(cwd), QUEUE_FILE)
}

export function syncReportsDir(cwd = process.cwd()): string {
  return join(syncRoot(cwd), REPORTS_DIR)
}

export function syncReleasesDir(cwd = process.cwd()): string {
  return join(syncRoot(cwd), RELEASES_DIR)
}
```

**Step 4: Create barrel export**

Add `src/upstreamSync/index.ts`:

```ts
export * from './types.js'
export * from './constants.js'
export * from './paths.js'
```

**Step 5: Verify files typecheck at import level**

Run: `bun run typecheck`
Expected: PASS

**Step 6: Commit**

```bash
git add src/upstreamSync
git commit -m "feat(sync): add upstream sync module skeleton"
```

---

### Task 2: Add state and queue persistence helpers

**Objective:** Create durable JSON persistence for `.kalt-sync/state.json` and `.kalt-sync/queue.json`.

**Files:**
- Create: `src/upstreamSync/storage.ts`
- Create: `src/upstreamSync/storage.test.ts`
- Modify: `src/upstreamSync/index.ts`

**Step 1: Write failing tests**

Add `src/upstreamSync/storage.test.ts` covering:
- initializes empty state when files do not exist
- initializes empty queue when file does not exist
- persists saved state and queue
- creates parent directories automatically

Use Bun temp directories via `mkdtempSync`.

Example skeleton:

```ts
import { afterEach, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  loadSyncQueue,
  loadSyncState,
  saveSyncQueue,
  saveSyncState,
} from './storage.js'
```

**Step 2: Run tests to verify failure**

Run: `bun test src/upstreamSync/storage.test.ts`
Expected: FAIL — module or functions missing

**Step 3: Implement storage helpers**

Add `src/upstreamSync/storage.ts` with:
- `ensureSyncDirs(cwd?: string)`
- `loadSyncState(cwd?: string): SyncState`
- `saveSyncState(state, cwd?: string): void`
- `loadSyncQueue(cwd?: string): SyncQueue`
- `saveSyncQueue(queue, cwd?: string): void`

Implementation details:
- use `existsSync`, `mkdirSync`, `readFileSync`, `writeFileSync`
- pretty-print JSON with two-space indentation
- return defaults:

```ts
const EMPTY_STATE: SyncState = {
  lastScannedUpstreamSha: null,
  processedShas: {},
}

const EMPTY_QUEUE: SyncQueue = {
  items: [],
}
```

**Step 4: Export storage helpers**

Update `src/upstreamSync/index.ts`:

```ts
export * from './storage.js'
```

**Step 5: Run focused tests**

Run: `bun test src/upstreamSync/storage.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/upstreamSync/index.ts src/upstreamSync/storage.ts src/upstreamSync/storage.test.ts
git commit -m "feat(sync): add ledger and queue storage helpers"
```

---

### Task 3: Implement branch naming and commit slug helpers

**Objective:** Generate deterministic per-upstream branch names.

**Files:**
- Create: `src/upstreamSync/branching.ts`
- Create: `src/upstreamSync/branching.test.ts`
- Modify: `src/upstreamSync/index.ts`

**Step 1: Write failing tests**

Cover:
- branch format uses `sync/upstream-<shortsha>-<slug>`
- subject is slugified to lowercase hyphenated text
- slug is trimmed to a safe length
- empty subjects fall back to `change`

**Step 2: Run tests to verify failure**

Run: `bun test src/upstreamSync/branching.test.ts`
Expected: FAIL

**Step 3: Implement helper**

Add `src/upstreamSync/branching.ts`:

```ts
function slugifySubject(subject: string): string {
  const slug = subject
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  return slug || 'change'
}

export function buildSyncBranchName(input: {
  sha: string
  subject: string
}): string {
  const shortSha = input.sha.slice(0, 7)
  return `sync/upstream-${shortSha}-${slugifySubject(input.subject)}`
}
```

**Step 4: Export helper**

Update `src/upstreamSync/index.ts`.

**Step 5: Run focused tests**

Run: `bun test src/upstreamSync/branching.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/upstreamSync/branching.ts src/upstreamSync/branching.test.ts src/upstreamSync/index.ts
git commit -m "feat(sync): add deterministic branch naming"
```

---

### Task 4: Implement commit classification and lane selection

**Objective:** Decide category, risk, and processing lane from upstream commit metadata.

**Files:**
- Create: `src/upstreamSync/classifier.ts`
- Create: `src/upstreamSync/classifier.test.ts`
- Modify: `src/upstreamSync/index.ts`

**Step 1: Write failing tests**

Test at least:
- docs-only commit => category `docs`, risk `low`, lane `direct_apply`
- package metadata change => category `release` or `deps`, risk `high`, lane `intent_adaptation`
- provider file changes => category `provider`, risk `high`, lane `intent_adaptation`
- small test-only commit => category `tests`, risk `low`, lane `direct_apply`
- README branding change mentioning openclaude => risk `high`, category `branding`, lane `intent_adaptation`

**Step 2: Run tests to verify failure**

Run: `bun test src/upstreamSync/classifier.test.ts`
Expected: FAIL

**Step 3: Implement classifier**

Add a pure function similar to:

```ts
export function classifyCommit(input: {
  sha: string
  subject: string
  files: string[]
  authoredAt?: string
}): ClassifiedCommit {
  const files = input.files
  const subject = input.subject.toLowerCase()

  const docsOnly = files.every(file => file.endsWith('.md') || file.startsWith('docs/'))
  const testsOnly = files.every(file => /(?:test|spec)\./.test(file))
  const touchesPackage = files.some(file => file === 'package.json' || file.includes('package-lock'))
  const touchesProvider = files.some(file => file.includes('provider') || file.includes('api/'))
  const touchesBranding =
    subject.includes('brand') ||
    subject.includes('openclaude') ||
    files.some(file => file === 'README.md' || file.startsWith('docs/'))

  // choose category, risk, lane, reasons
}
```

Rule set:
- docs-only + no branding keywords => `docs`, `low`, `direct_apply`
- tests-only => `tests`, `low`, `direct_apply`
- package/release files => `release`, `high`, `intent_adaptation`
- provider/api files => `provider`, `high`, `intent_adaptation`
- branding-sensitive subject or docs mention => `branding`, `high`, `intent_adaptation`
- else default to `fix` or `refactor` based on subject keywords and use `medium`

**Step 4: Export classifier**

Update barrel exports.

**Step 5: Run focused tests**

Run: `bun test src/upstreamSync/classifier.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/upstreamSync/classifier.ts src/upstreamSync/classifier.test.ts src/upstreamSync/index.ts
git commit -m "feat(sync): add commit classification and lane selection"
```

---

### Task 5: Add branding rewrite and enforcement helpers

**Objective:** Rewrite safe branding references and detect forbidden upstream branding in protected surfaces.

**Files:**
- Create: `src/upstreamSync/branding.ts`
- Create: `src/upstreamSync/branding.test.ts`
- Modify: `src/upstreamSync/index.ts`

**Step 1: Write failing tests**

Cover:
- rewrites `OpenClaude` to `Kalt Code` in docs text
- rewrites `openclaude` CLI name to `kalt-code` where configured
- does not alter `@kaltdev/kalt-code`
- flags forbidden upstream branding left in package metadata text
- allows historical disclaimer text if explicitly exempted later only when desired

**Step 2: Run tests to verify failure**

Run: `bun test src/upstreamSync/branding.test.ts`
Expected: FAIL

**Step 3: Implement rewrite and scan helpers**

Add helpers such as:
- `rewriteBrandingText(text: string): { text: string; changed: boolean }`
- `findForbiddenBranding(input: { path: string; content: string }): string[]`
- `isProtectedIdentityFile(path: string): boolean`

Recommended rewrite map:

```ts
const REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bOpenClaude\b/g, 'Kalt Code'],
  [/\bopenclaude\b/g, 'kalt-code'],
  [/Gitlawb\/openclaude/g, 'kaltdev/kalt-code'],
]
```

Protected files should include:
- `package.json`
- `README.md`
- `bin/`
- `docs/`
- `.github/`

**Step 4: Export helpers**

Update barrel exports.

**Step 5: Run focused tests**

Run: `bun test src/upstreamSync/branding.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/upstreamSync/branding.ts src/upstreamSync/branding.test.ts src/upstreamSync/index.ts
git commit -m "feat(sync): add branding rewrite and guard helpers"
```

---

### Task 6: Implement markdown and JSON report generation

**Objective:** Create durable daily scan, port, and release reports.

**Files:**
- Create: `src/upstreamSync/reporting.ts`
- Create: `src/upstreamSync/reporting.test.ts`
- Modify: `src/upstreamSync/index.ts`

**Step 1: Write failing tests**

Cover:
- scan report includes discovered SHAs
- port report includes success/failure rows
- release report includes decision and version summary
- report paths are date-based

**Step 2: Run tests to verify failure**

Run: `bun test src/upstreamSync/reporting.test.ts`
Expected: FAIL

**Step 3: Implement report builders**

Create functions:
- `buildScanReportMarkdown(...)`
- `buildPortReportMarkdown(...)`
- `buildReleaseReportMarkdown(...)`
- `reportFileName(kind: 'scan' | 'port', date: string)`
- `releaseReportFileName(date: string)`

Keep them pure. Format as readable markdown with bullet lists and small tables where useful.

**Step 4: Export helpers**

Update `src/upstreamSync/index.ts`.

**Step 5: Run focused tests**

Run: `bun test src/upstreamSync/reporting.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/upstreamSync/reporting.ts src/upstreamSync/reporting.test.ts src/upstreamSync/index.ts
git commit -m "feat(sync): add upstream sync report generation"
```

---

### Task 7: Implement git command helpers for upstream inspection

**Objective:** Encapsulate git interactions for scanning upstream commits and changed files.

**Files:**
- Create: `src/upstreamSync/git.ts`
- Create: `src/upstreamSync/git.test.ts`
- Modify: `src/upstreamSync/index.ts`

**Step 1: Write failing tests**

Unit-test pure parsing helpers, not live git, for:
- parsing `git log` lines into commit refs
- parsing changed files from newline output
- building safe git commands for fetch/log/show

**Step 2: Run tests to verify failure**

Run: `bun test src/upstreamSync/git.test.ts`
Expected: FAIL

**Step 3: Implement helpers**

Functions to add:
- `runGit(args: string[], cwd = process.cwd())`
- `parseLogLines(output: string): UpstreamCommitRef[]`
- `parseChangedFiles(output: string): string[]`
- `listUnprocessedUpstreamCommits(...)`
- `getCommitFiles(sha, cwd?)`
- `fetchUpstream(cwd?)`

Implementation guidance:
- use `spawnSync('git', args, { cwd, encoding: 'utf-8' })`
- throw descriptive errors on non-zero exit codes
- use `git log --reverse --format=%H%x09%s%x09%cI <range>`
- use `git diff-tree --no-commit-id --name-only -r <sha>`

**Step 4: Export helpers**

Update barrel exports.

**Step 5: Run focused tests**

Run: `bun test src/upstreamSync/git.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/upstreamSync/git.ts src/upstreamSync/git.test.ts src/upstreamSync/index.ts
git commit -m "feat(sync): add upstream git inspection helpers"
```

---

### Task 8: Build the daily scan script

**Objective:** Create a runnable script that fetches upstream, classifies new commits, updates queue/state, and writes a scan report.

**Files:**
- Create: `scripts/upstream-sync-scan.ts`
- Create: `scripts/upstream-sync-scan.test.ts`
- Modify: `package.json`

**Step 1: Write failing tests for pure scan flow pieces**

Test:
- already-processed SHA is skipped
- unprocessed SHA is enqueued once
- queue items include classification data and timestamp

Keep parsing and queue-merging logic in local pure helpers so tests do not need live git.

**Step 2: Run tests to verify failure**

Run: `bun test scripts/upstream-sync-scan.test.ts`
Expected: FAIL

**Step 3: Implement scan script**

Script behavior:
- `fetchUpstream()`
- load state and queue
- determine range from `state.lastScannedUpstreamSha` to `upstream/main`
- classify commits and append non-duplicate queue entries
- update `state.lastScannedUpstreamSha`
- write report to `.kalt-sync/reports/YYYY-MM-DD-scan.md`
- print concise summary to stdout

Add CLI options:
- `--json`
- `--limit <n>`
- `--since <sha>` optional override

**Step 4: Add npm script**

Update `package.json` scripts:

```json
"sync:scan": "bun run scripts/upstream-sync-scan.ts"
```

**Step 5: Run focused tests**

Run: `bun test scripts/upstream-sync-scan.test.ts`
Expected: PASS

**Step 6: Smoke the script**

Run: `bun run sync:scan -- --limit 5`
Expected: PASS and `.kalt-sync/` files created

**Step 7: Commit**

```bash
git add scripts/upstream-sync-scan.ts scripts/upstream-sync-scan.test.ts package.json .kalt-sync
git commit -m "feat(sync): add upstream scan script"
```

Note: if `.kalt-sync` should stay untracked, add only intentionally versioned fixtures or docs, not runtime state. In that case commit the code only.

---

### Task 9: Implement verification runner helpers

**Objective:** Standardize command execution for build/typecheck/test/smoke checks used by the port worker.

**Files:**
- Create: `src/upstreamSync/verification.ts`
- Create: `src/upstreamSync/verification.test.ts`
- Modify: `src/upstreamSync/index.ts`

**Step 1: Write failing tests**

Cover:
- docs-only commit gets lighter command set
- high-risk commit includes build, typecheck, smoke, and test
- command results are captured with exit codes

**Step 2: Run tests to verify failure**

Run: `bun test src/upstreamSync/verification.test.ts`
Expected: FAIL

**Step 3: Implement verification helpers**

Functions:
- `verificationPlanForCommit(commit: ClassifiedCommit): string[]`
- `runVerificationCommands(commands: string[], cwd?: string): VerificationResult[]`
- `didVerificationPass(results: VerificationResult[]): boolean`

Suggested default plans:
- docs/tests low-risk => `bun run build`, `bun run smoke`
- provider/high-risk => `bun run build`, `bun run typecheck`, `bun run smoke`, `bun test`
- general medium => `bun run build`, `bun run typecheck`, `bun run smoke`

**Step 4: Export helpers**

Update barrel exports.

**Step 5: Run focused tests**

Run: `bun test src/upstreamSync/verification.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/upstreamSync/verification.ts src/upstreamSync/verification.test.ts src/upstreamSync/index.ts
git commit -m "feat(sync): add verification planning and execution"
```

---

### Task 10: Implement direct-apply and intent-adaptation planning helpers

**Objective:** Define the worker’s two lanes before wiring full branch mutations.

**Files:**
- Create: `src/upstreamSync/porting.ts`
- Create: `src/upstreamSync/porting.test.ts`
- Modify: `src/upstreamSync/index.ts`

**Step 1: Write failing tests**

Cover:
- direct-apply lane attempts cherry-pick first
- intent-adaptation lane emits notes instead of cherry-pick action
- high-risk release/provider commits never select direct cherry-pick behavior

**Step 2: Run tests to verify failure**

Run: `bun test src/upstreamSync/porting.test.ts`
Expected: FAIL

**Step 3: Implement plan helpers**

Create a pure function like:

```ts
export type PortAction =
  | { type: 'checkout-branch'; branchName: string }
  | { type: 'cherry-pick'; sha: string }
  | { type: 'rewrite-branding' }
  | { type: 'manual-adaptation'; sha: string; notes: string[] }
  | { type: 'verify'; commands: string[] }

export function buildPortPlan(commit: ClassifiedCommit): PortAction[] {
  // derive actions from lane
}
```

**Step 4: Export helpers**

Update barrel exports.

**Step 5: Run focused tests**

Run: `bun test src/upstreamSync/porting.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/upstreamSync/porting.ts src/upstreamSync/porting.test.ts src/upstreamSync/index.ts
git commit -m "feat(sync): add porting lane plans"
```

---

### Task 11: Build the auto-port worker script

**Objective:** Create the script that processes queued commits into dedicated branches, runs branding/verification, updates the ledger, and pushes branches.

**Files:**
- Create: `scripts/upstream-sync-port.ts`
- Create: `scripts/upstream-sync-port.test.ts`
- Modify: `package.json`

**Step 1: Write failing tests for queue selection and status updates**

Test:
- worker selects next queued item FIFO
- success updates ledger and removes queue item
- verification failure records `verification_failed`
- branding failure records `blocked_branding`

Use extracted pure helpers in the script or a dedicated helper module.

**Step 2: Run tests to verify failure**

Run: `bun test scripts/upstream-sync-port.test.ts`
Expected: FAIL

**Step 3: Implement worker script**

Flow:
- load queue and state
- select next item
- build branch name via `buildSyncBranchName`
- `git checkout -b <branch>`
- if lane is direct, attempt `git cherry-pick <sha>`
- if cherry-pick fails, abort cherry-pick and mark `blocked_conflict`
- after file mutations, scan changed tracked files for forbidden branding
- run verification commands
- create a sync commit when needed with message/body format from spec
- `git push -u origin <branch>`
- write ledger entry and daily port report

Required guardrails:
- never modify `package.json` name away from `@kaltdev/kalt-code`
- if no queue items, print a no-op summary and exit 0
- do not publish npm from this script

**Step 4: Add npm script**

Update `package.json`:

```json
"sync:port": "bun run scripts/upstream-sync-port.ts"
```

**Step 5: Run focused tests**

Run: `bun test scripts/upstream-sync-port.test.ts`
Expected: PASS

**Step 6: Dry-run the worker if you add a safe flag**

Recommended optional flag:
- `--dry-run`

Run: `bun run sync:port -- --dry-run`
Expected: PASS with preview output

**Step 7: Commit**

```bash
git add scripts/upstream-sync-port.ts scripts/upstream-sync-port.test.ts package.json
git commit -m "feat(sync): add upstream port worker"
```

---

### Task 12: Implement release evaluation logic

**Objective:** Decide when successful syncs justify a new npm release and compute the next version from current package state.

**Files:**
- Create: `src/upstreamSync/release.ts`
- Create: `src/upstreamSync/release.test.ts`
- Modify: `src/upstreamSync/index.ts`

**Step 1: Write failing tests**

Cover:
- no successful unapplied syncs => no release
- only fix/docs/test syncs => patch bump from `0.1.8` to `0.1.9`
- feature sync present => minor bump from `0.1.8` to `0.2.0`
- already included syncs are excluded

**Step 2: Run tests to verify failure**

Run: `bun test src/upstreamSync/release.test.ts`
Expected: FAIL

**Step 3: Implement release helpers**

Use the existing `semver` dependency.

Functions:
- `collectReleaseCandidates(state: SyncState): SyncLedgerEntry[]`
- `recommendedReleaseBump(entries: SyncLedgerEntry[]): 'patch' | 'minor' | null`
- `nextReleaseVersion(currentVersion: string, bump: 'patch' | 'minor'): string`
- `buildReleaseSummary(entries: SyncLedgerEntry[]): string[]`

Policy:
- any `feature` entry => `minor`
- otherwise any successful unapplied entry => `patch`
- no candidates => `null`

**Step 4: Export helpers**

Update barrel exports.

**Step 5: Run focused tests**

Run: `bun test src/upstreamSync/release.test.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/upstreamSync/release.ts src/upstreamSync/release.test.ts src/upstreamSync/index.ts
git commit -m "feat(sync): add release evaluation logic"
```

---

### Task 13: Build the release evaluator script

**Objective:** Produce a release decision, write a release report, and optionally prepare a release branch and npm publish command.

**Files:**
- Create: `scripts/upstream-sync-release.ts`
- Create: `scripts/upstream-sync-release.test.ts`
- Modify: `package.json`

**Step 1: Write failing tests**

Cover:
- no candidates => `no release today`
- patch candidate set computes next patch version
- minor candidate set computes next minor version
- dry-run mode does not mutate `package.json`

**Step 2: Run tests to verify failure**

Run: `bun test scripts/upstream-sync-release.test.ts`
Expected: FAIL

**Step 3: Implement release evaluator script**

Behavior:
- read current version from `package.json`
- load state
- compute release candidates and bump
- write `.kalt-sync/releases/YYYY-MM-DD-release.md`
- support flags:
  - `--dry-run`
  - `--prepare-branch`
  - `--publish`
- only if `--prepare-branch`, create `release/v<version>` branch and update `package.json`
- only if `--publish`, run `npm publish` after explicit branch preparation and version bump

Guardrails:
- default behavior is report-only
- publishing must fail fast if npm auth is missing
- never mirror an upstream version string

**Step 4: Add npm script**

Update `package.json`:

```json
"sync:release": "bun run scripts/upstream-sync-release.ts"
```

**Step 5: Run focused tests**

Run: `bun test scripts/upstream-sync-release.test.ts`
Expected: PASS

**Step 6: Smoke dry-run release evaluation**

Run: `bun run sync:release -- --dry-run`
Expected: PASS with a release or no-release summary

**Step 7: Commit**

```bash
git add scripts/upstream-sync-release.ts scripts/upstream-sync-release.test.ts package.json
git commit -m "feat(sync): add release evaluator script"
```

---

### Task 14: Add contributor documentation for the sync workflow

**Objective:** Document how to run scan/port/release flows locally without mixing branding.

**Files:**
- Modify: `README.md`
- Optionally create: `docs/upstream-sync.md`

**Step 1: Write the documentation updates**

Document:
- required remotes: `origin` and `upstream`
- scan command: `bun run sync:scan`
- worker command: `bun run sync:port`
- release command: `bun run sync:release -- --dry-run`
- location of `.kalt-sync/` state and reports
- branding guard expectations
- that package publishing remains Kalt Code only

**Step 2: Verify docs mention correct package/version facts**

Check that docs mention:
- package `@kaltdev/kalt-code`
- current version comes from `package.json`
- upstream is reference-only

**Step 3: Run basic validation**

Run: `bun run build && bun run smoke`
Expected: PASS

**Step 4: Commit**

```bash
git add README.md docs/upstream-sync.md
git commit -m "docs(sync): document upstream sync workflow"
```

If `docs/upstream-sync.md` is not needed, commit only the touched docs.

---

### Task 15: Create cron jobs for scan, port, and release evaluation

**Objective:** Schedule the automation to run unattended with sensible cadence.

**Files:**
- No repo file required unless you choose to add `docs/upstream-sync.md` examples
- External action: Hermes cron jobs

**Step 1: Confirm scripts work in dry-run or normal mode**

Run manually first:

```bash
bun run sync:scan -- --limit 5
bun run sync:port -- --dry-run
bun run sync:release -- --dry-run
```

Expected: PASS

**Step 2: Create scan cron job**

Schedule suggestion:
- daily at 09:00 local time

Prompt should be self-contained and run in `/home/raditya/projects/kaltcode`.

**Step 3: Create port cron job**

Schedule suggestion:
- daily at 09:15 local time

Prompt should:
- `cd /home/raditya/projects/kaltcode`
- run the port worker
- summarize result back to origin

**Step 4: Create release evaluator cron job**

Schedule suggestion:
- weekly on Monday at 10:00 local time

Prompt should default to dry-run reporting unless you explicitly want auto-publish.

**Step 5: Record schedules in docs**

If docs exist, include the chosen schedules and delivery target.

**Step 6: Commit documentation only if repo docs changed**

No code commit needed for Hermes-managed cron jobs.

---

### Task 16: Run full verification before handing off

**Objective:** Ensure the whole upstream-sync subsystem works and the repo still builds cleanly.

**Files:**
- No new files expected

**Step 1: Run focused sync-related tests**

Run:

```bash
bun test src/upstreamSync/*.test.ts scripts/upstream-sync-*.test.ts
```

Expected: PASS

**Step 2: Run typecheck**

Run:

```bash
bun run typecheck
```

Expected: PASS

**Step 3: Run build and smoke**

Run:

```bash
bun run build
bun run smoke
```

Expected: PASS

**Step 4: Run broader test pass if sync code touches shared runtime helpers**

Run:

```bash
bun test
```

Expected: PASS or known unrelated failures documented

**Step 5: Review git status and audit branding**

Run:

```bash
git status --short
rg -n "openclaude|OpenClaude|Gitlawb/openclaude" README.md docs src scripts package.json
```

Expected:
- clean working tree after commits
- only intentional references remain

**Step 6: Final commit if needed**

If verification caused final fixes:

```bash
git add [files]
git commit -m "chore(sync): finalize upstream sync automation"
```

---

## Suggested execution order for subagents

1. Tasks 1-6: pure module foundation
2. Tasks 7-11: git, scan, verification, and port worker
3. Tasks 12-13: release evaluation
4. Task 14: docs
5. Task 15: cron jobs
6. Task 16: final verification

## Acceptance checklist

- [ ] `.kalt-sync/state.json` and `.kalt-sync/queue.json` are created and updated correctly
- [ ] new upstream commits from `upstream/main` can be discovered and classified
- [ ] each processed upstream commit maps to a dedicated `sync/upstream-<shortsha>-<slug>` branch
- [ ] forbidden OpenClaude branding is rewritten or blocked before success
- [ ] verification failures are recorded in ledger entries and reports
- [ ] release evaluator computes the next Kalt Code version from `package.json`, starting at `0.1.8`
- [ ] npm publishing is guarded behind explicit release-step intent
- [ ] scan, port, and release jobs can be scheduled safely with Hermes cron jobs
- [ ] README/docs explain the workflow without confusing OpenClaude and Kalt Code branding

## Handoff

Plan complete and saved. Ready to execute using subagent-driven-development task-by-task, with commits after each completed task and cron setup after the scripts are verified.
