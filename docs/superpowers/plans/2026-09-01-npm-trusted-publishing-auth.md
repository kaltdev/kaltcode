# npm Trusted Publishing Authentication Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow the release job to authenticate to npm through its configured OIDC trusted publisher without an empty token override.

**Architecture:** Keep the existing GitHub Actions trusted-publishing setup and make the publish sequence match npm's documented GitHub Actions flow. The workflow will expose the npm CLI version for diagnostics, then call the existing provenance-enabled publish command without writing `NODE_AUTH_TOKEN` into the job environment.

**Tech Stack:** GitHub Actions YAML, Node.js 24, npm trusted publishing/OIDC

---

### Task 1: Align the npm publish sequence with trusted publishing

**Files:**
- Modify: `.github/workflows/release.yml:125-132`

- [ ] **Step 1: Capture the current workflow-specific failure condition**

Run:

```bash
node --input-type=module <<'NODE'
import { readFileSync } from 'node:fs'

const workflow = readFileSync('.github/workflows/release.yml', 'utf8')
if (!workflow.includes('echo "NODE_AUTH_TOKEN=" >> "$GITHUB_ENV"')) {
  throw new Error('Expected the empty NODE_AUTH_TOKEN override to exist before the fix')
}
if (!workflow.includes('run: npm publish --access public --provenance')) {
  throw new Error('Expected the OIDC publish command')
}
console.log('Reproduced: release workflow injects an empty npm token before publishing')
NODE
```

Expected: prints `Reproduced: release workflow injects an empty npm token before publishing`.

- [ ] **Step 2: Remove the empty token override and add npm version diagnostics**

Replace:

```yaml
      - name: Clear token auth for trusted publishing
        run: |
          unset NODE_AUTH_TOKEN
          echo "NODE_AUTH_TOKEN=" >> "$GITHUB_ENV"

      - name: Publish to npm
        run: npm publish --access public --provenance
```

with:

```yaml
      - name: Show npm version
        run: npm --version

      - name: Publish to npm
        run: npm publish --access public --provenance
```

- [ ] **Step 3: Verify the workflow authentication contract statically**

Run:

```bash
node --input-type=module <<'NODE'
import { readFileSync } from 'node:fs'

const workflow = readFileSync('.github/workflows/release.yml', 'utf8')
const required = [
  'environment: release',
  'id-token: write',
  'node-version: 24',
  'registry-url: https://registry.npmjs.org',
  '- name: Show npm version',
  'run: npm --version',
  'run: npm publish --access public --provenance',
]
for (const fragment of required) {
  if (!workflow.includes(fragment)) {
    throw new Error(`Missing trusted-publishing workflow fragment: ${fragment}`)
  }
}
if (workflow.includes('NODE_AUTH_TOKEN')) {
  throw new Error('Release workflow must not override NODE_AUTH_TOKEN')
}
console.log('Trusted-publishing workflow contract is intact')
NODE
```

Expected: prints `Trusted-publishing workflow contract is intact`.

- [ ] **Step 4: Run non-Bun validation**

Run:

```bash
git diff --check
git diff -- .github/workflows/release.yml
```

Expected: `git diff --check` exits successfully, and the diff contains only removal of the token-clearing step plus the npm-version diagnostic.

Do not run Bun-backed tests on this machine because its CPU lacks AVX support. Record this limitation in the final summary. The OIDC exchange itself can only be validated by a GitHub-hosted release job.

- [ ] **Step 5: Commit the workflow fix**

```bash
git add .github/workflows/release.yml docs/superpowers/plans/2026-09-01-npm-trusted-publishing-auth.md
git commit -m "fix(release): preserve npm trusted publishing auth"
```

Expected: one commit containing the focused workflow change and this implementation plan.

### Task 2: Review and publish the branch

**Files:**
- Review: `.github/workflows/release.yml`
- Review: `docs/superpowers/specs/2026-09-01-npm-trusted-publishing-auth-design.md`
- Review: `docs/superpowers/plans/2026-09-01-npm-trusted-publishing-auth.md`

- [ ] **Step 1: Confirm branch state and commit scope**

Run:

```bash
git status --short --branch
git log --oneline main..HEAD
git diff --stat main...HEAD
git diff --check main...HEAD
```

Expected: a clean `fix/npm-trusted-publishing-auth` branch, the design and implementation commits, and changes limited to the workflow plus the two planning documents.

- [ ] **Step 2: Push the new branch without force**

Run:

```bash
git push -u origin HEAD:refs/heads/fix/npm-trusted-publishing-auth
```

Expected: the remote branch is created and local tracking is configured. Do not force-push.
