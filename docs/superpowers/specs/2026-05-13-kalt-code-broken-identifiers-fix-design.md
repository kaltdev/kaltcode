# Kalt Code Broken Identifier Fix Design

Date: 2026-05-13

## Problem

The CLI crashes in the Config screen with:

```text
ReferenceError: codeInChromeDefaultEnabled is not defined
```

The source contains invalid expressions created by branding replacement, such as:

```ts
globalConfig.kalt-codeInChromeDefaultEnabled
```

JavaScript parses that as subtraction:

```ts
globalConfig.kalt - codeInChromeDefaultEnabled
```

The right-hand identifier is undefined, so React's Config component throws while rendering. The same pattern appears in other runtime paths, including MCP connector state, first-token metadata, MCP config merging, API context sizing, user analytics context, and commit attribution.

## Scope

Fix repo source only and rebuild the local distribution artifact. Do not patch the globally installed package under the Node installation.

In scope:

- Restore invalid executable identifiers to valid existing camelCase fields.
- Fix the reported Config render crash.
- Fix sibling latent runtime crashes from the same `kalt-code...` identifier pattern.
- Add a regression guard that detects these broken identifiers in executable TypeScript/TSX source.
- Rebuild the repo with the existing build command.

Out of scope:

- Renaming all remaining Claude-branded internal fields.
- Changing persisted config schema names beyond restoring already-defined fields.
- Rebranding user-facing "Claude in Chrome" feature copy.
- Patching globally installed npm package files.

## Architecture

The fix stays local to existing modules and preserves current data contracts:

- `src/components/Settings/Config.tsx` reads and writes `claudeInChromeDefaultEnabled`.
- `src/services/api/firstTokenDate.ts` and `src/utils/user.ts` use `claudeCodeFirstTokenDate`.
- `src/services/mcp/claudeai.ts` uses `claudeAiMcpEverConnected`.
- `src/services/mcp/useManageMCPConnections.ts` merges `claudeCodeConfigs`.
- `src/utils/api.ts` reads `userContext.claudeMd`.
- `src/utils/commitAttribution.ts` keeps its public attribution JSON shape, using valid local property accesses such as `claudeContribution` and `claudeChars`.

These are source repairs, not schema migrations. Existing config and attribution field names already exist in type definitions and surrounding code.

## Error Handling

The direct runtime error is removed by eliminating invalid subtraction expressions in component render and supporting code paths. The regression guard fails at test time if executable source contains member expressions or variable references in the broken `kalt-codeIdentifier` form.

## Testing

Verification will focus on the affected bug class and the requested rebuild:

- Run the new or updated guard test.
- Run a targeted source search for remaining invalid `kalt-code...` executable identifiers.
- Run the repo build command.

If broad typecheck remains noisy from unrelated existing repo issues, report that separately and do not treat it as the blocker for this fix unless it touches the edited files.

## Acceptance Criteria

- `globalConfig.kalt-codeInChromeDefaultEnabled` no longer exists.
- No executable TS/TSX source contains invalid `kalt-code...` identifier expressions from the identified bug class.
- The build completes successfully.
- The repo source and rebuilt artifact reflect the fix.
