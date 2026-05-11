import { spawnSync } from 'node:child_process'

import type { UpstreamCommitRef } from './types.js'

export function runGit(args: string[], cwd = process.cwd()) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    throw new Error(result.stderr || `git ${args.join(' ')} failed`)
  }

  return result.stdout.trimEnd()
}

export function parseLogLines(output: string): UpstreamCommitRef[] {
  return output
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [sha, subject, authoredAt] = line.split('	')
      return {
        sha,
        shortSha: sha.slice(0, 7),
        subject,
        authoredAt,
      }
    })
}

export function parseChangedFiles(output: string): string[] {
  return output
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
}

export function fetchUpstream(cwd = process.cwd()): void {
  runGit(['fetch', 'upstream', '--tags'], cwd)
}

export function listUnprocessedUpstreamCommits(input: {
  cwd?: string
  sinceSha?: string | null
  limit?: number
}): UpstreamCommitRef[] {
  const cwd = input.cwd ?? process.cwd()
  const range = input.sinceSha ? `${input.sinceSha}..upstream/main` : 'upstream/main'
  const limitArgs = input.limit ? ['-n', String(input.limit)] : []
  const output = runGit(
    ['log', '--reverse', '--format=%H%x09%s%x09%cI', ...limitArgs, range],
    cwd,
  )
  return parseLogLines(output)
}

export function getCommitFiles(sha: string, cwd = process.cwd()): string[] {
  const output = runGit(['diff-tree', '--no-commit-id', '--name-only', '-r', sha], cwd)
  return parseChangedFiles(output)
}
