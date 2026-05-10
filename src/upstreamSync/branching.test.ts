import { describe, expect, test } from 'bun:test'

import { buildSyncBranchName } from './branching.js'

describe('buildSyncBranchName', () => {
  test('uses expected branch prefix and slugifies subject', () => {
    expect(buildSyncBranchName({ sha: '1234567890abcdef', subject: 'Fix: Hello, World!' })).toBe(
      'sync/upstream-1234567-fix-hello-world',
    )
  })

  test('falls back to change when subject has no slug text', () => {
    expect(buildSyncBranchName({ sha: 'abcdef1234567890', subject: '!!!' })).toBe(
      'sync/upstream-abcdef1-change',
    )
  })
})
