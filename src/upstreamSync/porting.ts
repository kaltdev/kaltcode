import { buildSyncBranchName } from './branching.js'
import { verificationPlanForCommit } from './verification.js'
import type { ClassifiedCommit } from './types.js'

export type PortAction =
  | { type: 'checkout-branch'; branchName: string }
  | { type: 'cherry-pick'; sha: string }
  | { type: 'rewrite-branding' }
  | { type: 'manual-adaptation'; sha: string; notes: string[] }
  | { type: 'verify'; commands: string[] }

export function buildPortPlan(commit: ClassifiedCommit): PortAction[] {
  const branchName = buildSyncBranchName({ sha: commit.sha, subject: commit.subject })
  const actions: PortAction[] = [{ type: 'checkout-branch', branchName }]

  if (commit.lane === 'direct_apply' && commit.risk !== 'high') {
    actions.push({ type: 'cherry-pick', sha: commit.sha })
  } else {
    actions.push({
      type: 'manual-adaptation',
      sha: commit.sha,
      notes: commit.reasons.length > 0 ? commit.reasons : ['manual intent adaptation required'],
    })
  }

  actions.push({ type: 'rewrite-branding' })
  actions.push({ type: 'verify', commands: verificationPlanForCommit(commit) })
  return actions
}
