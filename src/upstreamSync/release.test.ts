import { describe, expect, test } from 'bun:test'

import {
  collectReleaseCandidates,
  nextReleaseVersion,
  recommendedReleaseBump,
} from './release.js'
import type { SyncState } from './types.js'

describe('release helpers', () => {
  const baseEntry = {
    upstreamSha: 'a'.repeat(40),
    upstreamShortSha: 'aaaaaaa',
    upstreamSubject: 'fix: sample',
    lane: 'direct_apply' as const,
    category: 'fix' as const,
    risk: 'low' as const,
    status: 'success' as const,
    branchName: 'sync/upstream-aaaaaaa-fix-sample',
    kaltCommitSha: 'b'.repeat(40),
    brandingRewriteApplied: false,
    verification: [],
    notes: [],
    createdAt: '2026-04-11T00:00:00.000Z',
    updatedAt: '2026-04-11T00:00:00.000Z',
    includedInRelease: false,
  }

  test('returns no release when no successful unapplied syncs exist', () => {
    const state: SyncState = { lastScannedUpstreamSha: null, processedShas: {} }
    expect(collectReleaseCandidates(state)).toEqual([])
    expect(recommendedReleaseBump([])).toBeNull()
  })

  test('recommends patch bump for fix/docs/test entries', () => {
    expect(recommendedReleaseBump([baseEntry])).toBe('patch')
    expect(nextReleaseVersion('0.1.8', 'patch')).toBe('0.1.9')
  })

  test('recommends minor bump when a feature entry exists', () => {
    expect(recommendedReleaseBump([{ ...baseEntry, category: 'feature' }])).toBe('minor')
    expect(nextReleaseVersion('0.1.8', 'minor')).toBe('0.2.0')
  })
})
