import { afterEach, describe, expect, test } from 'bun:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { loadSyncQueue, loadSyncState, saveSyncQueue, saveSyncState } from './storage.js'

describe('storage helpers', () => {
  const dirs: string[] = []

  afterEach(() => {
    while (dirs.length > 0) {
      rmSync(dirs.pop()!, { recursive: true, force: true })
    }
  })

  test('initializes empty state and queue when files do not exist', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'kalt-sync-'))
    dirs.push(cwd)

    expect(loadSyncState(cwd)).toEqual({ lastScannedUpstreamSha: null, processedShas: {} })
    expect(loadSyncQueue(cwd)).toEqual({ items: [] })
  })

  test('persists saved state and queue and creates parent directories', () => {
    const cwd = mkdtempSync(join(tmpdir(), 'kalt-sync-'))
    dirs.push(cwd)

    saveSyncState({
      lastScannedUpstreamSha: 'abc1234',
      processedShas: {},
    }, cwd)
    saveSyncQueue({
      items: [
        {
          sha: 'abc1234def',
          shortSha: 'abc1234',
          subject: 'docs: improve readme',
          files: ['README.md'],
          category: 'docs',
          risk: 'low',
          lane: 'direct_apply',
          reasons: ['docs-only change'],
          discoveredAt: '2026-04-11T00:00:00.000Z',
        },
      ],
    }, cwd)

    expect(loadSyncState(cwd).lastScannedUpstreamSha).toBe('abc1234')
    expect(loadSyncQueue(cwd).items).toHaveLength(1)
  })
})
