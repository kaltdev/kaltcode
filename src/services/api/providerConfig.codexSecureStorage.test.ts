import { afterEach, describe, expect, mock, test, beforeEach, beforeAll } from 'bun:test'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as realOs from 'node:os'
import {
  acquireSharedMutationLock,
  releaseSharedMutationLock,
} from '../../test/sharedMutationLock.js'

let mockIsCodexRefreshFailureCoolingDown = () => false
let mockReadCodexCredentials = (): any => undefined
let mockHomedir = () => realOs.homedir()

mock.module('../../utils/codexCredentials.js', () => ({
  isCodexRefreshFailureCoolingDown: () => mockIsCodexRefreshFailureCoolingDown(),
  readCodexCredentials: () => mockReadCodexCredentials(),
}))

mock.module('node:os', () => ({
  ...realOs,
  homedir: () => mockHomedir(),
}))

let resolveCodexApiCredentials: typeof import('./providerConfig.js').resolveCodexApiCredentials

beforeAll(async () => {
  const providerConfig = await import(
    `./providerConfig.js?cacheBust=${Date.now()}-${Math.random()}`
  )
  resolveCodexApiCredentials = providerConfig.resolveCodexApiCredentials
})

beforeEach(async () => {
  await acquireSharedMutationLock("providerConfig.codexSecureStorage.test.ts");
});

function makeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' }))
    .toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  return `${header}.${body}.signature`
}

describe('resolveCodexApiCredentials with secure storage', () => {
  afterEach(() => {
    try {
      mockIsCodexRefreshFailureCoolingDown = () => false
      mockReadCodexCredentials = () => undefined
      mockHomedir = () => realOs.homedir()
    } finally {
      releaseSharedMutationLock();
    }
  })

  test('loads Codex credentials from Kalt Code secure storage', () => {
    mockReadCodexCredentials = () => ({
      apiKey: 'codex-api-key-token',
      accessToken: 'header.payload.signature',
      accountId: 'acct_secure',
    })

    const credentials = resolveCodexApiCredentials({} as NodeJS.ProcessEnv)
    expect(credentials.apiKey).toBe('codex-api-key-token')
    expect(credentials.accountId).toBe('acct_secure')
    expect(credentials.source).toBe('secure-storage')
  })

  test('prefers explicit env credentials over secure storage', () => {
    mockReadCodexCredentials = () => ({
      accessToken: 'stored-token',
      accountId: 'acct_stored',
    })

    const credentials = resolveCodexApiCredentials({
      CODEX_API_KEY: 'env-token',
      CHATGPT_ACCOUNT_ID: 'acct_env',
    } as NodeJS.ProcessEnv)

    expect(credentials.apiKey).toBe('env-token')
    expect(credentials.accountId).toBe('acct_env')
    expect(credentials.source).toBe('env')
  })

  test('parses nested chatgpt_account_id from a CODEX_API_KEY JWT', () => {
    mockReadCodexCredentials = () => undefined

    const credentials = resolveCodexApiCredentials({
      CODEX_API_KEY: makeJwt({
        'https://api.openai.com/auth': {
          chatgpt_account_id: 'acct_nested_env',
        },
      }),
    } as NodeJS.ProcessEnv)

    expect(credentials.accountId).toBe('acct_nested_env')
    expect(credentials.source).toBe('env')
  })

  test('parses nested chatgpt_account_id from auth.json tokens', () => {
    mockReadCodexCredentials = () => undefined

    const tempDir = mkdtempSync(join(tmpdir(), 'kaltcode-codex-auth-'))
    const authPath = join(tempDir, 'auth.json')

    writeFileSync(
      authPath,
      JSON.stringify({
        openai_api_key: makeJwt({
          'https://api.openai.com/auth': {
            chatgpt_account_id: 'acct_nested_auth_json',
          },
        }),
      }),
      'utf8',
    )

    try {
      const credentials = resolveCodexApiCredentials({
        CODEX_AUTH_JSON_PATH: authPath,
      } as NodeJS.ProcessEnv)

      expect(credentials.accountId).toBe('acct_nested_auth_json')
      expect(credentials.source).toBe('auth.json')
    } finally {
      rmSync(tempDir, { force: true, recursive: true })
    }
  })

  test('does not read default auth.json when secure storage already has Codex credentials', () => {
    mockReadCodexCredentials = () => ({
      apiKey: 'codex-api-key-token',
      accessToken: 'header.payload.signature',
      accountId: 'acct_secure',
    })

    const credentials = resolveCodexApiCredentials({} as NodeJS.ProcessEnv)
    expect(credentials.apiKey).toBe('codex-api-key-token')
    expect(credentials.accountId).toBe('acct_secure')
    expect(credentials.source).toBe('secure-storage')
  })

  test('falls back to the default auth.json when stored Codex refresh is cooling down', () => {
    const tempHomeDir = mkdtempSync(join(tmpdir(), 'kaltcode-codex-home-'))
    const authJson = JSON.stringify({
      openai_api_key: makeJwt({
        'https://api.openai.com/auth': {
          chatgpt_account_id: 'acct_auth_json',
        },
      }),
    })
    mkdirSync(join(tempHomeDir, '.codex'), { recursive: true })
    writeFileSync(join(tempHomeDir, '.codex', 'auth.json'), authJson, 'utf8')

    mockHomedir = () => tempHomeDir
    mockIsCodexRefreshFailureCoolingDown = () => true
    mockReadCodexCredentials = () => ({
      accessToken: 'stored-token',
      refreshToken: 'refresh-stored',
      accountId: 'acct_stored',
      lastRefreshFailureAt: Date.now(),
    })

    try {
      const credentials = resolveCodexApiCredentials({} as NodeJS.ProcessEnv)
      expect(credentials.source).toBe('auth.json')
      expect(credentials.accountId).toBe('acct_auth_json')
      expect(credentials.apiKey).not.toBe('stored-token')
    } finally {
      rmSync(tempHomeDir, { force: true, recursive: true })
    }
  })

  test('preserves the stored account id when auth.json fallback lacks one', () => {
    const tempHomeDir = mkdtempSync(join(tmpdir(), 'kaltcode-codex-home-'))
    const authJson = JSON.stringify({
      openai_api_key: 'auth-json-access-token',
    })
    mkdirSync(join(tempHomeDir, '.codex'), { recursive: true })
    writeFileSync(join(tempHomeDir, '.codex', 'auth.json'), authJson, 'utf8')

    mockHomedir = () => tempHomeDir
    mockIsCodexRefreshFailureCoolingDown = () => true
    mockReadCodexCredentials = () => ({
      accessToken: 'stored-token',
      refreshToken: 'refresh-stored',
      accountId: 'acct_stored',
      lastRefreshFailureAt: Date.now(),
    })

    try {
      const credentials = resolveCodexApiCredentials({} as NodeJS.ProcessEnv)
      expect(credentials.source).toBe('auth.json')
      expect(credentials.apiKey).toBe('auth-json-access-token')
      expect(credentials.accountId).toBe('acct_stored')
    } finally {
      rmSync(tempHomeDir, { force: true, recursive: true })
    }
  })
})
