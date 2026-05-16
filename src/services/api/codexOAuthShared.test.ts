import { expect, test } from 'bun:test'

import {
  DEFAULT_CODEX_OAUTH_CALLBACK_HOST,
  DEFAULT_CODEX_OAUTH_CALLBACK_PORT,
  getCodexOAuthCallbackHost,
  getCodexOAuthCallbackOrigin,
  getCodexOAuthCallbackPort,
} from './codexOAuthShared.js'

test('getCodexOAuthCallbackPort falls back for zero', () => {
  expect(
    getCodexOAuthCallbackPort({
      CODEX_OAUTH_CALLBACK_PORT: '0',
    } as NodeJS.ProcessEnv),
  ).toBe(DEFAULT_CODEX_OAUTH_CALLBACK_PORT)
})

test('getCodexOAuthCallbackPort falls back for invalid values', () => {
  expect(
    getCodexOAuthCallbackPort({
      CODEX_OAUTH_CALLBACK_PORT: '-1',
    } as NodeJS.ProcessEnv),
  ).toBe(DEFAULT_CODEX_OAUTH_CALLBACK_PORT)
})

test('getCodexOAuthCallbackHost accepts localhost', () => {
  expect(
    getCodexOAuthCallbackHost({
      CODEX_OAUTH_CALLBACK_HOST: 'localhost',
    } as NodeJS.ProcessEnv),
  ).toBe('localhost')
})

test('getCodexOAuthCallbackHost accepts 127.0.0.1', () => {
  expect(
    getCodexOAuthCallbackHost({
      CODEX_OAUTH_CALLBACK_HOST: '127.0.0.1',
    } as NodeJS.ProcessEnv),
  ).toBe('127.0.0.1')

})

test('getCodexOAuthCallbackHost accepts ::1', () => {
  expect(
    getCodexOAuthCallbackHost({
      CODEX_OAUTH_CALLBACK_HOST: '::1',
    } as NodeJS.ProcessEnv),
  ).toBe('::1')
})

test('getCodexOAuthCallbackHost rejects hosts outside the allowed set', () => {
  for (const host of ['example.com', '0.0.0.0', 'localhost.example']) {
    expect(
      getCodexOAuthCallbackHost({
        CODEX_OAUTH_CALLBACK_HOST: host,
      } as NodeJS.ProcessEnv),
    ).toBe(DEFAULT_CODEX_OAUTH_CALLBACK_HOST)
  }
})

test('getCodexOAuthCallbackOrigin formats IPv6 loopback hosts with brackets', () => {
  expect(
    getCodexOAuthCallbackOrigin(1455, {
      CODEX_OAUTH_CALLBACK_HOST: '::1',
    } as NodeJS.ProcessEnv),
  ).toBe('http://[::1]:1455')
})
