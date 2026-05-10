// @ts-nocheck
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  buildPortPlan,
  buildPortReportMarkdown,
  buildSyncBranchName,
  didVerificationPass,
  ensureSyncDirs,
  findForbiddenBranding,
  loadSyncQueue,
  loadSyncState,
  reportFileName,
  rewriteBrandingText,
  runGit,
  runVerificationCommands,
  saveSyncQueue,
  saveSyncState,
  syncReportsDir,
  type QueuedSyncItem,
  type SyncLedgerEntry,
  type SyncStatus,
} from '../src/upstreamSync/index.js'

function todayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function getCurrentBranch(cwd: string): string {
  return runGit(['branch', '--show-current'], cwd).trim()
}

function listChangedFiles(cwd: string): string[] {
  return runGit(['diff', '--name-only', '--cached'], cwd)
    .split('
')
    .map(line => line.trim())
    .filter(Boolean)
}

function listHeadChangedFiles(cwd: string): string[] {
  return runGit(['show', '--pretty=', '--name-only', 'HEAD'], cwd)
    .split('
')
    .map(line => line.trim())
    .filter(Boolean)
}

function checkoutBranch(branchName: string, cwd: string): void {
  runGit(['checkout', '-B', branchName], cwd)
}

function restoreBranch(branchName: string, cwd: string): void {
  runGit(['reset', '--hard', 'HEAD'], cwd)
  runGit(['clean', '-fd'], cwd)
  runGit(['checkout', branchName], cwd)
}

function attemptCherryPick(sha: string, cwd: string): { ok: boolean; note: string } {
  try {
    runGit(['cherry-pick', '--no-commit', sha], cwd)
    return { ok: true, note: 'cherry-pick applied to index' }
  } catch (error) {
    try {
      runGit(['cherry-pick', '--abort'], cwd)
    } catch {}
    runGit(['reset', '--hard', 'HEAD'], cwd)
    return {
      ok: false,
      note: error instanceof Error ? error.message : `Failed to cherry-pick ${sha}`,
    }
  }
}

function applyBrandingRewrite(cwd: string): { changed: boolean; blocked: string[] } {
  const changedFiles = listChangedFiles(cwd)
  let changed = false
  const blocked: string[] = []

  for (const relativePath of changedFiles) {
    try {
      const absolutePath = join(cwd, relativePath)
      const content = readFileSync(absolutePath, 'utf8')
      const rewritten = rewriteBrandingText(content)
      if (rewritten.changed) {
        writeFileSync(absolutePath, rewritten.text, 'utf8')
        runGit(['add', relativePath], cwd)
        changed = true
      }
      const forbidden = findForbiddenBranding({ path: relativePath, content: rewritten.text })
      if (forbidden.length > 0) {
        blocked.push(`${relativePath}: ${forbidden.join(', ')}`)
      }
    } catch {
      // Ignore binary or deleted files.
    }
  }

  return { changed, blocked }
}

function buildCommitMessage(item: QueuedSyncItem, lane: string, verificationSummary: string): string {
  const type =
    item.category === 'docs'
      ? 'docs'
      : item.category === 'fix'
        ? 'fix'
        : item.category === 'refactor'
          ? 'refactor'
          : 'feat'

  return `${type}(sync): port upstream ${item.shortSha} ${item.subject}

Upstream repository: https://github.com/Gitlawb/openclaude.git
Upstream commit SHA: ${item.sha}
Processing lane: ${lane}
Branding rewrite applied: yes
Verification summary: ${verificationSummary}`
}

function finalizeCommit(item: QueuedSyncItem, cwd: string, verificationSummary: string): string {
  runGit(['add', '-A'], cwd)
  const message = buildCommitMessage(item, item.lane, verificationSummary)
  runGit(['commit', '-m', message], cwd)
  return runGit(['rev-parse', 'HEAD'], cwd).trim()
}

function pushBranch(branchName: string, cwd: string): void {
  runGit(['push', '-u', 'origin', branchName], cwd)
}

function ledgerEntryTemplate(item: QueuedSyncItem): SyncLedgerEntry {
  const now = new Date().toISOString()
  return {
    upstreamSha: item.sha,
    upstreamShortSha: item.shortSha,
    upstreamSubject: item.subject,
    lane: item.lane,
    category: item.category,
    risk: item.risk,
    status: 'queued',
    branchName: buildSyncBranchName({ sha: item.sha, subject: item.subject }),
    kaltCommitSha: null,
    brandingRewriteApplied: false,
    verification: [],
    notes: [],
    createdAt: now,
    updatedAt: now,
    includedInRelease: false,
  }
}

async function main(): Promise<void> {
  const cwd = process.cwd()
  ensureSyncDirs(cwd)

  const state = loadSyncState(cwd)
  const queue = loadSyncQueue(cwd)
  const item = queue.items.shift()

  if (!item) {
    console.log(JSON.stringify({ processed: 0, message: 'queue empty' }, null, 2))
    return
  }

  const baseBranch = getCurrentBranch(cwd)
  const entry = ledgerEntryTemplate(item)
  const actions = buildPortPlan(item)

  try {
    checkoutBranch(entry.branchName!, cwd)

    if (item.lane === 'direct_apply' && item.risk !== 'high') {
      const cherryPick = attemptCherryPick(item.sha, cwd)
      entry.notes.push(cherryPick.note)
      if (!cherryPick.ok) {
        entry.status = 'blocked_conflict'
      }
    } else {
      entry.status = 'skipped'
      entry.notes.push('intent adaptation lane requires implementation-specific recreation')
      entry.notes.push(...item.reasons)
    }

    if (entry.status === 'queued') {
      const branding = applyBrandingRewrite(cwd)
      entry.brandingRewriteApplied = branding.changed
      if (branding.blocked.length > 0) {
        entry.status = 'blocked_branding'
        entry.notes.push(...branding.blocked)
      }
    }

    if (entry.status === 'queued') {
      const commands = actions.find(action => action.type === 'verify')?.commands ?? []
      entry.verification = runVerificationCommands(commands, cwd)
      const verificationOk = didVerificationPass(entry.verification)
      if (!verificationOk) {
        entry.status = 'verification_failed'
        entry.notes.push('verification commands failed')
      } else {
        const summary = commands.join(', ')
        const headBeforeCommit = listHeadChangedFiles(cwd)
        if (headBeforeCommit.length === 0 && listChangedFiles(cwd).length === 0) {
          entry.status = 'skipped'
          entry.notes.push('no material changes remained after processing')
        } else {
          entry.kaltCommitSha = finalizeCommit(item, cwd, summary)
          pushBranch(entry.branchName!, cwd)
          entry.status = 'success'
          entry.notes.push('branch pushed to origin')
        }
      }
    }
  } finally {
    entry.updatedAt = new Date().toISOString()
    state.processedShas[item.sha] = entry
    saveSyncState(state, cwd)
    saveSyncQueue(queue, cwd)
    const reportPath = join(syncReportsDir(cwd), reportFileName('port', todayDate()))
    const existingEntries = Object.values(state.processedShas)
      .filter(candidate => candidate.updatedAt.slice(0, 10) === todayDate())
      .sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))
    writeFileSync(
      reportPath,
      buildPortReportMarkdown({ processedAt: new Date().toISOString(), entries: existingEntries }),
      'utf8',
    )
    restoreBranch(baseBranch, cwd)
  }

  console.log(JSON.stringify({ processed: 1, status: entry.status, branch: entry.branchName }, null, 2))
}

await main()
