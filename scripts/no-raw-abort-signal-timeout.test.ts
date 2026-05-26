import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'
import { describe, expect, test } from 'bun:test'

const REPO_ROOT = join(import.meta.dir, '..')
const SCAN_ROOTS = ['src', 'scripts']
const SOURCE_GLOB = '*.{cjs,cts,js,jsx,mjs,mts,ts,tsx}'
const RAW_TIMEOUT_SIGNAL_PATTERN = String.raw`AbortSignal\s*\.\s*timeout\s*\(`

const require = createRequire(import.meta.url)

type Finding = {
  path: string
  line: number
  column: number
  source: string
}

function resolveRipgrepCommand(): string {
  try {
    const mod = require('@vscode/ripgrep') as { rgPath?: string }
    if (mod.rgPath && existsSync(mod.rgPath)) {
      return mod.rgPath
    }
  } catch {
    // Fall back to PATH; the thrown spawn error below will explain if missing.
  }

  return 'rg'
}

function isAllowedDocumentationLine(line: string): boolean {
  const trimmed = line.trim()
  const isComment =
    trimmed.startsWith('//') ||
    trimmed.startsWith('*') ||
    trimmed.startsWith('/*')

  return (
    isComment &&
    /\b(avoid|bug|Bun|clearTimeout|forbid|lazy|leak|memory|must not|instead)\b/i.test(
      trimmed,
    )
  )
}

function isAllowedTestFixtureLine(line: string): boolean {
  const trimmed = line.trim()
  const isStringOrRegexFixture =
    /["'`].*AbortSignal\s*\.\s*timeout\s*\(/.test(trimmed) ||
    /\/.*AbortSignal.*timeout.*\\?\(/.test(trimmed)

  return (
    isStringOrRegexFixture &&
    /\b(forbidden|fixture|guard|pattern|raw|regression)\b/i.test(trimmed)
  )
}

function isAllowedOccurrence(path: string, line: string): boolean {
  if (path === 'src/utils/combinedAbortSignal.ts') return true

  if (path.endsWith('.test.ts') || path.endsWith('.test.tsx')) {
    return isAllowedDocumentationLine(line) || isAllowedTestFixtureLine(line)
  }

  return isAllowedDocumentationLine(line)
}

function parseRipgrepFinding(line: string): Finding | null {
  const match = /^(.+?):(\d+):(\d+):(.*)$/.exec(line)
  if (!match) return null

  return {
    path: match[1].split('\\').join('/'),
    line: Number(match[2]),
    column: Number(match[3]),
    source: match[4].trim(),
  }
}

function findRawTimeoutSignalUsages(): Finding[] {
  const result = spawnSync(
    resolveRipgrepCommand(),
    [
      '--no-heading',
      '--line-number',
      '--column',
      '--glob',
      SOURCE_GLOB,
      RAW_TIMEOUT_SIGNAL_PATTERN,
      ...SCAN_ROOTS,
    ],
    { cwd: REPO_ROOT, encoding: 'utf8' },
  )

  if (result.error) {
    throw result.error
  }

  if (result.status === 1) {
    return []
  }

  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim())
  }

  return result.stdout
    .split(/\r?\n/)
    .filter(Boolean)
    .map(parseRipgrepFinding)
    .filter((finding): finding is Finding => finding !== null)
    .filter(finding => !isAllowedOccurrence(finding.path, finding.source))
}

describe('raw timeout signal guard', () => {
  test('source files use cleanup-safe timeout signal helpers', () => {
    const findings = findRawTimeoutSignalUsages()

    expect(
      findings.map(
        finding =>
          `${finding.path}:${finding.line}:${finding.column} ${finding.source}`,
      ),
    ).toEqual([])
  }, 10_000)
})
