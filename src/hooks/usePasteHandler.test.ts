import { expect, test } from 'bun:test'
<<<<<<< HEAD
=======
import {
  shouldHandleInputAsPaste,
  supportsClipboardImageFallback,
} from './usePasteHandler.ts'
>>>>>>> upstream/main

test('usePasteHandler test file loads without entering Bun runtime crashes', () => {
  expect(true).toBe(true)
})

test('does not treat a bracketed paste as pending when no paste handlers are provided', () => {
  expect(
    shouldHandleInputAsPaste({
      hasTextPasteHandler: false,
      hasImagePasteHandler: false,
      inputLength: 'kimi-k2.5'.length,
      pastePending: false,
      hasImageFilePath: false,
      isFromPaste: true,
    }),
  ).toBe(false)
})

test('treats bracketed text paste as pending when a text paste handler exists', () => {
  expect(
    shouldHandleInputAsPaste({
      hasTextPasteHandler: true,
      hasImagePasteHandler: false,
      inputLength: 'kimi-k2.5'.length,
      pastePending: false,
      hasImageFilePath: false,
      isFromPaste: true,
    }),
  ).toBe(true)
})

test('treats image path paste as pending when only an image handler exists', () => {
  expect(
    shouldHandleInputAsPaste({
      hasTextPasteHandler: false,
      hasImagePasteHandler: true,
      inputLength: 'C:\\Users\\jat\\image.png'.length,
      pastePending: false,
      hasImageFilePath: true,
      isFromPaste: false,
    }),
  ).toBe(true)
})
