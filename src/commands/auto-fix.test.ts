import { describe, expect, test } from 'bun:test'
import autoFixCommand from './auto-fix.js'

describe('/auto-fix command prompt', () => {
  test('points project and local settings at canonical .kaltcode paths', async () => {
    expect(autoFixCommand.type).toBe('prompt')
    if (autoFixCommand.type !== 'prompt') {
      throw new Error('/auto-fix must be a prompt command')
    }

    const blocks = await autoFixCommand.getPromptForCommand('', {} as never)
    const text = blocks?.map(block => ('text' in block ? block.text : '')).join('\n')

    expect(text).toContain('.kaltcode/settings.json')
    expect(text).toContain('.kaltcode/settings.local.json')
    expect(text).not.toContain('.kaltcode/settings.json')
    expect(text).not.toContain('.kaltcode/settings.local.json')
  })
})
