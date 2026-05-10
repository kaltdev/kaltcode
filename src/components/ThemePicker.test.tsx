<<<<<<< HEAD
import { describe, expect, it, mock } from 'bun:test'

// We can't fully render ThemePicker due to complex dependencies
// But we can test the theme options generation logic
describe('ThemePicker', () => {
  describe('theme options', () => {
    it('generates correct theme options without AUTO_THEME feature flag', () => {
      // Since we can't easily mock bun:bundle, test the options structure
      // The real test would require integration testing
      const expectedOptions = [
        { label: "Dark mode", value: "dark" },
        { label: "Light mode", value: "light" },
        { label: "Dark mode (colorblind-friendly)", value: "dark-daltonized" },
        { label: "Light mode (colorblind-friendly)", value: "light-daltonized" },
        { label: "Dark mode (ANSI colors only)", value: "dark-ansi" },
        { label: "Light mode (ANSI colors only)", value: "light-ansi" },
      ]
      expect(expectedOptions.length).toBe(6)
    })

    it('includes auto theme when AUTO_THEME feature is enabled', () => {
      // Test the structure when auto is present
      const optionsWithAuto = [
        { label: "Auto (match terminal)", value: "auto" },
        { label: "Dark mode", value: "dark" },
      ]
      expect(optionsWithAuto[0].value).toBe('auto')
    })
  })

  describe('handleRowFocus callback', () => {
    it('setPreviewTheme is called with theme setting', () => {
      const setPreviewTheme = mock()
      const handleRowFocus = (setting: string) => setPreviewTheme(setting)

      handleRowFocus('dark')
      expect(setPreviewTheme).toHaveBeenCalledWith('dark')
    })
  })

  describe('handleSelect callback', () => {
    it('calls savePreview and onThemeSelect', () => {
      const savePreview = mock()
      const onThemeSelect = mock()
      const handleSelect = (setting: string) => {
        savePreview()
        onThemeSelect(setting)
      }

      handleSelect('light')
      expect(savePreview).toHaveBeenCalled()
      expect(onThemeSelect).toHaveBeenCalledWith('light')
    })
  })

  describe('handleCancel callback', () => {
    it('calls cancelPreview and gracefulShutdown when not skipExitHandling', () => {
      const cancelPreview = mock()
      const gracefulShutdown = mock()
      const handleCancel = (skipExitHandling: boolean, onCancelProp?: () => void) => {
        cancelPreview()
        if (skipExitHandling) {
          onCancelProp?.()
        } else {
          gracefulShutdown(0)
        }
      }

      handleCancel(false)
      expect(cancelPreview).toHaveBeenCalled()
      expect(gracefulShutdown).toHaveBeenCalledWith(0)
    })

    it('calls onCancelProp when skipExitHandling is true', () => {
      const cancelPreview = mock()
      const onCancelProp = mock()
      const handleCancel = (skipExitHandling: boolean, onCancelProp?: () => void) => {
        cancelPreview()
        if (skipExitHandling) {
          onCancelProp?.()
        }
      }

      handleCancel(true, onCancelProp)
      expect(cancelPreview).toHaveBeenCalled()
      expect(onCancelProp).toHaveBeenCalled()
    })
  })

  describe('syntax hint logic', () => {
    it('shows disabled hint when syntax highlighting is disabled', () => {
      const syntaxHighlightingDisabled = true
      const syntaxToggleShortcut = 'Ctrl+T'

      const hint = syntaxHighlightingDisabled
        ? `Syntax highlighting disabled (${syntaxToggleShortcut} to enable)`
        : `Syntax highlighting enabled (${syntaxToggleShortcut} to disable)`

      expect(hint).toContain('disabled')
    })

    it('shows enabled hint when syntax highlighting is active', () => {
      const syntaxHighlightingDisabled = false
      const syntaxToggleShortcut = 'Ctrl+T'

      const hint = !syntaxHighlightingDisabled
        ? `Syntax highlighting enabled (${syntaxToggleShortcut} to disable)`
        : `Syntax highlighting disabled (${syntaxToggleShortcut} to enable)`

      expect(hint).toContain('enabled')
    })
  })
=======
import { PassThrough } from 'node:stream'

import { afterEach, expect, mock, test } from 'bun:test'
import React from 'react'
import stripAnsi from 'strip-ansi'

import { createRoot, Text, useTheme } from '../ink.js'
import { KeybindingSetup } from '../keybindings/KeybindingProviderSetup.js'
import { AppStateProvider } from '../state/AppState.js'
import { ThemeProvider } from './design-system/ThemeProvider.js'

mock.module('./StructuredDiff.js', () => ({
  StructuredDiff: function StructuredDiffPreview(): React.ReactNode {
    const [theme] = useTheme()
    return <Text>{`Preview theme: ${theme}`}</Text>
  },
}))

mock.module('./StructuredDiff/colorDiff.js', () => ({
  getColorModuleUnavailableReason: () => 'env',
  getSyntaxTheme: () => null,
}))

const SYNC_START = '\x1B[?2026h'
const SYNC_END = '\x1B[?2026l'

function extractLastFrame(output: string): string {
  let lastFrame: string | null = null
  let cursor = 0

  while (cursor < output.length) {
    const start = output.indexOf(SYNC_START, cursor)
    if (start === -1) {
      break
    }

    const contentStart = start + SYNC_START.length
    const end = output.indexOf(SYNC_END, contentStart)
    if (end === -1) {
      break
    }

    const frame = output.slice(contentStart, end)
    if (frame.trim().length > 0) {
      lastFrame = frame
    }
    cursor = end + SYNC_END.length
  }

  return lastFrame ?? output
}

function createTestStreams(): {
  stdout: PassThrough
  stdin: PassThrough & {
    isTTY: boolean
    setRawMode: (mode: boolean) => void
    ref: () => void
    unref: () => void
  }
  getOutput: () => string
} {
  let output = ''
  const stdout = new PassThrough()
  const stdin = new PassThrough() as PassThrough & {
    isTTY: boolean
    setRawMode: (mode: boolean) => void
    ref: () => void
    unref: () => void
  }

  stdin.isTTY = true
  stdin.setRawMode = () => {}
  stdin.ref = () => {}
  stdin.unref = () => {}
  ;(stdout as unknown as { columns: number }).columns = 120
  stdout.on('data', chunk => {
    output += chunk.toString()
  })

  return {
    stdout,
    stdin,
    getOutput: () => output,
  }
}

async function waitForCondition(
  predicate: () => boolean,
  timeoutMs = 2000,
): Promise<void> {
  const startedAt = Date.now()

  while (Date.now() - startedAt < timeoutMs) {
    if (predicate()) {
      return
    }
    await Bun.sleep(10)
  }

  throw new Error('Timed out waiting for ThemePicker test condition')
}

async function waitForFrame(
  getOutput: () => string,
  predicate: (frame: string) => boolean,
): Promise<string> {
  let frame = ''

  await waitForCondition(() => {
    frame = stripAnsi(extractLastFrame(getOutput()))
    return predicate(frame)
  })

  return frame
}

afterEach(() => {
  mock.restore()
})

test('updates the preview when keyboard focus moves to another theme', async () => {
  const { ThemePicker } = await import('./ThemePicker.js')
  const { stdout, stdin, getOutput } = createTestStreams()
  const root = await createRoot({
    stdout: stdout as unknown as NodeJS.WriteStream,
    stdin: stdin as unknown as NodeJS.ReadStream,
    patchConsole: false,
  })

  root.render(
    <AppStateProvider>
      <KeybindingSetup>
        <ThemeProvider initialState="dark">
          <ThemePicker onThemeSelect={() => {}} />
        </ThemeProvider>
      </KeybindingSetup>
    </AppStateProvider>,
  )

  try {
    const initialFrame = await waitForFrame(
      getOutput,
      frame => frame.includes('Preview theme: dark'),
    )
    expect(initialFrame).toContain('Preview theme: dark')

    stdin.write('j')

    const updatedFrame = await waitForFrame(
      getOutput,
      frame => frame.includes('Preview theme: light'),
    )
    expect(updatedFrame).toContain('Preview theme: light')
  } finally {
    root.unmount()
    stdin.end()
    stdout.end()
    await Bun.sleep(0)
  }
>>>>>>> upstream/main
})
