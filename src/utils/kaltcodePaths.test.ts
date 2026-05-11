import { afterEach, describe, expect, mock, test as bunTest } from 'bun:test'
import * as fsPromises from 'fs/promises'
import { homedir } from 'os'
import { join } from 'path'

const originalEnv = { ...process.env }
const originalArgv = [...process.argv]
const KALTCODE_PATHS_TEST_TIMEOUT_MS = 20_000

function test(
  name: string,
  fn: Parameters<typeof bunTest>[1],
): ReturnType<typeof bunTest> {
  return bunTest(name, fn, KALTCODE_PATHS_TEST_TIMEOUT_MS)
}

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
  process.env = { ...originalEnv }
  process.argv = [...originalArgv]
  mock.restore()
})

describe('Kalt Code paths', () => {
  test('defaults user config home to ~/.kaltcode', async () => {
    delete process.env.KALTCODE_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(
      resolveClaudeConfigHomeDir({
        homeDir: homedir(),
        kaltCodeExists: false,
        deprecatedOpenClaudeExists: false,
        legacyClaudeExists: false,
      }),
    ).toBe(join(homedir(), '.kaltcode'))
  })

  test('uses ~/.kaltcode when it exists before deprecated fallbacks', async () => {
    delete process.env.KALTCODE_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(
      resolveClaudeConfigHomeDir({
        homeDir: homedir(),
        kaltCodeExists: true,
        deprecatedOpenClaudeExists: true,
        legacyClaudeExists: true,
      }),
    ).toBe(join(homedir(), '.kaltcode'))
  })

  test('falls back to deprecated ~/.openclaude when ~/.kaltcode does not exist', async () => {
    delete process.env.KALTCODE_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(
      resolveClaudeConfigHomeDir({
        homeDir: homedir(),
        kaltCodeExists: false,
        deprecatedOpenClaudeExists: true,
        legacyClaudeExists: true,
      }),
    ).toBe(join(homedir(), '.openclaude'))
  })

  test('falls back to ~/.claude when only legacy Claude config exists', async () => {
    delete process.env.KALTCODE_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { resolveClaudeConfigHomeDir } = await importFreshEnvUtils()

    expect(
      resolveClaudeConfigHomeDir({
        homeDir: homedir(),
        kaltCodeExists: false,
        deprecatedOpenClaudeExists: false,
        legacyClaudeExists: true,
      }),
    ).toBe(join(homedir(), '.claude'))
  })

  test('default plans directory uses ~/.kaltcode/plans', async () => {
    delete process.env.KALTCODE_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(getDefaultPlansDirectory({ homeDir: homedir() })).toBe(
      join(homedir(), '.kaltcode', 'plans'),
    )
  })

  test('default plans directory respects explicit KALTCODE_CONFIG_DIR', async () => {
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(
      getDefaultPlansDirectory({ configDirEnv: '/tmp/custom-kaltcode' }),
    ).toBe(join('/tmp/custom-kaltcode', 'plans'))
  })

  test('default plans directory normalizes generated path to NFC', async () => {
    delete process.env.KALTCODE_CONFIG_DIR
    delete process.env.CLAUDE_CONFIG_DIR
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(
      getDefaultPlansDirectory({ homeDir: '/tmp/cafe\u0301' }),
    ).toBe(join('/tmp/caf\u00e9', '.kaltcode', 'plans'))
  })

  test('default plans directory normalizes explicit KALTCODE_CONFIG_DIR to NFC', async () => {
    const { getDefaultPlansDirectory } = await importFreshPlans()

    expect(
      getDefaultPlansDirectory({ configDirEnv: '/tmp/cafe\u0301-kaltcode' }),
    ).toBe(join('/tmp/caf\u00e9-kaltcode', 'plans'))
  })

  test('uses KALTCODE_CONFIG_DIR before deprecated CLAUDE_CONFIG_DIR when both are provided', async () => {
    process.env.KALTCODE_CONFIG_DIR = '/tmp/custom-kaltcode'
    process.env.CLAUDE_CONFIG_DIR = '/tmp/custom-claude'
    const { getClaudeConfigHomeDir, resolveClaudeConfigHomeDir } =
      await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe('/tmp/custom-kaltcode')
    expect(
      resolveClaudeConfigHomeDir({
        configDirEnv: '/tmp/custom-kaltcode',
        legacyConfigDirEnv: '/tmp/custom-claude',
      }),
    ).toBe('/tmp/custom-kaltcode')
  })

  test('uses deprecated CLAUDE_CONFIG_DIR override when KALTCODE_CONFIG_DIR is absent', async () => {
    delete process.env.KALTCODE_CONFIG_DIR
    process.env.CLAUDE_CONFIG_DIR = '/tmp/custom-claude'
    const { getClaudeConfigHomeDir, resolveClaudeConfigHomeDir } =
      await importFreshEnvUtils()

    expect(getClaudeConfigHomeDir()).toBe('/tmp/custom-claude')
    expect(
      resolveClaudeConfigHomeDir({
        legacyConfigDirEnv: '/tmp/custom-claude',
      }),
    ).toBe('/tmp/custom-claude')
  })

  test('project and local settings paths use .kaltcode', async () => {
    const { getRelativeSettingsFilePathForSource } = await importFreshSettings()

    expect(getRelativeSettingsFilePathForSource('projectSettings')).toBe(
      '.kaltcode/settings.json',
    )
    expect(getRelativeSettingsFilePathForSource('localSettings')).toBe(
      '.kaltcode/settings.local.json',
    )
  })

  test('local installer uses kalt-code wrapper path', async () => {
    process.env.KALTCODE_CONFIG_DIR = join(homedir(), '.kaltcode')
    delete process.env.CLAUDE_CONFIG_DIR
    const { getLocalClaudePath } = await importFreshLocalInstaller()

    expect(getLocalClaudePath()).toBe(
      join(homedir(), '.kaltcode', 'local', 'kalt-code'),
    )
  })

  test('local installation detection matches .kaltcode path', async () => {
    const { isManagedLocalInstallationPath } =
      await importFreshLocalInstaller()

    expect(
      isManagedLocalInstallationPath(
        `${join(homedir(), '.kaltcode', 'local')}/node_modules/.bin/kalt-code`,
      ),
    ).toBe(true)
  })

  test('local installation detection still matches deprecated .openclaude path', async () => {
    const { isManagedLocalInstallationPath } =
      await importFreshLocalInstaller()

    expect(
      isManagedLocalInstallationPath(
        `${join(homedir(), '.openclaude', 'local')}/node_modules/.bin/openclaude`,
      ),
    ).toBe(true)
  })

  test('local installation detection still matches legacy .claude path', async () => {
    const { isManagedLocalInstallationPath } =
      await importFreshLocalInstaller()

    expect(
      isManagedLocalInstallationPath(
        `${join(homedir(), '.claude', 'local')}/node_modules/.bin/openclaude`,
      ),
    ).toBe(true)
  })

  test('candidate local install dirs include Kalt Code, deprecated OpenClaude, and legacy Claude paths', async () => {
    const { getCandidateLocalInstallDirs } = await importFreshLocalInstaller()

    expect(
      getCandidateLocalInstallDirs({
        configHomeDir: join(homedir(), '.kaltcode'),
        homeDir: homedir(),
      }),
    ).toEqual([
      join(homedir(), '.kaltcode', 'local'),
      join(homedir(), '.openclaude', 'local'),
      join(homedir(), '.claude', 'local'),
    ])
  })

  test('deprecated OpenClaude local installs are detected when they still expose the openclaude binary', async () => {
    mock.module('fs/promises', () => ({
      ...fsPromises,
      access: async (path: string) => {
        if (
          path ===
          join(
            homedir(),
            '.openclaude',
            'local',
            'node_modules',
            '.bin',
            'openclaude',
          )
        ) {
          return
        }
        throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
      },
    }))

    const { getDetectedLocalInstallDir, localInstallationExists } =
      await importFreshLocalInstaller()

    expect(await localInstallationExists()).toBe(true)
    expect(await getDetectedLocalInstallDir()).toBe(
      join(homedir(), '.openclaude', 'local'),
    )
  })

  test('legacy Claude local installs are detected when they still expose the claude binary', async () => {
    mock.module('fs/promises', () => ({
      ...fsPromises,
      access: async (path: string) => {
        if (
          path ===
          join(homedir(), '.claude', 'local', 'node_modules', '.bin', 'claude')
        ) {
          return
        }
        throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' })
      },
    }))

    const { getDetectedLocalInstallDir, localInstallationExists } =
      await importFreshLocalInstaller()

    expect(await localInstallationExists()).toBe(true)
    expect(await getDetectedLocalInstallDir()).toBe(
      join(homedir(), '.claude', 'local'),
    )
  })
})
