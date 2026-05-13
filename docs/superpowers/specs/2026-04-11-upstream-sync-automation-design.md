# Upstream Sync Automation Design

Date: 2026-04-11
Repo: /home/raditya/projects/kaltcode
Target product: Kalt Code
Reference upstream: https://github.com/Gitlawb/openclaude.git

## Goal

Build a fully automatic upstream-sync workflow that continuously tracks new OpenClaude commits, ports applicable changes into Kalt Code, preserves Kalt Code branding, pushes each synced feature to a new branch, and prepares accumulated successful syncs for later npm releases of `@kaltdev/kalt-code`.

## User-approved decisions

- Sync mode: fully automatic
- Branding policy: automatically rewrite upstream branding to Kalt Code where safe
- Release/version policy: accumulate successful syncs and bump versions only when a separate release job determines a release is publish-worthy
- Branching policy: each synced feature or upstream commit should be committed and pushed to its own new branch

## Non-goals

- Blindly mirroring OpenClaude branding, package metadata, repository URLs, or npm scope
- Publishing to npm on every successful upstream sync
- Forcing every upstream commit through a single identical transport mechanism
- Rewriting unrelated Kalt Code code purely for architectural cleanliness

## Design summary

Implement a dual-lane upstream sync engine inside Kalt Code:

1. A daily scan job fetches `upstream/main`, detects unprocessed upstream commits, classifies them, and queues them.
2. A port worker processes queued commits one at a time.
3. Low-risk commits use a direct lane such as cherry-pick or patch application.
4. Higher-risk commits use an intent-adaptation lane that recreates the change in Kalt Code while preserving Kalt Code-specific branding and release behavior.
5. Every processed commit gets a dedicated branch, verification run, pushed result, and ledger record.
6. A separate release-evaluator job reviews accumulated successful syncs and decides whether to bump and publish a new `@kaltdev/kalt-code` version.

## Architecture

### Core components

1. Upstream scanner
   - Fetches `upstream/main` and relevant tags
   - Compares upstream history against a local sync ledger
   - Detects upstream commits not yet processed by Kalt Code automation
   - Produces a queue of pending sync tasks

2. Commit classifier
   - Reads upstream commit metadata and changed files
   - Assigns categories such as `fix`, `feature`, `docs`, `deps`, `tests`, `branding`, `release`, `provider`, `refactor`
   - Assigns a risk level and selects a processing lane

3. Port worker
   - Creates a dedicated local branch for the target upstream commit
   - Executes either the direct lane or the intent-adaptation lane
   - Invokes branding rewrite and verification phases
   - Commits and pushes successful or blocked results according to policy

4. Branding guard
   - Rewrites OpenClaude branding to Kalt Code branding where safe
   - Prevents package-name, npm-scope, repo-URL, and user-facing identity regressions
   - Detects leftover forbidden branding strings before a branch is considered successful

5. Verification runner
   - Runs build, typecheck, smoke, and targeted or broader test commands
   - Marks branches as passing, failing, or blocked
   - Records exact verification outcomes in the sync ledger and reports

6. Sync ledger and reports
   - Stores processed upstream SHAs, branch mappings, result states, timestamps, verification results, and release candidacy
   - Generates machine-readable and human-readable reports for daily visibility and recovery

7. Release evaluator
   - Reviews successful syncs since the last release
   - Determines whether a release is worth publishing
   - Prepares version bumps, changelog summaries, and release branches without inheriting upstream package metadata directly

## Processing lanes

### Lane A: direct apply

Use for low-risk commits such as:
- small docs updates
- isolated tests
- simple fixes with low divergence
- narrow configuration changes

Behavior:
- create branch
- attempt cherry-pick or patch-apply
- run branding guard
- run verification
- commit and push results

### Lane B: intent adaptation

Use for higher-risk commits such as:
- branding-sensitive changes
- package metadata changes
- provider behavior changes likely to conflict with Kalt Code divergence
- larger refactors
- release-related changes
- broad UI or UX changes with product naming implications

Behavior:
- inspect upstream commit message and diff
- infer the functional intent of the change
- recreate the equivalent Kalt Code behavior without copying OpenClaude branding or release rules
- run branding guard
- run verification
- commit and push results

## Branching and commit strategy

### Branch naming

Each upstream commit gets its own branch.

Format:
- `sync/upstream-<shortsha>-<slug>`

Example:
- `sync/upstream-f4ac709-cache-probe-fix`

### Commit messages

Successful sync commits should use a traceable message format:
- `feat(sync): port upstream <sha> <original subject>`
- `fix(sync): port upstream <sha> <original subject>`
- `docs(sync): port upstream <sha> <original subject>`
- `refactor(sync): port upstream <sha> <original subject>`

Commit body should include:
- upstream repository URL
- upstream commit SHA
- selected processing lane
- branding rewrite applied: yes/no
- verification summary

### Push behavior

After processing each upstream commit:
- push the dedicated branch to `origin`
- record the remote branch name in the ledger
- keep blocked or failing branches available for inspection instead of silently discarding them

## Branding rewrite policy

The automation must automatically rewrite upstream branding to Kalt Code where safe.

### Rewrite targets

Allowed and expected rewrite targets include:
- README and docs copy
- CLI labels and help text
- package metadata descriptions and user-facing text
- examples and screenshots when represented as text assets
- references to OpenClaude product identity in user-visible surfaces

### Protected Kalt Code identity fields

Automation must never blindly overwrite:
- package name `@kaltdev/kalt-code`
- executable name `kalt-code`
- repository URL `https://github.com/kaltdev/kaltcode`
- npm scope `@kaltdev`
- release and discussion URLs that belong to Kalt Code
- product identity in published documentation and release notes

### Enforcement

The branding guard must scan changed files after porting and before success is recorded. If forbidden OpenClaude branding remains in disallowed places, the sync is blocked and logged.

## Verification strategy

Verification should scale to the scope of the change while maintaining a stable baseline.

### Preferred verification pipeline

1. Targeted validation when commit scope is narrow
2. `npm run build`
3. `npm run typecheck`
4. Relevant targeted tests if identifiable
5. `npm run smoke`

Where risk is high or changed files are broad, the worker may also run:
- `npm test`
- specific targeted scripts already present in the repository

### Verification outcomes

Each processed commit ends in one of these states:
- `success`
- `blocked_conflict`
- `blocked_branding`
- `verification_failed`
- `skipped`

Verification output should be captured in the ledger and summarized in daily reports.

## Sync ledger and report format

Recommended state paths:
- `.kalt-sync/state.json`
- `.kalt-sync/queue.json`
- `.kalt-sync/reports/YYYY-MM-DD-scan.md`
- `.kalt-sync/reports/YYYY-MM-DD-port.md`
- `.kalt-sync/releases/YYYY-MM-DD-release.md`

### State fields

The ledger should record at least:
- last scanned upstream SHA
- processed upstream SHAs
- branch name per processed SHA
- resulting Kalt Code commit SHA if created
- processing lane
- status
- timestamps
- verification commands and results
- branding rewrite status
- release candidate inclusion status

## Cron jobs

### Job A: upstream fetch and scan

Frequency: daily

Responsibilities:
- fetch `upstream/main` and tags
- compare upstream commits against processed ledger
- classify newly discovered commits
- enqueue unprocessed commits
- write a daily scan report

Deliverable:
- updated queue and state files
- daily summary of newly detected upstream commits

### Job B: auto-port worker

Frequency: daily, scheduled after scan

Responsibilities:
- take the next queued upstream commit or commits according to policy
- create a dedicated branch for each commit
- apply direct or intent-adaptation processing
- run branding rewrite
- run verification
- commit and push
- record result and produce a daily worker report

Deliverable:
- pushed sync branches
- ledger entries with pass or failure state
- port summary report

### Job C: release evaluator

Frequency: weekly

Responsibilities:
- inspect successful sync branches or ledger entries since the last release
- determine whether accumulated changes are publish-worthy
- if yes, bump the version from current `@kaltdev/kalt-code` package state
- generate release notes from successful sync entries
- prepare a release branch and optionally publish via npm CLI if credentials and policy allow
- if no, log that no release is warranted

Deliverable:
- release decision report
- release branch or no-release summary

## Release policy

Release versions are controlled by Kalt Code, not mirrored from OpenClaude.

### Rules

- Do not mirror upstream package versions directly.
- Start from Kalt Code's current package version.
- Default to patch bumps unless accumulated successful changes justify a minor release.
- Only the release evaluator decides whether a publish-worthy release exists.
- Publishing should use `npm` for `@kaltdev/kalt-code` only.

## Error handling

### Conflict or apply failure

- Create and retain the branch
- Record `blocked_conflict`
- Include error details in the ledger and daily report

### Branding enforcement failure

- Record `blocked_branding`
- Do not mark the sync successful until disallowed branding is removed
- Keep the branch available for diagnosis

### Verification failure

- Record `verification_failed`
- Preserve branch and logs
- Continue or stop according to configured severity policy; default behavior should continue with the next queued item after recording the failure

### Unsupported upstream change

- Record `skipped`
- Explain why the commit was not portable or not appropriate for Kalt Code

## Data flow

1. Scan job fetches upstream
2. Scanner identifies new upstream commit SHAs
3. Classifier assigns category and lane
4. Worker creates a new branch for the upstream SHA
5. Worker ports the change
6. Branding guard rewrites and validates user-facing identity
7. Verification runner executes checks
8. Worker commits and pushes branch
9. Ledger records outcome
10. Release evaluator periodically inspects successful entries for npm release readiness

## Testing strategy for the automation itself

The upstream-sync subsystem should be covered with unit and integration tests for:
- commit classification
- lane selection
- branch naming
- branding rewrite rules
- forbidden branding detection
- ledger state transitions
- release decision logic
- report generation
- failure handling for conflicts and verification errors

Where practical, tests should use fixture diffs or synthetic git scenarios rather than depending on live upstream network access.

## Security and safety constraints

- Do not publish to npm without explicit configured credentials and a dedicated release step.
- Do not overwrite Kalt Code package identity from upstream metadata.
- Do not assume upstream commit messages are sufficient; file changes and diff context must be considered during classification.
- Preserve auditability by keeping ledger entries and dedicated branches for each processed upstream change.

## Success criteria

The design is successful when:
- newly detected upstream commits are automatically queued and processed
- each upstream change is mapped to a dedicated pushed branch in Kalt Code
- OpenClaude branding does not leak into protected Kalt Code identity surfaces
- successes and failures are visible in durable reports and ledger files
- release decisions for `@kaltdev/kalt-code` are separated from upstream syncing
- the workflow can continue operating despite some blocked or failing commits
