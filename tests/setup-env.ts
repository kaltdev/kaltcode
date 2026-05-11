import { afterEach, beforeEach } from 'bun:test'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const testConfigDir = join(tmpdir(), `kaltcode-bun-test-${process.pid}`)

delete process.env.KALTCODE_CONFIG_DIR
if (!process.env.KALTCODE_CONFIG_DIR && !process.env.CLAUDE_CONFIG_DIR) {
  process.env.CLAUDE_CONFIG_DIR = testConfigDir
}

const baselineKaltCodeConfigDir = process.env.KALTCODE_CONFIG_DIR
const baselineClaudeConfigDir = process.env.CLAUDE_CONFIG_DIR

beforeEach(() => {
  restoreBaselineConfigDirEnv()
  if (!process.env.KALTCODE_CONFIG_DIR && !process.env.CLAUDE_CONFIG_DIR) {
    process.env.CLAUDE_CONFIG_DIR = testConfigDir
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
