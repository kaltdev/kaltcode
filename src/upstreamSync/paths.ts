import { join, resolve } from 'node:path'

import {
  KALT_SYNC_DIR,
  QUEUE_FILE,
  RELEASES_DIR,
  REPORTS_DIR,
  STATE_FILE,
} from './constants.js'

export function syncRoot(cwd = process.cwd()): string {
  return resolve(cwd, KALT_SYNC_DIR)
}

export function syncStatePath(cwd = process.cwd()): string {
  return join(syncRoot(cwd), STATE_FILE)
}

export function syncQueuePath(cwd = process.cwd()): string {
  return join(syncRoot(cwd), QUEUE_FILE)
}

export function syncReportsDir(cwd = process.cwd()): string {
  return join(syncRoot(cwd), REPORTS_DIR)
}

export function syncReleasesDir(cwd = process.cwd()): string {
  return join(syncRoot(cwd), RELEASES_DIR)
}
