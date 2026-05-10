import { describe, expect, test } from 'bun:test'

import { classifyCommit } from './classifier.js'

describe('classifyCommit', () => {
  test('classifies docs-only commits as low-risk direct apply', () => {
    const result = classifyCommit({
      sha: 'a'.repeat(40),
      subject: 'docs: improve guide',
      files: ['docs/guide.md'],
    })

    expect(result.category).toBe('docs')
    expect(result.risk).toBe('low')
    expect(result.lane).toBe('direct_apply')
  })

  test('classifies package metadata as high-risk release adaptation', () => {
    const result = classifyCommit({
      sha: 'b'.repeat(40),
      subject: 'chore: bump version',
      files: ['package.json'],
    })

    expect(result.category).toBe('release')
    expect(result.risk).toBe('high')
    expect(result.lane).toBe('intent_adaptation')
  })

  test('classifies provider changes as high-risk adaptation', () => {
    const result = classifyCommit({
      sha: 'c'.repeat(40),
      subject: 'fix: provider timeout',
      files: ['src/services/api/providerConfig.ts'],
    })

    expect(result.category).toBe('provider')
    expect(result.risk).toBe('high')
    expect(result.lane).toBe('intent_adaptation')
  })

  test('classifies tests-only commits as low-risk direct apply', () => {
    const result = classifyCommit({
      sha: 'd'.repeat(40),
      subject: 'test: tighten unit coverage',
      files: ['src/foo.test.ts'],
    })

    expect(result.category).toBe('tests')
    expect(result.risk).toBe('low')
    expect(result.lane).toBe('direct_apply')
  })

  test('treats branding-sensitive readme changes as high-risk adaptation', () => {
    const result = classifyCommit({
      sha: 'e'.repeat(40),
      subject: 'fix: rebrand openclaude docs',
      files: ['README.md'],
    })

    expect(result.category).toBe('branding')
    expect(result.risk).toBe('high')
    expect(result.lane).toBe('intent_adaptation')
  })
})
