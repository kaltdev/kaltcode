import { describe, expect, test } from 'bun:test'

import { didVerificationPass, verificationPlanForCommit } from './verification.js'

describe('verification helpers', () => {
  test('assigns light plan for docs commits', () => {
    const plan = verificationPlanForCommit({
      sha: 'a'.repeat(40),
      shortSha: 'aaaaaaa',
      subject: 'docs: update readme',
      files: ['README.md'],
      category: 'docs',
      risk: 'low',
      lane: 'direct_apply',
      reasons: [],
    })

    expect(plan).toEqual(['bun run build', 'bun run smoke'])
  })

  test('assigns broad plan for high-risk provider commits', () => {
    const plan = verificationPlanForCommit({
      sha: 'a'.repeat(40),
      shortSha: 'aaaaaaa',
      subject: 'fix: provider timeout',
      files: ['src/services/api/provider.ts'],
      category: 'provider',
      risk: 'high',
      lane: 'intent_adaptation',
      reasons: [],
    })

    expect(plan).toEqual(['bun run build', 'bun run typecheck', 'bun run smoke', 'bun test'])
  })

  test('reports verification pass only when all commands passed', () => {
    expect(didVerificationPass([{ command: 'a', ok: true, exitCode: 0, stdout: '', stderr: '' }])).toBe(true)
  })
})
