import { afterEach, beforeEach } from 'bun:test'
import { homedir, tmpdir } from 'node:os'
import { join } from 'node:path'

const testConfigDir = join(tmpdir(), `kaltcode-bun-test-${process.pid}`)

delete process.env.KALTCODE_CONFIG_DIR
process.env.CLAUDE_CONFIG_DIR = testConfigDir

const baselineKaltCodeConfigDir = process.env.KALTCODE_CONFIG_DIR
const baselineClaudeConfigDir = process.env.CLAUDE_CONFIG_DIR
const homeConfigDirs = new Set([
  join(homedir(), '.kaltcode').normalize('NFC'),
  join(homedir(), '.openclaude').normalize('NFC'),
  join(homedir(), '.claude').normalize('NFC'),
])

beforeEach(() => {
  if (
    (!process.env.KALTCODE_CONFIG_DIR && !process.env.CLAUDE_CONFIG_DIR) ||
    isHomeConfigDir(process.env.KALTCODE_CONFIG_DIR) ||
    isHomeConfigDir(process.env.CLAUDE_CONFIG_DIR)
  ) {
    restoreBaselineConfigDirEnv()
  }
})

afterEach(() => {
  restoreBaselineConfigDirEnv()
})

function restoreBaselineConfigDirEnv(): void {
  if (baselineKaltCodeConfigDir === undefined) {
    delete process.env.KALTCODE_CONFIG_DIR
  } else {
    process.env.KALTCODE_CONFIG_DIR = baselineKaltCodeConfigDir
  }

  if (baselineClaudeConfigDir === undefined) {
    delete process.env.CLAUDE_CONFIG_DIR
  } else {
    process.env.CLAUDE_CONFIG_DIR = baselineClaudeConfigDir
  }
}

function isHomeConfigDir(value: string | undefined): boolean {
  return value ? homeConfigDirs.has(value.normalize('NFC')) : false
}
