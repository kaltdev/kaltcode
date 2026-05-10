// @ts-nocheck
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  buildScanReportMarkdown,
  classifyCommit,
  ensureSyncDirs,
  fetchUpstream,
  getCommitFiles,
  listUnprocessedUpstreamCommits,
  loadSyncQueue,
  loadSyncState,
  reportFileName,
  saveSyncQueue,
  saveSyncState,
  syncReportsDir,
} from '../src/upstreamSync/index.js'

function todayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

async function main(): Promise<void> {
  const cwd = process.cwd()
  ensureSyncDirs(cwd)
  fetchUpstream(cwd)

  const state = loadSyncState(cwd)
  const queue = loadSyncQueue(cwd)
  const known = new Set([
    ...Object.keys(state.processedShas),
    ...queue.items.map(item => item.sha),
  ])

  const commits = listUnprocessedUpstreamCommits({
    cwd,
    sinceSha: state.lastScannedUpstreamSha,
    limit: 100,
  })

  const discoveredAt = new Date().toISOString()
  const newItems = commits
    .filter(commit => !known.has(commit.sha))
    .map(commit =>
      classifyCommit({
        sha: commit.sha,
        subject: commit.subject,
        authoredAt: commit.authoredAt,
        files: getCommitFiles(commit.sha, cwd),
      }),
    )
    .map(commit => ({
      ...commit,
      discoveredAt,
    }))

  if (commits.length > 0) {
    state.lastScannedUpstreamSha = commits.at(-1)?.sha ?? state.lastScannedUpstreamSha
  }

  queue.items.push(...newItems)
  saveSyncQueue(queue, cwd)
  saveSyncState(state, cwd)

  const report = buildScanReportMarkdown({ scannedAt: discoveredAt, commits: newItems })
  const reportPath = join(syncReportsDir(cwd), reportFileName('scan', todayDate()))
  writeFileSync(reportPath, report, 'utf8')

  console.log(
    JSON.stringify(
      {
        discovered: newItems.length,
        queueLength: queue.items.length,
        reportPath,
      },
      null,
      2,
    ),
  )
}

await main()
