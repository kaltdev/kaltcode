import { describe, expect, test } from 'bun:test'

import {
  buildPortReportMarkdown,
  buildReleaseReportMarkdown,
  buildScanReportMarkdown,
  releaseReportFileName,
  reportFileName,
} from './reporting.js'

describe('reporting helpers', () => {
  test('creates date-based report filenames', () => {
    expect(reportFileName('scan', '2026-04-11')).toBe('2026-04-11-scan.md')
    expect(releaseReportFileName('2026-04-11')).toBe('2026-04-11-release.md')
  })

  test('includes discovered shas in scan report', () => {
    const markdown = buildScanReportMarkdown({
      scannedAt: '2026-04-11T00:00:00.000Z',
      commits: [
        {
          sha: 'a'.repeat(40),
          shortSha: 'aaaaaaa',
          subject: 'docs: improve readme',
          files: ['README.md'],
          category: 'docs',
          risk: 'low',
          lane: 'direct_apply',
          reasons: ['docs-only change'],
          discoveredAt: '2026-04-11T00:00:00.000Z',
        },
      ],
    })

    expect(markdown).toContain('aaaaaaa')
  })

  test('includes success and failure rows in port report', () => {
    const markdown = buildPortReportMarkdown({
      processedAt: '2026-04-11T00:00:00.000Z',
      entries: [
        {
          upstreamSha: 'a'.repeat(40),
          upstreamShortSha: 'aaaaaaa',
          upstreamSubject: 'docs: improve readme',
          lane: 'direct_apply',
          category: 'docs',
          risk: 'low',
          status: 'success',
          branchName: 'sync/upstream-aaaaaaa-docs',
          kaltCommitSha: 'b'.repeat(40),
          brandingRewriteApplied: true,
          verification: [],
          notes: ['ok'],
          createdAt: '2026-04-11T00:00:00.000Z',
          updatedAt: '2026-04-11T00:00:00.000Z',
          includedInRelease: false,
        },
      ],
    })

    expect(markdown).toContain('| aaaaaaa | success |')
  })

  test('includes release decision and version summary', () => {
    const markdown = buildReleaseReportMarkdown({
      createdAt: '2026-04-11T00:00:00.000Z',
      currentVersion: '0.1.8',
      nextVersion: '0.1.9',
      decision: 'release',
      entries: [],
    })

    expect(markdown).toContain('Decision: release')
    expect(markdown).toContain('Next version: 0.1.9')
  })
})
