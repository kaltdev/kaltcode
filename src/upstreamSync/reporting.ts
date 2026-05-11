import type { QueuedSyncItem, SyncLedgerEntry } from './types.js'

export function reportFileName(kind: 'scan' | 'port', date: string): string {
  return `${date}-${kind}.md`
}

export function releaseReportFileName(date: string): string {
  return `${date}-release.md`
}

export function buildScanReportMarkdown(input: { scannedAt: string; commits: QueuedSyncItem[] }): string {
  const lines = [
    '# Upstream scan report',
    '',
    `Scanned at: ${input.scannedAt}`,
    `Discovered commits: ${input.commits.length}`,
    '',
  ]

  if (input.commits.length === 0) {
    lines.push('No new upstream commits discovered.')
    return `${lines.join('\n')}\n`
  }

  for (const commit of input.commits) {
    lines.push(
      `- ${commit.shortSha} | ${commit.subject} | ${commit.category} | ${commit.risk} | ${commit.lane}`,
    )
  }

  return `${lines.join('\n')}\n`
}

export function buildPortReportMarkdown(input: { processedAt: string; entries: SyncLedgerEntry[] }): string {
  const lines = [
    '# Upstream port report',
    '',
    `Processed at: ${input.processedAt}`,
    '',
    '| Upstream | Status | Branch | Category | Notes |',
    '| --- | --- | --- | --- | --- |',
  ]

  for (const entry of input.entries) {
    lines.push(
      `| ${entry.upstreamShortSha} | ${entry.status} | ${entry.branchName ?? '-'} | ${entry.category} | ${entry.notes.join('; ') || '-'} |`,
    )
  }

  return `${lines.join('\n')}\n`
}

export function buildReleaseReportMarkdown(input: {
  createdAt: string
  currentVersion: string
  nextVersion: string | null
  decision: 'release' | 'no_release'
  entries: SyncLedgerEntry[]
}): string {
  const lines = [
    '# Upstream release evaluation',
    '',
    `Created at: ${input.createdAt}`,
    `Current version: ${input.currentVersion}`,
    `Decision: ${input.decision}`,
    `Next version: ${input.nextVersion ?? 'n/a'}`,
    '',
  ]

  if (input.entries.length === 0) {
    lines.push('No successful sync entries are pending release.')
    return `${lines.join('\n')}\n`
  }

  lines.push('## Included sync entries', '')
  for (const entry of input.entries) {
    lines.push(`- ${entry.upstreamShortSha} | ${entry.category} | ${entry.upstreamSubject}`)
  }

  return `${lines.join('\n')}\n`
}
