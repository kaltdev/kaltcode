import { beforeAll, expect, mock, test } from 'bun:test'

let createGitHubIssueUrl: typeof import('./Feedback.js').createGitHubIssueUrl

beforeAll(async () => {
  mock.module('axios', () => ({ default: {} }))
  mock.module('fs/promises', () => ({
    readFile: mock(async () => ''),
    stat: mock(async () => ({ size: 0 })),
  }))
  mock.module('react', () => {
    const React = {
      useCallback: mock((callback: unknown) => callback),
      useEffect: mock(() => {}),
      useState: mock((value: unknown) => [value, () => {}]),
    }

    return {
      __esModule: true,
      default: React,
      ...React,
    }
  })
  mock.module('src/bootstrap/state.js', () => ({
    getLastAPIRequest: mock(() => null),
  }))
  mock.module('src/services/analytics/firstPartyEventLogger.js', () => ({
    logEventTo1P: mock(() => {}),
  }))
  mock.module('src/services/analytics/index.js', () => ({
    logEvent: mock(() => {}),
  }))
  mock.module('src/utils/messages.js', () => ({
    getLastAssistantMessage: mock(() => null),
    normalizeMessagesForAPI: mock(() => []),
  }))
  mock.module('../hooks/useTerminalSize.js', () => ({
    useTerminalSize: mock(() => ({ columns: 120 })),
  }))
  mock.module('../ink.js', () => ({
    Box: () => null,
    Text: () => null,
    useInput: mock(() => {}),
  }))
  mock.module('../keybindings/useKeybinding.js', () => ({
    useKeybinding: mock(() => {}),
  }))
  mock.module('../services/api/claude.js', () => ({
    queryHaiku: mock(async () => ''),
  }))
  mock.module('../services/api/errors.js', () => ({
    startsWithApiErrorPrefix: mock(() => false),
  }))
  mock.module('../utils/auth.js', () => ({
    checkAndRefreshOAuthTokenIfNeeded: mock(async () => {}),
  }))
  mock.module('../utils/browser.js', () => ({
    openBrowser: mock(async () => {}),
  }))
  mock.module('../utils/debug.js', () => ({
    logForDebugging: mock(() => {}),
  }))
  mock.module('../utils/env.js', () => ({
    env: {
      platform: 'linux',
      terminal: 'xterm-256color',
    },
  }))
  mock.module('../utils/git.js', () => ({
    getGitState: mock(async () => null),
    getIsGit: mock(async () => false),
  }))
  mock.module('../utils/http.js', () => ({
    getAuthHeaders: mock(() => ({})),
    getUserAgent: mock(() => 'kalt-code/test'),
  }))
  mock.module('../utils/log.js', () => ({
    getInMemoryErrors: mock(() => []),
    logError: mock(() => {}),
  }))
  mock.module('../utils/model/providers.js', () => ({
    getAPIProvider: mock(() => 'openai'),
  }))
  mock.module('../utils/privacyLevel.js', () => ({
    isEssentialTrafficOnly: mock(() => false),
  }))
  mock.module('../utils/sessionStorage.js', () => ({
    extractTeammateTranscriptsFromTasks: mock(() => ({})),
    getTranscriptPath: mock(() => '/tmp/transcript.jsonl'),
    loadAllSubagentTranscriptsFromDisk: mock(async () => ({})),
    MAX_TRANSCRIPT_READ_BYTES: 1024,
  }))
  mock.module('../utils/slowOperations.js', () => ({
    jsonStringify: JSON.stringify,
  }))
  mock.module('../utils/systemPromptType.js', () => ({
    asSystemPrompt: mock((value: unknown) => value),
  }))
  mock.module('./ConfigurableShortcutHint.js', () => ({
    ConfigurableShortcutHint: () => null,
  }))
  mock.module('./design-system/Byline.js', () => ({
    Byline: () => null,
  }))
  mock.module('./design-system/Dialog.js', () => ({
    Dialog: () => null,
  }))
  mock.module('./design-system/KeyboardShortcutHint.js', () => ({
    KeyboardShortcutHint: () => null,
  }))
  mock.module('./TextInput.js', () => ({
    default: () => null,
  }))

  ;({ createGitHubIssueUrl } = await import('./Feedback.js'))
})

;(globalThis as { MACRO?: { VERSION?: string } }).MACRO = { VERSION: '0.1.7' }

test('createGitHubIssueUrl omits empty feedback IDs', () => {
  const url = decodeURIComponent(
    createGitHubIssueUrl('', 'Bug title', 'Bug description', []),
  )

  expect(url).not.toContain('Feedback ID:')
  expect(url).toContain('Bug Description')
  expect(url).toContain('Errors')
})

test('createGitHubIssueUrl includes feedback IDs when present', () => {
  const url = decodeURIComponent(
    createGitHubIssueUrl('fb-123', 'Bug title', 'Bug description', []),
  )

  expect(url).toContain('Feedback ID: fb-123')
})
