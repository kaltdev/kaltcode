import { markPostCompaction } from 'src/bootstrap/state.js'
import { getSdkBetas } from '../../bootstrap/state.js'
import type { QuerySource } from '../../constants/querySource.js'
import type { ToolUseContext } from '../../Tool.js'
import type { Message } from '../../types/message.js'
import { getGlobalConfig } from '../../utils/config.js'
import { getContextWindowForModel } from '../../utils/context.js'
import { logForDebugging } from '../../utils/debug.js'
import { isEnvTruthy } from '../../utils/envUtils.js'
import { hasExactErrorMessage } from '../../utils/errors.js'
import type { CacheSafeParams } from '../../utils/forkedAgent.js'
import { logError } from '../../utils/log.js'
import { tokenCountWithEstimation } from '../../utils/tokens.js'
import { partitionContext } from '../../utils/contextPartitioning.js'
import { pruneByRelevance } from '../../utils/relevancePruning.js'
import { getFeatureValue_CACHED_MAY_BE_STALE } from '../analytics/growthbook.js'
import { getMaxOutputTokensForModel } from '../api/claude.js'
import { notifyCompaction } from '../api/promptCacheBreakDetection.js'
import { setLastSummarizedMessageId } from '../SessionMemory/sessionMemoryUtils.js'
import {
  type CompactionResult,
  compactConversation,
  ERROR_MESSAGE_USER_ABORT,
  type RecompactionInfo,
} from './compact.js'
import { runPostCompactCleanup } from './postCompactCleanup.js'
import { trySessionMemoryCompaction } from './sessionMemoryCompact.js'

// Reserve this many tokens for output during compaction
// Based on p99.99 of compact summary output being 17,387 tokens.
const MAX_OUTPUT_TOKENS_FOR_SUMMARY = 20_000

// Returns the context window size minus the max output tokens for the model
export function getEffectiveContextWindowSize(model: string): number {
  const reservedTokensForSummary = Math.min(
    getMaxOutputTokensForModel(model),
    MAX_OUTPUT_TOKENS_FOR_SUMMARY,
  )
  let contextWindow = getContextWindowForModel(model, getSdkBetas())

  const autoCompactWindow = process.env.KALT_CODE_AUTO_COMPACT_WINDOW
  if (autoCompactWindow) {
    const parsed = parseInt(autoCompactWindow, 10)
    if (!isNaN(parsed) && parsed > 0) {
      contextWindow = Math.min(contextWindow, parsed)
    }
  }

  // Floor: effective context must be at least the summary reservation plus a
  // usable buffer. If it goes lower, the auto-compact threshold becomes
  // negative and fires on every message (issue #635).
  const autocompactBuffer = 13_000 // must match AUTOCOMPACT_BUFFER_TOKENS
  const effectiveContext = contextWindow - reservedTokensForSummary
  return Math.max(effectiveContext, reservedTokensForSummary + autocompactBuffer)
}

export type AutoCompactTrackingState = {
  compacted: boolean
  turnCounter: number
  // Unique ID per turn
  turnId: string
  // Consecutive autocompact failures. Reset on success.
  // Used as a circuit breaker to stop retrying when the context is
  // irrecoverably over the limit (e.g., prompt_too_long).
  consecutiveFailures?: number
  // Epoch ms of the most recent autocompact failure. Anchors the cooldown
  // window so the breaker can re-derive the retry time even when an older
  // tracking object is missing nextRetryAtMs.
  lastFailureAtMs?: number
  // Epoch ms after which a single half-open retry is allowed. While the
  // breaker is tripped and now < nextRetryAtMs, autocompact is suppressed.
  nextRetryAtMs?: number
}

// Result of an autocompact attempt. Circuit-breaker metadata lets the caller
// (query loop) persist cooldown state and surface a clear "paused" message.
export type AutoCompactResult = {
  wasCompacted: boolean
  compactionResult?: CompactionResult
  // Consecutive failure count to thread back into AutoCompactTrackingState.
  consecutiveFailures?: number
  lastFailureAtMs?: number
  nextRetryAtMs?: number
  // True when the breaker is currently suppressing compaction (cooling down
  // or just re-tripped) AND the live context still needs compaction.
  circuitBreakerActive?: boolean
  // True only when THIS attempt pushed the breaker into the tripped state.
  circuitBreakerTripped?: boolean
}

export const AUTOCOMPACT_BUFFER_TOKENS = 13_000
export const WARNING_THRESHOLD_BUFFER_TOKENS = 20_000
export const ERROR_THRESHOLD_BUFFER_TOKENS = 20_000
export const MANUAL_COMPACT_BUFFER_TOKENS = 3_000

// Stop trying autocompact after this many consecutive failures.
// BQ 2026-03-10: 1,279 sessions had 50+ consecutive failures (up to 3,272)
// in a single session, wasting ~250K API calls/day globally.
export const MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3

// Once the breaker trips, suppress retries for this long before allowing a
// single half-open retry. Converts the old permanent suppression into a
// self-healing cooldown: a session whose context briefly spiked (then dropped)
// can recover instead of being stuck for its whole lifetime.
const AUTOCOMPACT_COOLDOWN_MS = 5 * 60_000

// Cooldown duration with optional env override (ms). Used both to schedule the
// next retry on failure and to derive the retry time when a tracking object is
// missing/has an invalid nextRetryAtMs.
export function getAutoCompactCooldownMs(): number {
  const override = process.env.KALT_CODE_AUTOCOMPACT_COOLDOWN_MS
  if (override) {
    const parsed = parseInt(override, 10)
    if (!isNaN(parsed) && parsed >= 0) {
      return parsed
    }
  }
  return AUTOCOMPACT_COOLDOWN_MS
}

// Resolve when the breaker may next retry. Prefer the explicit nextRetryAtMs;
// fall back to lastFailureAtMs + cooldown when it's missing or invalid
// (undefined, non-finite, or non-positive). Returns undefined when neither
// timestamp is available (legacy tracking) — callers treat that as "retry now".
export function resolveCircuitBreakerRetryAtMs(
  tracking?: Pick<
    AutoCompactTrackingState,
    'nextRetryAtMs' | 'lastFailureAtMs'
  >,
): number | undefined {
  const next = tracking?.nextRetryAtMs
  if (next !== undefined && Number.isFinite(next) && next > 0) {
    return next
  }
  const last = tracking?.lastFailureAtMs
  if (last !== undefined && Number.isFinite(last) && last > 0) {
    return last + getAutoCompactCooldownMs()
  }
  return undefined
}

export function getAutoCompactThreshold(model: string): number {
  const effectiveContextWindow = getEffectiveContextWindowSize(model)

  const autocompactThreshold =
    effectiveContextWindow - AUTOCOMPACT_BUFFER_TOKENS

  // Override for easier testing of autocompact
  const envPercent = process.env.KALT_CODE_AUTOCOMPACT_PCT_OVERRIDE
  if (envPercent) {
    const parsed = parseFloat(envPercent)
    if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
      const percentageThreshold = Math.floor(
        effectiveContextWindow * (parsed / 100),
      )
      return Math.min(percentageThreshold, autocompactThreshold)
    }
  }

  return autocompactThreshold
}

export function calculateTokenWarningState(
  tokenUsage: number,
  model: string,
): {
  percentLeft: number
  isAboveWarningThreshold: boolean
  isAboveErrorThreshold: boolean
  isAboveAutoCompactThreshold: boolean
  isAtBlockingLimit: boolean
} {
  const autoCompactThreshold = getAutoCompactThreshold(model)
  const threshold = isAutoCompactEnabled()
    ? autoCompactThreshold
    : getEffectiveContextWindowSize(model)

  // Use the raw context window (without output reservation) for the percentage
  // display, so users see remaining context relative to the model's full capacity.
  // The threshold (which subtracts buffer) should only affect when we warn/compact,
  // not what percentage we display.
  const rawContextWindow = getContextWindowForModel(model, getSdkBetas())
  const percentLeft = Math.max(
    0,
    Math.round(((rawContextWindow - tokenUsage) / rawContextWindow) * 100),
  )

  const warningThreshold = threshold - WARNING_THRESHOLD_BUFFER_TOKENS
  const errorThreshold = threshold - ERROR_THRESHOLD_BUFFER_TOKENS

  const isAboveWarningThreshold = tokenUsage >= warningThreshold
  const isAboveErrorThreshold = tokenUsage >= errorThreshold

  const isAboveAutoCompactThreshold =
    isAutoCompactEnabled() && tokenUsage >= autoCompactThreshold

  const actualContextWindow = getEffectiveContextWindowSize(model)
  const defaultBlockingLimit =
    actualContextWindow - MANUAL_COMPACT_BUFFER_TOKENS

  // Allow override for testing
  const blockingLimitOverride = process.env.KALT_CODE_BLOCKING_LIMIT_OVERRIDE
  const parsedOverride = blockingLimitOverride
    ? parseInt(blockingLimitOverride, 10)
    : NaN
  const blockingLimit =
    !isNaN(parsedOverride) && parsedOverride > 0
      ? parsedOverride
      : defaultBlockingLimit

  const isAtBlockingLimit = tokenUsage >= blockingLimit

  return {
    percentLeft,
    isAboveWarningThreshold,
    isAboveErrorThreshold,
    isAboveAutoCompactThreshold,
    isAtBlockingLimit,
  }
}

export function isAutoCompactEnabled(): boolean {
  if (isEnvTruthy(process.env.DISABLE_COMPACT)) {
    return false
  }
  // Allow disabling just auto-compact (keeps manual /compact working)
  if (isEnvTruthy(process.env.DISABLE_AUTO_COMPACT)) {
    return false
  }
  // Check if user has disabled auto-compact in their settings
  const userConfig = getGlobalConfig()
  return userConfig.autoCompactEnabled
}

export async function shouldAutoCompact(
  messages: Message[],
  model: string,
  querySource?: QuerySource,
  // Snip removes messages but the surviving assistant's usage still reflects
  // pre-snip context, so tokenCountWithEstimation can't see the savings.
  // Subtract the rough-delta that snip already computed.
  snipTokensFreed = 0,
): Promise<boolean> {
  // Recursion guards. session_memory and compact are forked agents that
  // would deadlock.
  if (querySource === 'session_memory' || querySource === 'compact') {
    return false
  }
  // marble_origami is the ctx-agent — if ITS context blows up and
  // autocompact fires, runPostCompactCleanup calls resetContextCollapse()
  // which destroys the MAIN thread's committed log (module-level state
  // shared across forks). Inside feature() so the string DCEs from
  // external builds (it's in excluded-strings.txt).
  if (false) {
    if (querySource === 'marble_origami') {
      return false
    }
  }

  if (!isAutoCompactEnabled()) {
    return false
  }

  // Reactive-only mode: suppress proactive autocompact, let reactive compact
  // catch the API's prompt-too-long. feature() wrapper keeps the flag string
  // out of external builds (REACTIVE_COMPACT is internal-only).
  // Note: returning false here also means autoCompactIfNeeded never reaches
  // trySessionMemoryCompaction in the query loop — the /compact call site
  // still tries session memory first. Revisit if reactive-only graduates.
  if (false) {
    if (getFeatureValue_CACHED_MAY_BE_STALE('tengu_cobalt_raccoon', false)) {
      return false
    }
  }

  // Context-collapse mode: same suppression. Collapse IS the context
  // management system when it's on — the 90% commit / 95% blocking-spawn
  // flow owns the headroom problem. Autocompact firing at effective-13k
  // (~93% of effective) sits right between collapse's commit-start (90%)
  // and blocking (95%), so it would race collapse and usually win, nuking
  // granular context that collapse was about to save. Gating here rather
  // than in isAutoCompactEnabled() keeps reactiveCompact alive as the 413
  // fallback (it consults isAutoCompactEnabled directly) and leaves
  // sessionMemory + manual /compact working.
  //
  // Consult isContextCollapseEnabled (not the raw gate) so the
  // KALT_CODE_CONTEXT_COLLAPSE env override is honored here too. require()
  // inside the block breaks the init-time cycle (this file exports
  // getEffectiveContextWindowSize which collapse's index imports).
  if (false) {
    /* eslint-disable @typescript-eslint/no-require-imports */
    const { isContextCollapseEnabled } =
      require('../contextCollapse/index.js') as typeof import('../contextCollapse/index.js')
    /* eslint-enable @typescript-eslint/no-require-imports */
    if (isContextCollapseEnabled()) {
      return false
    }
  }

  const tokenCount = tokenCountWithEstimation(messages) - snipTokensFreed
  const threshold = getAutoCompactThreshold(model)
  const effectiveWindow = getEffectiveContextWindowSize(model)

  logForDebugging(
    `autocompact: tokens=${tokenCount} threshold=${threshold} effectiveWindow=${effectiveWindow}${snipTokensFreed > 0 ? ` snipFreed=${snipTokensFreed}` : ''}`,
  )

  const { isAboveAutoCompactThreshold } = calculateTokenWarningState(
    tokenCount,
    model,
  )

  return isAboveAutoCompactThreshold
}

export async function autoCompactIfNeeded(
  messages: Message[],
  toolUseContext: ToolUseContext,
  cacheSafeParams: CacheSafeParams,
  querySource?: QuerySource,
  tracking?: AutoCompactTrackingState,
  snipTokensFreed?: number,
): Promise<AutoCompactResult> {
  if (isEnvTruthy(process.env.DISABLE_COMPACT)) {
    return { wasCompacted: false }
  }

  const model = toolUseContext.options.mainLoopModel
  const shouldCompact = await shouldAutoCompact(
    messages,
    model,
    querySource,
    snipTokensFreed,
  )

  if (!shouldCompact) {
    // Context is under the threshold — nothing to do, and the breaker is
    // irrelevant (don't report it active, so the caller doesn't block).
    return { wasCompacted: false }
  }

  // Circuit breaker (cooldown-based). After N consecutive failures the breaker
  // trips and suppresses retries for a cooldown window. Once the window
  // elapses, exactly one half-open retry is allowed: success resets the
  // breaker, failure re-trips it for another cooldown. This replaces the old
  // permanent suppression while preserving the protection against hammering
  // the API with doomed compaction attempts every turn.
  const failures = tracking?.consecutiveFailures ?? 0
  if (failures >= MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES) {
    const retryAtMs = resolveCircuitBreakerRetryAtMs(tracking)
    if (retryAtMs !== undefined && Date.now() < retryAtMs) {
      // Still cooling down. shouldCompact is true, so the live context really
      // is over the threshold — report an active breaker so the caller can
      // surface a clear "paused" message instead of a doomed API call.
      return {
        wasCompacted: false,
        consecutiveFailures: failures,
        lastFailureAtMs: tracking?.lastFailureAtMs,
        nextRetryAtMs: retryAtMs,
        circuitBreakerActive: true,
        circuitBreakerTripped: false,
      }
    }
    // Cooldown elapsed (or no timestamp to anchor it) → fall through for a
    // single half-open retry attempt below.
  }

  const contextWindow = getContextWindowForModel(model, getSdkBetas())

  const partitioned = partitionContext(messages, {
    contextWindow,
    recentCount: 5,
  })
  const availableSpace = partitioned.canFitInWindow
    ? contextWindow - partitioned.totalTokens
    : Math.floor(contextWindow * 0.1)

  if (!partitioned.canFitInWindow && availableSpace > 1000) {
    // Preserve system messages
    const systemMessages = messages.filter(m => m.message?.role === 'system')
    const nonSystemMessages = messages.filter(m => m.message?.role !== 'system')
    
    const pruned = pruneByRelevance(nonSystemMessages, {
      targetTokens: availableSpace,
      preserveRecent: 3,
      preserveTools: true,
      preserveErrors: true,
    })
    
    // Combine preserved system + pruned
    const finalMessages = [...systemMessages, ...pruned]
    
    if (finalMessages.length > 0 && finalMessages.length < messages.length) {
      logForDebugging(
        `partition+prune: ${messages.length} -> ${finalMessages.length} messages`,
      )
      messages = finalMessages
    }
  }

  const recompactionInfo: RecompactionInfo = {
    isRecompactionInChain: tracking?.compacted === true,
    turnsSincePreviousCompact: tracking?.turnCounter ?? -1,
    previousCompactTurnId: tracking?.turnId,
    autoCompactThreshold: getAutoCompactThreshold(model),
    querySource,
  }

  // EXPERIMENT: Try session memory compaction first
  const sessionMemoryResult = await trySessionMemoryCompaction(
    messages,
    toolUseContext.agentId,
    recompactionInfo.autoCompactThreshold,
  )
  if (sessionMemoryResult) {
    // Reset lastSummarizedMessageId since session memory compaction prunes messages
    // and the old message UUID will no longer exist after the REPL replaces messages
    setLastSummarizedMessageId(undefined)
    runPostCompactCleanup(querySource)
    // Reset cache read baseline so the post-compact drop isn't flagged as a
    // break. compactConversation does this internally; SM-compact doesn't.
    // BQ 2026-03-01: missing this made 20% of tengu_prompt_cache_break events
    // false positives (systemPromptChanged=true, timeSinceLastAssistantMsg=-1).
    if (true) {
      notifyCompaction(querySource ?? 'compact', toolUseContext.agentId)
    }
    markPostCompaction()
    return {
      wasCompacted: true,
      compactionResult: sessionMemoryResult,
      // Reset the breaker on success.
      consecutiveFailures: 0,
    }
  }

  try {
    const compactionResult = await compactConversation(
      messages,
      toolUseContext,
      cacheSafeParams,
      true, // Suppress user questions for autocompact
      undefined, // No custom instructions for autocompact
      true, // isAutoCompact
      recompactionInfo,
    )

    // Reset lastSummarizedMessageId since legacy compaction replaces all messages
    // and the old message UUID will no longer exist in the new messages array
    setLastSummarizedMessageId(undefined)
    runPostCompactCleanup(querySource)

    return {
      wasCompacted: true,
      compactionResult,
      // Reset failure count on success
      consecutiveFailures: 0,
    }
  } catch (error) {
    // User-aborted compactions are a deliberate cancel, not an automatic
    // failure — never count them toward the circuit breaker (and don't log).
    if (hasExactErrorMessage(error, ERROR_MESSAGE_USER_ABORT)) {
      return { wasCompacted: false }
    }
    logError(error)

    // Increment consecutive failure count for circuit breaker. The caller
    // threads this (plus the cooldown timestamps) through autoCompactTracking
    // so the next query loop iteration can suppress futile retries.
    const nextFailures = failures + 1
    const tripped = nextFailures >= MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES
    const lastFailureAtMs = Date.now()
    const nextRetryAtMs = tripped
      ? lastFailureAtMs + getAutoCompactCooldownMs()
      : undefined
    if (tripped) {
      logForDebugging(
        `autocompact: circuit breaker tripped after ${nextFailures} consecutive failures — cooling down ${getAutoCompactCooldownMs()}ms before the next retry`,
        { level: 'warn' },
      )
    }
    return {
      wasCompacted: false,
      consecutiveFailures: nextFailures,
      lastFailureAtMs,
      nextRetryAtMs,
      circuitBreakerActive: tripped,
      circuitBreakerTripped: tripped,
    }
  }
}
