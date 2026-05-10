import { FORBIDDEN_UPSTREAM_BRANDING } from './constants.js'

const REPLACEMENTS: Array<[RegExp, string]> = [
  [/OpenClaude/g, 'Kalt Code'],
  [/openclaude/g, 'kalt-code'],
  [/Gitlawb\/openclaude/g, 'kaltdev/kalt-code'],
]

const PROTECTED_FILE_PATTERNS = [
  /^package\.json$/,
  /^README\.md$/,
  /^bin\//,
  /^docs\//,
  /^\.github\//,
]

export function rewriteBrandingText(text: string): { text: string; changed: boolean } {
  let next = text
  for (const [pattern, replacement] of REPLACEMENTS) {
    next = next.replace(pattern, replacement)
  }

  return {
    text: next,
    changed: next !== text,
  }
}

export function isProtectedIdentityFile(path: string): boolean {
  return PROTECTED_FILE_PATTERNS.some(pattern => pattern.test(path))
}

export function findForbiddenBranding(input: { path: string; content: string }): string[] {
  if (!isProtectedIdentityFile(input.path)) {
    return []
  }

  return FORBIDDEN_UPSTREAM_BRANDING.filter(token => input.content.includes(token))
}
