import { describe, expect, test } from 'bun:test'

import { buildPortPlan } from './porting.js'

describe('buildPortPlan', () => {
  test('uses cherry-pick for direct apply commits', () => {
    const plan = buildPortPlan({
      sha: 'a'.repeat(40),
      shortSha: 'aaaaaaa',
      subject: 'docs: improve readme',
      files: ['docs/readme.md'],
      category: 'docs',
      risk: 'low',
      lane: 'direct_apply',
      reasons: ['docs-only change'],
    })

    expect(plan.some(action => action.type === 'cherry-pick')).toBe(true)
  })

  test('uses manual adaptation for intent-adaptation lane', () => {
    const plan = buildPortPlan({
      sha: 'b'.repeat(40),
      shortSha: 'bbbbbbb',
      subject: 'fix: provider timeout',
      files: ['src/services/api/provider.ts'],
      category: 'provider',
      risk: 'high',
      lane: 'intent_adaptation',
      reasons: ['provider or api surface touched'],
    })

    expect(plan.some(action => action.type === 'manual-adaptation')).toBe(true)
    expect(plan.some(action => action.type === 'cherry-pick')).toBe(false)
  })
})
