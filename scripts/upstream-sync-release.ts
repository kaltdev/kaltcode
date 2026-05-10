// @ts-nocheck
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  buildReleaseReportMarkdown,
  buildReleaseSummary,
  collectReleaseCandidates,
  ensureSyncDirs,
  loadSyncState,
  nextReleaseVersion,
  recommendedReleaseBump,
  releaseReportFileName,
  saveSyncState,
  syncReleasesDir,
} from '../src/upstreamSync/index.js'

function readPackageVersion(cwd: string): string {
  const pkg = JSON.parse(readFileSync(join(cwd, 'package.json'), 'utf8'))
  return pkg.version
}

async function main(): Promise<void> {
  const cwd = process.cwd()
  ensureSyncDirs(cwd)

  const state = loadSyncState(cwd)
  const entries = collectReleaseCandidates(state)
  const currentVersion = readPackageVersion(cwd)
  const bump = recommendedReleaseBump(entries)
  const nextVersion = bump ? nextReleaseVersion(currentVersion, bump) : null
  const decision = nextVersion ? 'release' : 'no_release'
  const createdAt = new Date().toISOString()

  const reportPath = join(syncReleasesDir(cwd), releaseReportFileName(createdAt.slice(0, 10)))
  const report = buildReleaseReportMarkdown({
    createdAt,
    currentVersion,
    nextVersion,
    decision,
    entries,
  })
  writeFileSync(reportPath, report, 'utf8')

  if (decision === 'release') {
    for (const entry of entries) {
      state.processedShas[entry.upstreamSha] = {
        ...entry,
        includedInRelease: true,
        updatedAt: createdAt,
        notes: [...entry.notes, `release candidate for ${nextVersion}`],
      }
    }
    saveSyncState(state, cwd)
  }

  console.log(
    JSON.stringify(
      {
        decision,
        currentVersion,
        nextVersion,
        entries: buildReleaseSummary(entries),
        reportPath,
      },
      null,
      2,
    ),
  )
}

await main()
