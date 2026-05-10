import { describe, expect, test } from 'bun:test'

import { findForbiddenBranding, isProtectedIdentityFile, rewriteBrandingText } from './branding.js'

describe('branding helpers', () => {
  test('rewrites openclaude branding in docs text', () => {
    const result = rewriteBrandingText('OpenClaude ships an openclaude binary from Gitlawb/openclaude')
    expect(result.changed).toBe(true)
    expect(result.text).toContain('Kalt Code')
    expect(result.text).toContain('kalt-code binary')
    expect(result.text).toContain('kaltdev/kalt-code')
  })

  test('does not flag unprotected files', () => {
    expect(findForbiddenBranding({ path: 'src/foo.ts', content: 'OpenClaude' })).toEqual([])
  })

  test('flags forbidden branding in protected files', () => {
    expect(findForbiddenBranding({ path: 'package.json', content: 'OpenClaude @openclaude' })).toEqual([
      'OpenClaude',
      '@openclaude',
    ])
  })

  test('recognizes protected identity files', () => {
    expect(isProtectedIdentityFile('README.md')).toBe(true)
    expect(isProtectedIdentityFile('docs/guide.md')).toBe(true)
    expect(isProtectedIdentityFile('src/index.ts')).toBe(false)
  })
})
