import { spawnSync } from 'node:child_process'

import type { ClassifiedCommit, VerificationResult } from './types.js'

export function verificationPlanForCommit(commit: ClassifiedCommit): string[] {
  if (commit.risk === 'high' || commit.category === 'provider' || commit.category === 'release') {
    return ['bun run build', 'bun run typecheck', 'bun run smoke', 'bun test']
  }

  if (commit.category === 'docs' || commit.category === 'tests') {
    return ['bun run build', 'bun run smoke']
  }

  return ['bun run build', 'bun run typecheck', 'bun run smoke']
}

export function runVerificationCommands(commands: string[], cwd = process.cwd()): VerificationResult[] {
  return commands.map(command => {
    const result = spawnSync(command, {
      cwd,
      encoding: 'utf8',
      shell: true,
    })

    return {
      command,
      ok: result.status === 0,
      exitCode: result.status ?? 1,
      stdout: result.stdout ?? '',
      stderr: result.stderr ?? '',
    }
  })
}

export function didVerificationPass(results: VerificationResult[]): boolean {
  return results.every(result => result.ok)
}
