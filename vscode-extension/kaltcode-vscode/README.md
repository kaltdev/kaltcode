# Kalt Code VS Code Extension

A practical VS Code companion for Kalt Code with a project-aware **Control Center**, predictable terminal launch behavior, and quick access to useful Kalt Code workflows.

## Features

- **Real Control Center status** in the Activity Bar:
  - whether the configured `kaltcode` command is installed
  - the launch command being used
  - whether the launch shim injects `CLAUDE_CODE_USE_OPENAI=1`
  - the current workspace folder
  - the launch cwd that will be used for terminal sessions
  - whether `.kaltcode-profile.json` exists in the current workspace root
  - a conservative provider summary derived from the workspace profile or known environment flags
- **Project-aware launch behavior**:
  - `Launch Kalt Code` launches from the active editor's workspace when possible
  - falls back to the first workspace folder when needed
  - avoids launching from an arbitrary default cwd when a project is open
- **Practical sidebar actions**:
  - Launch Kalt Code
  - Launch in Workspace Root
  - Open Workspace Profile
  - Open Repository
  - Open Setup Guide
  - Open Command Palette
- **Built-in dark theme**: `Kalt Code Terminal Black`
- **Microsoft Foundry / Azure OpenAI**: optional wizard and settings store endpoint, API version, deployment name, and API key (Secret Storage); launch injects `OPENAI_*` and `AZURE_OPENAI_API_VERSION` into the Kalt Code terminal (see `docs/advanced-setup.md` on the repo).

## Requirements

- VS Code `1.95+`
- `kaltcode` available in your terminal PATH (`npm install -g @kaltdev/kaltcode@latest`)

## Commands

- `Kalt Code: Open Control Center`
- `Kalt Code: Launch in Terminal`
- `Kalt Code: Launch in Workspace Root`
- `Kalt Code: Open Repository`
- `Kalt Code: Open Setup Guide`
- `Kalt Code: Open Workspace Profile`
- `Kalt Code: New Chat` / `Kalt Code: Open Chat Panel` / `Kalt Code: Resume Session` / `Kalt Code: Abort Generation`
- `Kalt Code: Configure Azure / Foundry Chat (wizard)`
- `Kalt Code: Set Azure / Foundry API Key (Secret Storage)`
- `Kalt Code: Clear Azure / Foundry API Key`
- `Kalt Code: Open Azure / Foundry Settings`

## Microsoft Foundry / Azure OpenAI (terminal chat)

1. Command Palette → **Kalt Code: Configure Azure / Foundry Chat (wizard)** and enter endpoint, API version, deployment name, and API key; or set `kaltcode.azure.*` in Settings and use **Kalt Code: Set Azure / Foundry API Key**.
2. Enable **Kalt Code: Azure: Enabled** (the wizard turns this on).
3. **Kalt Code: Launch in Terminal** — the extension merges env vars the OpenAI shim expects (`CLAUDE_CODE_USE_OPENAI`, `OPENAI_BASE_URL`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `AZURE_OPENAI_API_VERSION`, and `OPENAI_AZURE_STYLE` when forced).

If you use `.kaltcode-profile.json` for the same workspace, leave Azure injection off to avoid conflicting provider configuration.

## Settings

- `kaltcode.launchCommand` (default: `kaltcode`)
- `kaltcode.terminalName` (default: `Kalt Code`)
- `kaltcode.useOpenAIShim` (default: `false`)
- `kaltcode.azure.*` — Foundry / Azure OpenAI terminal injection (see Settings UI)
- `kaltcode.permissionMode` — chat permission mode

`kaltcode.useOpenAIShim` only injects `CLAUDE_CODE_USE_OPENAI=1` when Azure injection did not already set it. It does not configure endpoints or keys by itself.

## Notes on Status Detection

- Provider status prefers the real workspace `.kaltcode-profile.json` file when present.
- If no saved profile exists, the extension falls back to known environment flags available to the VS Code extension host.
- If the source of truth is unclear, the extension shows `unknown` instead of guessing.

## Development

From this folder:

```bash
npm run test
npm run lint
```

To package (optional):

```bash
npm run package
```

