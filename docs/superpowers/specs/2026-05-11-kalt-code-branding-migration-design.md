# Kalt Code Branding Migration Design

Date: 2026-05-11
Status: Approved design, pending implementation plan

## Goal

Complete the project rebrand from OpenClaude to Kalt Code so the repository reads as a cohesive first-party Kalt Code product rather than a partially renamed fork.

This is an identity migration across user-facing text, code identifiers, package metadata, documentation, assets, extension metadata, protocol names, tests, and developer-facing terminology. The implementation must prioritize correctness and maintainability over aggressive blind replacement.

## Canonical Naming

Use `Kalt Code` as the canonical human-readable product name in UI, documentation, marketing copy, onboarding flows, CLI descriptions, extension marketplace text, and user-facing messages.

Use contextual technical forms only where the syntax or naming convention requires them:

- Display name: `Kalt Code`
- PascalCase identifiers: `KaltCode`
- camelCase identifiers: `kaltCode`
- kebab-case paths, commands, and IDs: `kalt-code`
- compact package token: `kaltcode`
- snake_case identifiers: `kalt_code`
- uppercase constants and env vars: `KALTCODE`

The npm package remains `@kaltdev/kaltcode`. The primary CLI binary remains `kalt-code`.

## Scope

The migration covers all first-party branding and identity surfaces, including:

- package metadata, lockfiles, release metadata, and npm package names
- CLI output, help text, prompts, onboarding text, and setup flows
- README files, docs, examples, captions, generated docs, and release docs
- OAuth/login labels, trusted device labels, and provider setup messaging
- VS Code extension metadata, commands, views, themes, icons, and marketplace copy
- Electron/window titles and website HTML metadata where present
- telemetry labels, logging prefixes, API metadata, and user agent strings
- environment variables, config keys, local install paths, and config directory references
- Docker, CI/CD workflows, issue templates, and deployment config
- import/export paths, namespaces, generated symbols, and protocol/service identifiers
- assets and asset filenames containing the old brand
- tests that assert branded strings or branded paths

## Architecture

The migration is an atomic identity change with a small explicit compatibility layer.

Classify every OpenClaude occurrence into one of four categories:

1. First-party product surface: replace with the correct Kalt Code variant.
2. Technical identifier: rename to the casing required by the code, path, or protocol context and fix all references.
3. Compatibility shim: retain only when needed for existing users or integrations, annotate as deprecated, and make the Kalt Code name primary.
4. Historical or upstream reference: retain only when the reference is explicitly about upstream sync, provenance, old changelog history, or compatibility migration.

The default outcome for an OpenClaude reference is replacement. Keeping a reference requires a clear reason tied to compatibility, history, or upstream tracking.

## Components

### Repository Metadata and Package Surfaces

Update root and web package metadata, lockfiles, release-please config, workflows, Docker config, README, `.env.example`, docs, and website metadata.

Package naming must be internally consistent:

- npm package: `@kaltdev/kaltcode`
- CLI binary: `kalt-code`
- repository: `https://github.com/kaltdev/kaltcode`
- display name: `Kalt Code`

Generated or lockfile references should be regenerated where the repository has an existing command for doing so. If a lockfile can be updated safely by editing package metadata and running the project package manager, prefer regeneration over hand editing.

### Runtime Source and Tests

Update source-level product identity in system prompts, agent prompts, setup prompts, error messages, logging, telemetry, install helpers, path helpers, tests, and comments where branding matters.

Rename files whose path embeds `openclaude` when they are first-party Kalt Code tests or helpers. Update imports and test descriptions with the corresponding Kalt Code terminology.

### Configuration and Environment Compatibility

New `KALTCODE_*` environment variables are primary. Existing `OPENCLAUDE_*` variables may remain only as deprecated fallback aliases when removing them would break existing users or upgrade paths.

When both new and old env vars are present, the `KALTCODE_*` value wins. Tests should cover precedence for any retained alias. Comments near compatibility reads should state that the OpenClaude name is deprecated.

### Filesystem and Config Compatibility

Use `.kaltcode` as the primary config directory for user-level and project-level Kalt Code configuration. This mirrors the compact `kaltcode` package token and avoids confusing the hidden config directory with the hyphenated CLI binary name.

Existing `.openclaude` paths may remain as deprecated fallback reads when needed for upgrade continuity. New writes should target `.kaltcode` unless there is a strong compatibility reason not to change that specific surface yet.

Any retained fallback should be one-way and explicit: read legacy if the new path is absent, but present Kalt Code as the product in messages.

### gRPC and Proto Consolidation

Make `src/proto/kaltcode.proto` and `kaltcode.v1` the canonical gRPC protocol identity. Update the gRPC server, CLI helper, tests, and generated symbols to use the Kalt Code proto.

Treat `src/proto/openclaude.proto` as a migration candidate. Remove it if no compatibility constraint requires it. If retained, mark it as a deprecated compatibility proto and keep the new Kalt Code service path primary.

### VS Code Extension Consolidation

Use `vscode-extension/kalt-code-vscode` as the canonical extension package.

Consolidate useful functionality from `vscode-extension/openclaude-vscode` only if it is intended to survive in the Kalt Code extension. Otherwise remove the legacy folder after confirming no root package scripts or docs point to it.

Extension IDs, commands, views, settings, theme names, icon filenames, README text, repository URLs, and marketplace metadata should all use Kalt Code variants.

### Website and Assets

Update the web app and static HTML metadata to use Kalt Code. Rename `web/public/openclaude.png` to a Kalt Code asset name and update all references.

For persisted browser keys such as theme localStorage keys, write the new Kalt Code key. Retain read fallback from the old key only if it is low risk and clearly isolated.

### Upstream and History Boundaries

Preserve `Gitlawb/openclaude` and OpenClaude references only when the text is explicitly about upstream sync, historical changelog entries, migration provenance, or deprecated compatibility behavior.

The upstream git remote may continue pointing to `https://github.com/Gitlawb/openclaude.git` because it identifies the source project for sync workflows. User-facing docs should not present that upstream as the Kalt Code product repository.

## Data Flow

Implementation should proceed in this order:

1. Inventory content matches and path matches for all OpenClaude variants.
2. Rename first-party paths and assets that embed the old brand.
3. Update metadata, docs, website, and extension package surfaces.
4. Update runtime source, generated references, tests, and imports.
5. Add explicit compatibility aliases only where needed.
6. Regenerate derived artifacts using existing project commands where available.
7. Run validation searches and classify any remaining OpenClaude references.
8. Run build, typecheck, tests, extension checks, and web checks as practical.

Path renames should happen before text edits so imports, metadata, and tests can be corrected against the final structure.

## Compatibility Rules

Compatibility is allowed only for existing integrations, configs, telemetry continuity, protocol consumers, or upgrade paths.

Retained compatibility surfaces must follow these rules:

- Kalt Code naming is primary.
- Legacy OpenClaude names are fallback aliases, not advertised defaults.
- New names win when both new and old names are present.
- Compatibility code is annotated as deprecated.
- Tests cover any retained precedence or fallback behavior.

Compatibility is not a reason to keep old branding in human-readable product text.

## Error Handling

Broken imports, missing assets, stale extension IDs, stale proto references, and stale package metadata should fail through build, typecheck, or tests.

User-facing errors should mention Kalt Code. If an error concerns a deprecated OpenClaude compatibility path, the message should explain the new Kalt Code path and avoid presenting OpenClaude as the product.

## Validation

Validation is complete when the implementation has:

- searched for `OpenClaude`, `openclaude`, `OPENCLAUDE`, `Open Claude`, `open-claude`, `open_claude`, `openClaude`, and `OPEN_CLAUDE`
- manually classified all remaining matches as compatibility, history, or upstream references
- updated or regenerated package and lock metadata
- run `bun run build`
- run `bun run typecheck`
- run `bun test` or focused tests if the full suite is too large
- run VS Code extension lint/tests if the extension changed
- run web typecheck/build if website files changed
- verified imports and renamed paths resolve

## Git Hygiene

Implementation commits should be grouped logically where practical:

- `chore: rename OpenClaude branding to Kalt Code`
- `chore: update package and CLI branding`
- `chore: rename assets and metadata`

The design document is committed separately before implementation planning.

## Deliverables

The final implementation report should include:

- summary of files changed
- notable manual decisions
- remaining intentional upstream or historical references
- retained deprecated compatibility shims and why they remain
- skipped replacements and why
- build and test results
- possible follow-up cleanup tasks

## Risks

- Renaming config directories and env vars can break existing users if aliases are missed.
- Removing `openclaude.proto` can break gRPC clients if they still depend on the old package name.
- Consolidating duplicate VS Code extension folders can drop functionality if the legacy folder contains features not present in the canonical extension.
- Lockfiles and generated artifacts can drift if metadata edits are not regenerated.
- Changelog and upstream-sync docs need manual judgment because some OpenClaude references are intentionally historical.

## Non-Goals

- No feature work beyond what is required to complete the rebrand.
- No unrelated refactoring.
- No attempt to rewrite git history or local `.git` metadata.
- No removal of the upstream remote used for upstream sync workflows.
