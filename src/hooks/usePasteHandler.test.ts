import { beforeAll, expect, mock, test } from 'bun:test'

let supportsClipboardImageFallback: typeof import('./usePasteHandler.js').supportsClipboardImageFallback

beforeAll(async () => {
  // Prevent the test from importing the hook's full runtime dependency graph.
  mock.module('react', () => {
    const React = {
      useState: mock(() => [undefined, () => {}]),
      useRef: mock((value: unknown) => ({ current: value })),
      useMemo: mock((factory: () => unknown) => factory()),
      useEffect: mock(() => {}),
      useCallback: mock((callback: unknown) => callback),
    }

    return {
      __esModule: true,
      default: React,
      ...React,
    }
  })

  mock.module('usehooks-ts', () => ({
    useDebounceCallback: <T,>(callback: T) => callback,
  }))

  mock.module('src/utils/log.js', () => ({
    getInMemoryErrors: mock(() => []),
    logError: mock(() => {}),
  }))

  mock.module('../utils/platform.js', () => ({
    getPlatform: mock(() => 'linux'),
  }))

  mock.module('../utils/imagePaste.js', () => ({
    getImageFromClipboard: mock(async () => null),
    isImageFilePath: mock(() => false),
    PASTE_THRESHOLD: 800,
    tryReadImageFromPath: mock(async () => null),
  }))

  ;({ supportsClipboardImageFallback } = await import('./usePasteHandler.js'))
})

test('supports clipboard image fallback on Windows', () => {
  expect(supportsClipboardImageFallback('windows')).toBe(true)
})

test('supports clipboard image fallback on macOS', () => {
  expect(supportsClipboardImageFallback('macos')).toBe(true)
})

test('supports clipboard image fallback on Linux', () => {
  expect(supportsClipboardImageFallback('linux')).toBe(true)
})

test('does not support clipboard image fallback on WSL', () => {
  expect(supportsClipboardImageFallback('wsl')).toBe(false)
})

test('does not support clipboard image fallback on unknown platforms', () => {
  expect(supportsClipboardImageFallback('unknown')).toBe(false)
})
