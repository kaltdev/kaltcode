import { afterEach, describe, expect, mock, test } from 'bun:test'
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'fs'
import * as fsPromises from 'fs/promises'
import { homedir, tmpdir } from 'os'
import { join } from 'path'
import { acquireEnvMutex, releaseEnvMutex } from '../entrypoints/sdk/shared.js'

const originalEnv = { ...process.env }
const originalArgv = [...process.argv]

async function importFreshEnvUtils() {
  return import(`./envUtils.ts?ts=${Date.now()}-${Math.random()}`)
}

async function importFreshSettings() {
  return import(`./settings/settings.ts?ts=${Date.now()}-${Math.random()}`)
}

async function importFreshLocalInstaller() {
  return import(`./localInstaller.ts?ts=${Date.now()}-${Math.random()}`)
}

async function importFreshPlans() {
  return import(`./plans.ts?ts=${Date.now()}-${Math.random()}`)
}

afterEach(() => {
  try {
    process.env = { ...originalEnv }
    process.argv = [...originalArgv]
    mock.restore()
  } finally {
    releaseEnvMutex()
  }
})

describe('Kalt Code paths', () => {
  test('defaults user config home to ~/.kaltcode', async () => {
    await acquireEnvMutex()
    delete process.env.KALTCODE_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(
      resolveClaudeConfigHomeDir({
        homeDir: homedir(),
      }),
    ).toBe(join(homedir(), '.kaltcode'))
  })

  test('hard-cuts user config home to ~/.kaltcode by default', async () => {
    await acquireEnvMutex()
    delete process.env.KALTCODE_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(
      resolveClaudeConfigHomeDir({
        homeDir: homedir(),
      }),
    ).toBe(join(homedir(), '.kaltcode'))
  })

  test('does not migrate legacy .kaltcode config into .kaltcode', async () => {
    await acquireEnvMutex()
    const tempHome = mkdtempSync(join(tmpdir(), 'kaltcode-paths-test-'))
    try {
      mkdirSync(join(tempHome, '.kaltcode', 'skills', 'legacy-skill'), {
        recursive: true,
      })
      writeFileSync(
        join(tempHome, '.kaltcode', 'skills', 'legacy-skill', 'SKILL.md'),
        'legacy skill',
      )
      writeFileSync(join(tempHome, '.kaltcode', 'settings.json'), '{}')
      writeFileSync(join(tempHome, '.kaltcode.json'), '{"legacy":true}')
      writeFileSync(
        join(tempHome, '.kaltcode-custom-oauth.json'),
        '{"custom":true}',
      )
      expect(existsSync(join(tempHome, '.kaltcode'))).toBe(false)
    } finally {
      rmSync(tempHome, { recursive: true, force: true })
    }
  })

  test('config home does not fall back to legacy .kaltcode', async () => {
    await acquireEnvMutex()
    const tempHome = mkdtempSync(join(tmpdir(), 'kaltcode-paths-test-'))
    try {
      writeFileSync(join(tempHome, '.kaltcode'), 'not a directory')
      mkdirSync(join(tempHome, '.kaltcode'), { recursive: true })
      mock.module('os', () => ({
        homedir: () => tempHome,
        tmpdir,
      }))
      delete process.env.KALTCODE_CONFIG_DIR
      delete process.env.CLAUDE_CONFIG_DIR

      const { getClaudeConfigHomeDir } = await importFreshEnvUtils()

      expect(getClaudeConfigHomeDir()).toBe(join(tempHome, '.kaltcode'))
    } finally {
      rmSync(tempHome, { recursive: true, force: true })
    }
  })

  test('default plans directory uses ~/.kaltcode/plans', async () => {
    await acquireEnvMutex()
    delete process.env.KALTCODE_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(getDefaultPlansDirectory({ homeDir: homedir() })).toBe(
      join(homedir(), '.kaltcode', 'plans'),
    )
  })

  test('default plans directory respects explicit configDirEnv argument', async () => {
    await acquireEnvMutex()
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(
      getDefaultPlansDirectory({ configDirEnv: '/tmp/custom-kaltcode' }),
    ).toBe(join('/tmp/custom-kaltcode', 'plans'))
  })

  test('default plans directory respects KALTCODE_CONFIG_DIR', async () => {
    await acquireEnvMutex()
    process.env.KALTCODE_CONFIG_DIR = '/tmp/preferred-kaltcode'
    delete process.env.CLAUDE_CONFIG_DIR
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(getDefaultPlansDirectory()).toBe(
      join('/tmp/preferred-kaltcode', 'plans'),
    )
  })

  test('KALTCODE_CONFIG_DIR wins for default plans directory', async () => {
    await acquireEnvMutex()
    process.env.KALTCODE_CONFIG_DIR = '/tmp/preferred-kaltcode'
    process.env.CLAUDE_CONFIG_DIR = '/tmp/legacy-kaltcode'
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(getDefaultPlansDirectory()).toBe(
      join('/tmp/preferred-kaltcode', 'plans'),
    )
  })

  test('default plans directory normalizes generated path to NFC', async () => {
    await acquireEnvMutex()
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(
      getDefaultPlansDirectory({ homeDir: '/tmp/cafe\u0301' }),
    ).toBe(join('/tmp/caf\u00e9', '.kaltcode', 'plans'))
  })

  test('default plans directory normalizes explicit configDirEnv argument to NFC', async () => {
    await acquireEnvMutex()
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(
      getDefaultPlansDirectory({ configDirEnv: '/tmp/cafe\u0301-kaltcode' }),
    ).toBe(join('/tmp/caf\u00e9-kaltcode', 'plans'))
  })

  test('ignores CLAUDE_CONFIG_DIR override when provided', async () => {
    await acquireEnvMutex()
    delete process.env.KALTCODE_CONFIG_DIR
    process.env.CLAUDE_CONFIG_DIR = '/tmp/custom-kaltcode'
    mock.module('os', () => ({
      homedir: () => '/tmp/home',
      tmpdir,
    }))
    const { getClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe('/tmp/home/.kaltcode')
  })

  test('KALTCODE_CONFIG_DIR overrides the default (issue #454)', async () => {
    await acquireEnvMutex()
    delete process.env.CLAUDE_CONFIG_DIR
    process.env.KALTCODE_CONFIG_DIR = '/tmp/oc-config-only'
    const { getClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe('/tmp/oc-config-only')
  })

  test('KALTCODE_CONFIG_DIR wins when both env vars are set with different values', async () => {
    await acquireEnvMutex()
    process.env.KALTCODE_CONFIG_DIR = '/tmp/oc-wins'
    process.env.CLAUDE_CONFIG_DIR = '/tmp/legacy-loses'
    const { getClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe('/tmp/oc-wins')
  })

  test('CLAUDE_CONFIG_DIR is ignored when KALTCODE_CONFIG_DIR is unset', async () => {
    await acquireEnvMutex()
    delete process.env.KALTCODE_CONFIG_DIR
    process.env.CLAUDE_CONFIG_DIR = '/tmp/legacy-only'
    const { getClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe(join(homedir(), '.kaltcode'))
  })

  test('empty KALTCODE_CONFIG_DIR does not fall through to CLAUDE_CONFIG_DIR', async () => {
    await acquireEnvMutex()
    process.env.KALTCODE_CONFIG_DIR = ''
    process.env.CLAUDE_CONFIG_DIR = '/tmp/legacy-fallback'
    const { getClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe(join(homedir(), '.kaltcode'))
  })

  test('resolveConfigDirEnv ignores CLAUDE_CONFIG_DIR without warning', async () => {
    await acquireEnvMutex()
    const { resolveConfigDirEnv, __resetConfigDirEnvWarningForTesting } =
      await importFreshEnvUtils()
    __resetConfigDirEnvWarningForTesting()

    const warnings: string[] = []
    const result = resolveConfigDirEnv({
      kaltCodeConfigDir: '/a',
      legacyConfigDir: '/b',
      warn: m => warnings.push(m),
    })

    expect(result).toBe('/a')
    expect(warnings.length).toBe(0)

    resolveConfigDirEnv({
      kaltCodeConfigDir: '/x',
      legacyConfigDir: '/y',
      warn: m => warnings.push(m),
    })
    expect(warnings.length).toBe(0)
  })

  test('resolveConfigDirEnv ignores legacy env for silent and warning callers', async () => {
    await acquireEnvMutex()
    const { resolveConfigDirEnv, __resetConfigDirEnvWarningForTesting } =
      await importFreshEnvUtils()
    __resetConfigDirEnvWarningForTesting()

    expect(
      resolveConfigDirEnv({
        kaltCodeConfigDir: '/silent-open',
        legacyConfigDir: '/silent-legacy',
      }),
    ).toBe('/silent-open')

    const warnings: string[] = []
    expect(
      resolveConfigDirEnv({
        kaltCodeConfigDir: '/warn-open',
        legacyConfigDir: '/warn-legacy',
        warn: m => warnings.push(m),
      }),
    ).toBe('/warn-open')
    expect(warnings.length).toBe(0)
  })

  test('resolveConfigDirEnv does not warn when both env vars agree', async () => {
    await acquireEnvMutex()
    const { resolveConfigDirEnv, __resetConfigDirEnvWarningForTesting } =
      await importFreshEnvUtils()
    __resetConfigDirEnvWarningForTesting()

    const warnings: string[] = []
    const result = resolveConfigDirEnv({
      kaltCodeConfigDir: '/same',
      legacyConfigDir: '/same',
      warn: m => warnings.push(m),
    })

    expect(result).toBe('/same')
    expect(warnings).toEqual([])
  })

  test('resolveConfigDirEnv returns undefined when neither env var is set', async () => {
    await acquireEnvMutex()
    const { resolveConfigDirEnv } = await importFreshEnvUtils()

    expect(
      resolveConfigDirEnv({
        kaltCodeConfigDir: undefined,
        legacyConfigDir: undefined,
      }),
    ).toBeUndefined()
  })

  test('project and local settings paths use .kaltcode', async () => {
    await acquireEnvMutex()
    const { getRelativeSettingsFilePathForSource } = await importFreshSettings()

    expect(getRelativeSettingsFilePathForSource('projectSettings')).toBe(
      '.kaltcode/settings.json',
    )
    expect(getRelativeSettingsFilePathForSource('localSettings')).toBe(
      '.kaltcode/settings.local.json',
    )
  })

  test('local installer uses kaltcode wrapper path', async () => {
    await acquireEnvMutex()
    process.env.KALTCODE_CONFIG_DIR = join(homedir(), '.kaltcode')
    delete process.env.CLAUDE_CONFIG_DIR
    const { getLocalClaudePath } = await importFreshLocalInstaller()

    expect(getLocalClaudePath()).toBe(
      join(homedir(), '.kaltcode', 'local', 'kaltcode'),
    )
  })

  test('local installation detection matches .kaltcode path', async () => {
    await acquireEnvMutex()
    const { isManagedLocalInstallationPath } =
      await importFreshLocalInstaller()

    expect(
      isManagedLocalInstallationPath(
        `${join(homedir(), '.kaltcode', 'local')}/node_modules/.bin/kaltcode`,
      ),
    ).toBe(true)
  })

  test('local installation detection ignores legacy .kaltcode path', async () => {
    await acquireEnvMutex()
    const { isManagedLocalInstallationPath } =
      await importFreshLocalInstaller()

    expect(
      isManagedLocalInstallationPath(
        `${join(homedir(), '.kaltcode', 'local')}/node_modules/.bin/kaltcode`,
      ),
    ).toBe(false)
  })

  test('candidate local install dirs include only kaltcode path', async () => {
    await acquireEnvMutex()
    const { getCandidateLocalInstallDirs } = await importFreshLocalInstaller()

    expect(
      getCandidateLocalInstallDirs({
        configHomeDir: join(homedir(), '.kaltcode'),
      }),
    ).toEqual([
      join(homedir(), '.kaltcode', 'local'),
    ])
  })

  test('legacy local installs are ignored even when they expose the claude binary', async () => {
    await acquireEnvMutex()
    mock.module('fs/promises', () => ({
      ...fsPromises,
      access: async (path: string) => {
        if (
          path === join(homedir(), '.kaltcode', 'local', 'node_modules', '.bin', 'claude')
        ) {
          return
        }
        throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
      },
    }))

    const { getDetectedLocalInstallDir, localInstallationExists } =
      await importFreshLocalInstaller()

    expect(await localInstallationExists()).toBe(false)
    expect(await getDetectedLocalInstallDir()).toBeNull()
  })
})
