export type SyncStatus =
  | 'queued'
  | 'success'
  | 'blocked_conflict'
  | 'blocked_branding'
  | 'verification_failed'
  | 'skipped'

export type SyncLane = 'direct_apply' | 'intent_adaptation'

export type CommitCategory =
  | 'fix'
  | 'feature'
  | 'docs'
  | 'deps'
  | 'tests'
  | 'branding'
  | 'release'
  | 'provider'
  | 'refactor'
  | 'unknown'

export type RiskLevel = 'low' | 'medium' | 'high'

export type UpstreamCommitRef = {
  sha: string
  shortSha: string
  subject: string
  authoredAt?: string
}

export type ClassifiedCommit = UpstreamCommitRef & {
  files: string[]
  category: CommitCategory
  risk: RiskLevel
  lane: SyncLane
  reasons: string[]
}

export type VerificationResult = {
  command: string
  ok: boolean
  exitCode: number
  stdout: string
  stderr: string
}

export type SyncLedgerEntry = {
  upstreamSha: string
  upstreamShortSha: string
  upstreamSubject: string
  lane: SyncLane
  category: CommitCategory
  risk: RiskLevel
  status: SyncStatus
  branchName: string | null
  kaltCommitSha: string | null
  brandingRewriteApplied: boolean
  verification: VerificationResult[]
  notes: string[]
  createdAt: string
  updatedAt: string
  includedInRelease: boolean
}

export type SyncState = {
  lastScannedUpstreamSha: string | null
  processedShas: Record<string, SyncLedgerEntry>
}

export type QueuedSyncItem = ClassifiedCommit & {
  discoveredAt: string
}

export type SyncQueue = {
  items: QueuedSyncItem[]
}
