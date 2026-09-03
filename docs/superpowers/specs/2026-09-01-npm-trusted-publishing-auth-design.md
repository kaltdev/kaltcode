# npm Trusted Publishing Authentication Fix

## Problem

The release workflow reaches `npm publish` but fails with `ENEEDAUTH`. The package already has an npm trusted publisher configured for the `kaltdev/kaltcode` repository, `.github/workflows/release.yml`, and the `release` environment.

The publish job otherwise follows npm's trusted-publishing requirements: it runs on a GitHub-hosted runner, grants `id-token: write`, uses Node 24, configures the npm registry through `actions/setup-node`, and publishes from the configured workflow and environment. However, a custom step writes an empty `NODE_AUTH_TOKEN` into `GITHUB_ENV` immediately before publishing. npm's documented GitHub Actions example does not set this empty token override.

The test failures mentioned in the initial report are outside this fix. Unit tests run before the publish command, so a job that reaches `npm publish` has already passed that gate.

## Design

Update only `.github/workflows/release.yml`:

1. Remove the step that unsets `NODE_AUTH_TOKEN` and persists an empty value through `GITHUB_ENV`.
2. Add a small pre-publish diagnostic that prints the npm version. This makes future authentication failures easier to diagnose because npm trusted publishing requires npm 11.5.1 or later.
3. Keep the existing OIDC permissions, GitHub `release` environment, registry setup, public access, and provenance publishing behavior.
4. Do not add or reference an `NPM_TOKEN` secret.

This aligns the job with npm's official trusted-publishing example while preserving short-lived OIDC authentication.

## Validation

Because the local device cannot execute Bun tests due to missing AVX support, validation will use checks that do not invoke Bun:

- Parse the workflow as YAML using an available non-Bun parser.
- Inspect the resulting diff for scope and valid placement of the publish diagnostic.
- Run `git diff --check`.
- Run any repository security scan that can execute without Bun; otherwise record it as unavailable.

The definitive behavioral validation is the next release run because GitHub's OIDC credentials and npm's trusted-publisher exchange are only available in GitHub Actions.

## Safety and Rollback

The change removes an undocumented authentication override and does not expose credentials. If npm publishing still fails, the emitted npm version and GitHub Actions logs will distinguish an unsupported npm CLI from an npm-side trusted-publisher mismatch. Rollback consists of reverting this workflow-only commit.
