import { afterEach, describe, expect, mock, test } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { buildReleaseSummary, collectReleaseCandidates, recommendedReleaseBump } from '../src/upstreamSync/index.js'

describe('upstream sync release integration helpers', () => {
  const dirs: string[] = []

  afterEach(() => {
    while (dirs.length > 0) {
      rmSync(dirs.pop()!, { recursive: true, force: true })
    }
  })

  test('collects only successful unreleased entries', () => {
    const state = {
      lastScannedUpstreamSha: null,
      processedShas: {
        a: {
          upstreamSha: 'a',
          upstreamShortSha: 'a',
          upstreamSubject: 'docs: improve readme',
          lane: 'direct_apply',
          category: 'docs',
          risk: 'low',
          status: 'success',
          branchName: 'sync/upstream-a-docs-improve-readme',
          kaltCommitSha: 'k1',
          brandingRewriteApplied: true,
          verification: [],
          notes: [],
          createdAt: '2026-04-11T00:00:00.000Z',
          updatedAt: '2026-04-11T00:00:00.000Z',
          includedInRelease: false,
        },
        b: {
          upstreamSha: 'b',
          upstreamShortSha: 'b',
          upstreamSubject: 'fix: provider timeout',
          lane: 'intent_adaptation',
          category: 'provider',
          risk: 'high',
          status: 'verification_failed',
          branchName: 'sync/upstream-b-fix-provider-timeout',
          kaltCommitSha: null,
          brandingRewriteApplied: false,
          verification: [],
          notes: [],
          createdAt: '2026-04-11T00:00:00.000Z',
          updatedAt: '2026-04-11T00:00:00.000Z',
          includedInRelease: false,
        },
      },
    }

    const entries = collectReleaseCandidates(state)
    expect(entries).toHaveLength(1)
    expect(recommendedReleaseBump(entries)).toBe('patch')
    expect(buildReleaseSummary(entries)).toEqual(['a docs: docs: improve readme'])
  })
})
