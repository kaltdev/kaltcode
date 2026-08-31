import assert from 'node:assert/strict'
import test from 'node:test'

import { extractGitHubRepoSlug } from './repoSlug.ts'

test('keeps owner/repo input as-is', () => {
  assert.equal(extractGitHubRepoSlug('kaltdev/kaltcode'), 'kaltdev/kaltcode')
})

test('extracts slug from https GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('https://github.com/kaltdev/kaltcode'),
    'kaltdev/kaltcode',
  )
  assert.equal(
    extractGitHubRepoSlug('https://www.github.com/kaltdev/kaltcode.git'),
    'kaltdev/kaltcode',
  )
})

test('extracts slug from ssh GitHub URLs', () => {
  assert.equal(
    extractGitHubRepoSlug('git@github.com:kaltdev/kaltcode.git'),
    'kaltdev/kaltcode',
  )
  assert.equal(
    extractGitHubRepoSlug('ssh://git@github.com/kaltdev/kaltcode'),
    'kaltdev/kaltcode',
  )
})

test('rejects malformed or non-GitHub URLs', () => {
  assert.equal(extractGitHubRepoSlug('https://gitlab.com/kaltdev/kaltcode'), null)
  assert.equal(extractGitHubRepoSlug('https://github.com/kaltdev/kaltcode'), null)
  assert.equal(extractGitHubRepoSlug('not actually github.com/kaltdev/kaltcode'), null)
  assert.equal(
    extractGitHubRepoSlug('https://evil.example/?next=github.com/kaltdev/kaltcode'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://github.com.evil.example/kaltdev/kaltcode'),
    null,
  )
  assert.equal(
    extractGitHubRepoSlug('https://example.com/github.com/kaltdev/kaltcode'),
    null,
  )
})
