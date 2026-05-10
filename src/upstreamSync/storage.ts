import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'

import { syncQueuePath, syncReportsDir, syncReleasesDir, syncRoot, syncStatePath } from './paths.js'
import type { SyncQueue, SyncState } from './types.js'

const EMPTY_STATE: SyncState = {
  lastScannedUpstreamSha: null,
  processedShas: {},
}

const EMPTY_QUEUE: SyncQueue = {
  items: [],
}

export function ensureSyncDirs(cwd = process.cwd()): void {
  mkdirSync(syncRoot(cwd), { recursive: true })
  mkdirSync(syncReportsDir(cwd), { recursive: true })
  mkdirSync(syncReleasesDir(cwd), { recursive: true })
}

export function loadSyncState(cwd = process.cwd()): SyncState {
  const path = syncStatePath(cwd)
  if (!existsSync(path)) {
    return structuredClone(EMPTY_STATE)
  }

  return {
    ...EMPTY_STATE,
    ...JSON.parse(readFileSync(path, 'utf8')),
    processedShas: {
      ...EMPTY_STATE.processedShas,
      ...JSON.parse(readFileSync(path, 'utf8')).processedShas,
    },
  }
}

export function saveSyncState(state: SyncState, cwd = process.cwd()): void {
  ensureSyncDirs(cwd)
  writeFileSync(syncStatePath(cwd), `${JSON.stringify(state, null, 2)}
`)
}

export function loadSyncQueue(cwd = process.cwd()): SyncQueue {
  const path = syncQueuePath(cwd)
  if (!existsSync(path)) {
    return structuredClone(EMPTY_QUEUE)
  }

  return {
    ...EMPTY_QUEUE,
    ...JSON.parse(readFileSync(path, 'utf8')),
    items: Array.isArray(JSON.parse(readFileSync(path, 'utf8')).items)
      ? JSON.parse(readFileSync(path, 'utf8')).items
      : [],
  }
}

export function saveSyncQueue(queue: SyncQueue, cwd = process.cwd()): void {
  ensureSyncDirs(cwd)
  writeFileSync(syncQueuePath(cwd), `${JSON.stringify(queue, null, 2)}
`)
}
