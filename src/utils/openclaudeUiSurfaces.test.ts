import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test'
import { homedir } from 'os'
import { join } from 'path'
import {
  acquireSharedMutationLock,
  releaseSharedMutationLock,
} from '../test/sharedMutationLock.js'

import { isInGlobalClaudeFolder } from '../components/permissions/FilePermissionDialog/permissionOptions.tsx'
import { getDisplayPath } from './file.ts'
import { getDefaultPermissionModeOptions } from './permissions/defaultPermissionModeOptions.ts'
import {
  checkPathSafetyForAutoEdit,
  getClaudeSkillScope,
  isClaudeSettingsPath,
} from './permissions/filesystem.ts'
import { getValidationTip } from './settings/validationTips.ts'

const originalConfigDir = process.env.CLAUDE_CONFIG_DIR
const originalKaltCodeConfigDir = process.env.KALTCODE_CONFIG_DIR

beforeEach(async () => {
  await acquireSharedMutationLock('kaltcodeUiSurfaces.test.ts')
  mock.restore()
  delete process.env.CLAUDE_CONFIG_DIR
  delete process.env.KALTCODE_CONFIG_DIR
})

afterEach(() => {
  try {
    if (originalConfigDir === undefined) {
      delete process.env.CLAUDE_CONFIG_DIR
    } else {
      process.env.CLAUDE_CONFIG_DIR = originalConfigDir
    }
    if (originalKaltCodeConfigDir === undefined) {
      delete process.env.KALTCODE_CONFIG_DIR
    } else {
      process.env.KALTCODE_CONFIG_DIR = originalKaltCodeConfigDir
    }
  } finally {
    releaseSharedMutationLock()
  }
})

describe('Kalt Code settings path surfaces', () => {
  test('isClaudeSettingsPath recognizes project .kaltcode settings files', () => {
    expect(
      isClaudeSettingsPath(
        join(process.cwd(), '.kaltcode', 'settings.json'),
      ),
    ).toBe(true)

    expect(
      isClaudeSettingsPath(
        join(process.cwd(), '.kaltcode', 'settings.local.json'),
      ),
    ).toBe(true)
  })

  test('legacy .kaltcode paths remain protected from auto-editing', () => {
    expect(
      isClaudeSettingsPath(join(process.cwd(), '.kaltcode', 'settings.json')),
    ).toBe(true)
    expect(
      isClaudeSettingsPath(
        join(process.cwd(), '.kaltcode', 'settings.local.json'),
      ),
    ).toBe(true)

    expect(
      checkPathSafetyForAutoEdit(
        join(process.cwd(), '.kaltcode', 'settings.json'),
      ),
    ).toMatchObject({ safe: false })
    expect(
      checkPathSafetyForAutoEdit(
        join(process.cwd(), '.kaltcode', 'commands', 'foo.md'),
      ),
    ).toMatchObject({ safe: false })
  })

  test('permission save destinations point user settings to configured KALTCODE_CONFIG_DIR', async () => {
    const customConfigDir = join(homedir(), 'custom-kaltcode')
    process.env.KALTCODE_CONFIG_DIR = customConfigDir
    delete process.env.CLAUDE_CONFIG_DIR
    const { optionForPermissionSaveDestination } = await import(
      '../components/permissions/rules/AddPermissionRules.tsx'
    )

    expect(optionForPermissionSaveDestination('userSettings')).toEqual({
      label: 'User settings',
      description: `Saved in ${getDisplayPath(join(customConfigDir, 'settings.json'))}`,
      value: 'userSettings',
    })
  })

  test('skills help surfaces point user skills to configured KALTCODE_CONFIG_DIR', async () => {
    const customConfigDir = join(homedir(), 'custom-kaltcode')
    process.env.KALTCODE_CONFIG_DIR = customConfigDir
    delete process.env.CLAUDE_CONFIG_DIR
    const { getEmptySkillsMenuMessage } = await import(
      '../components/skills/SkillsMenu.tsx'
    )
    const { getCustomCommandsTipContent } = await import(
      '../services/tips/tipRegistry.ts'
    )
    const customSkillPath = getDisplayPath(
      join(customConfigDir, 'skills', '<name>', 'SKILL.md'),
    )

    expect(getEmptySkillsMenuMessage()).toContain(customSkillPath)
    expect(getCustomCommandsTipContent()).toContain(customSkillPath)
  })

  test('permission save destinations point project settings to .kaltcode', async () => {
    const { optionForPermissionSaveDestination } = await import(
      '../components/permissions/rules/AddPermissionRules.tsx'
    )

    expect(optionForPermissionSaveDestination('projectSettings')).toEqual({
      label: 'Project settings',
      description: 'Checked in at .kaltcode/settings.json',
      value: 'projectSettings',
    })

    expect(optionForPermissionSaveDestination('localSettings')).toEqual({
      label: 'Project settings (local)',
      description: 'Saved in .kaltcode/settings.local.json',
      value: 'localSettings',
    })
  })

  test('permission dialog treats ~/.kaltcode as the global Claude folder', () => {
    process.env.KALTCODE_CONFIG_DIR = join(homedir(), '.kaltcode')
    delete process.env.CLAUDE_CONFIG_DIR

    expect(
      isInGlobalClaudeFolder(
        join(homedir(), '.kaltcode', 'settings.json'),
      ),
    ).toBe(true)
    expect(
      isInGlobalClaudeFolder(join(homedir(), '.kaltcode', 'settings.json')),
    ).toBe(false)
  })

  test('permission dialog does not treat arbitrary CLAUDE_CONFIG_DIR as the global Claude folder', () => {
    process.env.CLAUDE_CONFIG_DIR = join(homedir(), 'custom-kaltcode')

    expect(
      isInGlobalClaudeFolder(
        join(homedir(), 'custom-kaltcode', 'settings.json'),
      ),
    ).toBe(false)
  })

  test('global skill scope recognizes ~/.kaltcode skills only', () => {
    process.env.KALTCODE_CONFIG_DIR = join(homedir(), '.kaltcode')
    delete process.env.CLAUDE_CONFIG_DIR

    expect(
      getClaudeSkillScope(
        join(homedir(), '.kaltcode', 'skills', 'demo', 'SKILL.md'),
      ),
    ).toEqual({
      skillName: 'demo',
      pattern: '~/.kaltcode/skills/demo/**',
    })

    expect(
      getClaudeSkillScope(
        join(homedir(), '.kaltcode', 'skills', 'legacy', 'SKILL.md'),
      ),
    ).toBeNull()
  })

  test('global skill scope does not emit fixed rules for arbitrary CLAUDE_CONFIG_DIR skills', () => {
    process.env.CLAUDE_CONFIG_DIR = join(homedir(), 'custom-kaltcode')

    expect(
      getClaudeSkillScope(
        join(homedir(), 'custom-kaltcode', 'skills', 'demo', 'SKILL.md'),
      ),
    ).toBe(null)
  })
})

describe('Kalt Code validation tips', () => {
  test('permissions.defaultMode invalid value keeps suggestion but no Claude docs link', () => {
    const tip = getValidationTip({
      path: 'permissions.defaultMode',
      code: 'invalid_value',
      enumValues: [
        'acceptEdits',
        'bypassPermissions',
        'default',
        'dontAsk',
        'fullAccess',
        'plan',
      ],
    })

    expect(tip).toEqual({
      suggestion:
        'Valid modes: "acceptEdits" (ask before file changes), "plan" (analysis only), "bypassPermissions" (auto-accept prompts), "fullAccess" (skip even hard safety-check prompts), or "default" (standard behavior)',
    })
  })
})

describe('Kalt Code permission mode surfaces', () => {
  test('default permission mode picker excludes dangerous persisted modes', () => {
    const options = getDefaultPermissionModeOptions(true)

    expect(options).not.toContain('bypassPermissions')
    expect(options).not.toContain('fullAccess')
  })
})
