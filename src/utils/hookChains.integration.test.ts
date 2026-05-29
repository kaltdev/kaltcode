import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setReplBridgeHandle } from '../bridge/replBridgeHandle.js'
import { setClaudeConfigHomeDirForTesting } from './envUtils.js'
import { writeTeamFileAsync, type TeamFile } from './swarm/teamHelpers.js'
import { readMailbox } from './teammateMailbox.js'

type HookChainsModule = typeof import('./hookChains.js')

const tempDirs: string[] = []
const originalHookChainsEnabled = process.env.CLAUDE_CODE_ENABLE_HOOK_CHAINS

async function createConfigFile(config: unknown): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'kaltcode-hook-chains-int-'))
  tempDirs.push(dir)
  const filePath = join(dir, 'hook-chains.json')
  await writeFile(filePath, JSON.stringify(config, null, 2), 'utf-8')
  return filePath
}

function createTeamFile(teamName: string, memberNames: string[]): TeamFile {
  return {
    name: teamName,
    createdAt: Date.now(),
    leadAgentId: 'lead-agent-id',
    members: memberNames.map((name, index) => ({
      agentId: `agent-${index}`,
      name,
      joinedAt: Date.now(),
      tmuxPaneId: `%${index}`,
      cwd: process.cwd(),
      subscriptions: [],
    })),
  }
}

async function importHookChainsHarness(): Promise<{
  mod: HookChainsModule
  agentToolCallSpy: ReturnType<typeof mock>
}> {
  mock.restore()
  mock.module('../services/policyLimits/index.js', () => ({
    _resetPolicyLimitsForTesting: () => {},
    initializePolicyLimitsLoadingPromise: () => {},
    isPolicyLimitsEligible: () => true,
    waitForPolicyLimitsToLoad: async () => {},
    isPolicyAllowed: () => true,
    loadPolicyLimits: async () => {},
    refreshPolicyLimits: async () => {},
    clearPolicyLimitsCache: async () => {},
    startBackgroundPolling: () => {},
    stopBackgroundPolling: () => {},
  }))

  const agentToolCallSpy = mock(async () => ({
    data: {
      status: 'async_launched',
      agentId: 'agent-fallback-1',
    },
  }))

  const mod = await import(`./hookChains.js?integration=${Date.now()}-${Math.random()}`)
  return { mod, agentToolCallSpy }
}

beforeEach(async () => {
  process.env.CLAUDE_CODE_ENABLE_HOOK_CHAINS = '1'
  const configHomeDir = await mkdtemp(join(tmpdir(), 'kaltcode-hook-chains-home-'))
  tempDirs.push(configHomeDir)
  setClaudeConfigHomeDirForTesting(configHomeDir)
  setReplBridgeHandle(null)
})

afterEach(async () => {
  mock.restore()
  setClaudeConfigHomeDirForTesting(undefined)

  if (originalHookChainsEnabled === undefined) {
    delete process.env.CLAUDE_CODE_ENABLE_HOOK_CHAINS
  } else {
    process.env.CLAUDE_CODE_ENABLE_HOOK_CHAINS = originalHookChainsEnabled
  }

  await Promise.all(
    tempDirs.splice(0).map(dir => rm(dir, { recursive: true, force: true })),
  )
})

describe('hookChains integration dispatch', () => {
  test('end-to-end rule evaluation + action dispatch on TaskCompleted failure', async () => {
    const { mod } = await importHookChainsHarness()
    await writeTeamFileAsync(
      'mesh-team',
      createTeamFile('mesh-team', ['mesh-lead', 'worker-a', 'worker-b']),
    )

    const configPath = await createConfigFile({
      version: 1,
      enabled: true,
      maxChainDepth: 3,
      defaultCooldownMs: 0,
      defaultDedupWindowMs: 0,
      rules: [
        {
          id: 'task-failure-recovery',
          trigger: { event: 'TaskCompleted', outcome: 'failed' },
          actions: [
            { type: 'spawn_fallback_agent' },
            { type: 'notify_team' },
          ],
        },
      ],
    })

    const spawnSpy = mock(async () => ({ launched: true, agentId: 'agent-e2e-1' }))
    const notifySpy = mock(async () => ({ sent: true, recipientCount: 2 }))

    const result = await mod.dispatchHookChainsForEvent({
      configPathOverride: configPath,
      event: {
        eventName: 'TaskCompleted',
        outcome: 'failed',
        payload: {
          task_id: 'task-001',
          task_subject: 'Patch flaky build',
          error: 'CI timeout',
        },
      },
      runtime: {
        teamName: 'mesh-team',
        senderName: 'mesh-lead',
        senderColor: 'blue',
        onSpawnFallbackAgent: spawnSpy,
        onNotifyTeam: notifySpy,
      },
    })

    expect(result.enabled).toBe(true)
    expect(result.matchedRuleIds).toEqual(['task-failure-recovery'])
    expect(result.actionResults).toHaveLength(2)
    expect(result.actionResults[0]?.status).toBe('executed')
    expect(result.actionResults[1]?.status).toBe('executed')
    expect(spawnSpy).toHaveBeenCalledTimes(1)
    expect(notifySpy).toHaveBeenCalledTimes(1)
  }, 30000)

  test('fallback spawn injects failure context into generated prompt', async () => {
    const { mod, agentToolCallSpy } = await importHookChainsHarness()

    const configPath = await createConfigFile({
      version: 1,
      enabled: true,
      maxChainDepth: 3,
      defaultCooldownMs: 0,
      defaultDedupWindowMs: 0,
      rules: [
        {
          id: 'fallback-context',
          trigger: { event: 'TaskCompleted', outcome: 'failed' },
          actions: [
            {
              type: 'spawn_fallback_agent',
              description: 'Fallback for failed task',
            },
          ],
        },
      ],
    })

    const result = await mod.dispatchHookChainsForEvent({
      configPathOverride: configPath,
      event: {
        eventName: 'TaskCompleted',
        outcome: 'failed',
        payload: {
          task_id: 'task-ctx-1',
          task_subject: 'Repair migration guard',
          task_description: 'Fix regression in check ordering',
          error: 'Task failed after retry budget exhausted',
        },
      },
      runtime: {
        onSpawnFallbackAgent: async request => {
          await agentToolCallSpy({
            prompt: request.prompt,
            description: request.description,
            run_in_background: request.runInBackground,
            subagent_type: request.agentType,
            model: request.model,
          })
          return { launched: true, agentId: 'agent-fallback-ctx' }
        },
      },
    })

    expect(result.actionResults[0]?.status).toBe('executed')
    expect(agentToolCallSpy).toHaveBeenCalledTimes(1)

    const callInput = agentToolCallSpy.mock.calls[0]?.[0] as {
      prompt: string
      description: string
      run_in_background: boolean
    }

    expect(callInput.description).toBe('Fallback for failed task')
    expect(callInput.run_in_background).toBe(true)
    expect(callInput.prompt).toContain('Event: TaskCompleted')
    expect(callInput.prompt).toContain('Outcome: failed')
    expect(callInput.prompt).toContain('Task subject: Repair migration guard')
    expect(callInput.prompt).toContain('Failure details: Task failed after retry budget exhausted')
  })

  test('notify_team dispatches mailbox writes when team exists and skips when absent', async () => {
    const withTeam = await importHookChainsHarness()
    await writeTeamFileAsync(
      'mesh-a',
      createTeamFile('mesh-a', ['lead-a', 'worker-1', 'worker-2']),
    )

    const configPathWithTeam = await createConfigFile({
      version: 1,
      enabled: true,
      maxChainDepth: 3,
      defaultCooldownMs: 0,
      defaultDedupWindowMs: 0,
      rules: [
        {
          id: 'notify-existing-team',
          trigger: { event: 'TaskCompleted', outcome: 'failed' },
          actions: [{ type: 'notify_team' }],
        },
      ],
    })

    const withTeamResult = await withTeam.mod.dispatchHookChainsForEvent({
      configPathOverride: configPathWithTeam,
      event: {
        eventName: 'TaskCompleted',
        outcome: 'failed',
        payload: { task_id: 'task-team-ok', error: 'boom' },
      },
      runtime: {
        teamName: 'mesh-a',
        senderName: 'lead-a',
        senderColor: 'blue',
      },
    })

    expect(withTeamResult.actionResults[0]?.status).toBe('executed')
    const worker1Inbox = await readMailbox('worker-1', 'mesh-a')
    const worker2Inbox = await readMailbox('worker-2', 'mesh-a')
    expect(worker1Inbox).toHaveLength(1)
    expect(worker2Inbox).toHaveLength(1)
    expect(worker1Inbox[0]?.from).toBe('lead-a')
    expect(worker2Inbox[0]?.from).toBe('lead-a')

    const withoutTeam = await importHookChainsHarness()

    const configPathWithoutTeam = await createConfigFile({
      version: 1,
      enabled: true,
      maxChainDepth: 3,
      defaultCooldownMs: 0,
      defaultDedupWindowMs: 0,
      rules: [
        {
          id: 'notify-missing-team',
          trigger: { event: 'TaskCompleted', outcome: 'failed' },
          actions: [{ type: 'notify_team' }],
        },
      ],
    })

    const withoutTeamResult = await withoutTeam.mod.dispatchHookChainsForEvent({
      configPathOverride: configPathWithoutTeam,
      event: {
        eventName: 'TaskCompleted',
        outcome: 'failed',
        payload: { task_id: 'task-team-missing', error: 'boom' },
      },
      runtime: {
        teamName: 'mesh-missing',
        senderName: 'lead-missing',
        senderColor: 'blue',
      },
    })

    expect(withoutTeamResult.actionResults[0]?.status).toBe('skipped')
    expect(withoutTeamResult.actionResults[0]?.reason).toContain('Team file not found')
    expect(await readMailbox('worker-1', 'mesh-missing')).toEqual([])
  })

  test('warm_remote_capacity is a safe no-op when bridge is inactive', async () => {
    const { mod } = await importHookChainsHarness()

    const configPath = await createConfigFile({
      version: 1,
      enabled: true,
      maxChainDepth: 3,
      defaultCooldownMs: 0,
      defaultDedupWindowMs: 0,
      rules: [
        {
          id: 'bridge-warmup-noop',
          trigger: { event: 'TaskCompleted', outcome: 'failed' },
          actions: [{ type: 'warm_remote_capacity' }],
        },
      ],
    })

    const result = await mod.dispatchHookChainsForEvent({
      configPathOverride: configPath,
      event: {
        eventName: 'TaskCompleted',
        outcome: 'failed',
        payload: { task_id: 'task-warm-1' },
      },
    })

    expect(result.actionResults).toHaveLength(1)
    expect(result.actionResults[0]?.status).toBe('skipped')
    expect(result.actionResults[0]?.reason).toContain('Bridge is not active')
  })
})
