import { describe, expect, test } from 'bun:test'

import { parseChangedFiles, parseLogLines } from './git.js'

describe('git helpers', () => {
  test('parses git log lines into commit refs', () => {
    const entries = parseLogLines('abc123	docs: improve readme	2026-04-11T00:00:00Z')
    expect(entries).toEqual([
      {
        sha: 'abc123',
        shortSha: 'abc123',
        subject: 'docs: improve readme',
        authoredAt: '2026-04-11T00:00:00Z',
      },
    ])
  })

  test('parses changed files', () => {
    expect(parseChangedFiles('README.md
src/index.ts
')).toEqual(['README.md', 'src/index.ts'])
  })
})
