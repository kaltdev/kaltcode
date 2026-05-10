import semver from 'semver'

import type { SyncLedgerEntry, SyncState } from './types.js'

export function collectReleaseCandidates(state: SyncState): SyncLedgerEntry[] {
  return Object.values(state.processedShas).filter(
    entry => entry.status === 'success' && !entry.includedInRelease,
  )
}

export function recommendedReleaseBump(entries: SyncLedgerEntry[]): 'patch' | 'minor' | null {
  if (entries.length === 0) {
    return null
  }

  if (entries.some(entry => entry.category === 'feature')) {
    return 'minor'
  }

  return 'patch'
}

export function nextReleaseVersion(currentVersion: string, bump: 'patch' | 'minor'): string {
  const next = semver.inc(currentVersion, bump)
  if (!next) {
    throw new Error(`Could not bump version ${currentVersion} with ${bump}`)
  }

  return next
}

export function buildReleaseSummary(entries: SyncLedgerEntry[]): string[] {
  return entries.map(entry => `${entry.upstreamShortSha} ${entry.category}: ${entry.upstreamSubject}`)
}
