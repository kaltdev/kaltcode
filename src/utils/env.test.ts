import { afterEach, beforeEach, expect, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { getGlobalClaudeFile, resolveGlobalClaudeFile } from './env.js'
import {
  acquireSharedMutationLock,
  releaseSharedMutationLock,
} from '../test/sharedMutationLock.js'

const originalEnv = {
  CLAUDE_CONFIG_DIR: process.env.CLAUDE_CONFIG_DIR,
  CLAUDE_CODE_CUSTOM_OAUTH_URL: process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL,
  USER_TYPE: process.env.USER_TYPE,
}

let tempDir: string

beforeEach(async () => {
  await acquireSharedMutationLock("env.test.ts");
  tempDir = mkdtempSync(join(tmpdir(), 'kaltcode-env-test-'))
  process.env.CLAUDE_CONFIG_DIR = tempDir
  delete process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL
  delete process.env.USER_TYPE
  ;(
    getGlobalClaudeFile as unknown as { cache: { clear: () => void } }
  ).cache.clear()
})

afterEach(() => {
  try {
    rmSync(tempDir, { recursive: true, force: true })
    if (originalEnv.CLAUDE_CONFIG_DIR === undefined) {
      delete process.env.CLAUDE_CONFIG_DIR
    } else {
      process.env.CLAUDE_CONFIG_DIR = originalEnv.CLAUDE_CONFIG_DIR
    }
    if (originalEnv.CLAUDE_CODE_CUSTOM_OAUTH_URL === undefined) {
      delete process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL
    } else {
      process.env.CLAUDE_CODE_CUSTOM_OAUTH_URL = originalEnv.CLAUDE_CODE_CUSTOM_OAUTH_URL
    }
    if (originalEnv.USER_TYPE === undefined) {
      delete process.env.USER_TYPE
    } else {
      process.env.USER_TYPE = originalEnv.USER_TYPE
    }
  } finally {
    releaseSharedMutationLock();
  }
})

// getGlobalClaudeFile — default path plus explicit override compatibility

test('getGlobalClaudeFile: new install returns .kalt-code.json when neither file exists', async () => {
  expect(getGlobalClaudeFile()).toBe(join(tempDir, '.kalt-code.json'))
})

test('getGlobalClaudeFile: explicit config dir keeps .claude.json fallback when only legacy file exists', async () => {
  writeFileSync(join(tempDir, '.claude.json'), '{}')
  expect(getGlobalClaudeFile()).toBe(join(tempDir, '.claude.json'))
})

test('getGlobalClaudeFile: deprecated OpenClaude config is ignored when Kalt Code file is missing', async () => {
  writeFileSync(join(tempDir, '.openclaude.json'), '{}')
  expect(getGlobalClaudeFile()).toBe(join(tempDir, '.kalt-code.json'))
})

test('getGlobalClaudeFile: migrated user uses .kalt-code.json when both files exist', async () => {
  writeFileSync(join(tempDir, '.claude.json'), '{}')
  writeFileSync(join(tempDir, '.kalt-code.json'), '{}')
  expect(getGlobalClaudeFile()).toBe(join(tempDir, '.kalt-code.json'))
})

test('resolveGlobalClaudeFile: failed default migration keeps legacy file when new file is missing', async () => {
  writeFileSync(join(tempDir, '.claude.json'), '{}')

  expect(
    resolveGlobalClaudeFile({
      homeDir: tempDir,
      migrationSucceeded: false,
      existsSync: path => path === join(tempDir, '.claude.json'),
    }),
  ).toBe(join(tempDir, '.claude.json'))
})
