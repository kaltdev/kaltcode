import { describe, expect, it } from 'bun:test'
import {
  formatCoAuthorTrailer,
  parseCoAuthor,
  stripMatchingQuotes,
  USAGE,
} from './commit-message.js'

describe('commit-message command helpers', () => {
  it('parses quoted co-author names with a plain email', () => {
    expect(parseCoAuthor('"GPT 5.5" noreply@kalt-code.dev')).toEqual({
      name: 'GPT 5.5',
      email: 'noreply@kalt-code.dev',
    })
  })

  it('parses co-author trailers with angle-bracket emails', () => {
    expect(parseCoAuthor('Kalt Code (gpt-5.5) <noreply@kalt-code.dev>')).toEqual(
      {
        name: 'Kalt Code (gpt-5.5)',
        email: 'noreply@kalt-code.dev',
      },
    )
  })

  it('rejects co-author trailers with empty sanitized names', () => {
    expect(parseCoAuthor('"  " noreply@kalt-code.dev')).toBeNull()
    expect(parseCoAuthor('"  " <noreply@kalt-code.dev>')).toBeNull()
  })

  it('strips one pair of matching quotes from custom attribution text', () => {
    expect(stripMatchingQuotes('"Generated with Kalt Code"')).toBe(
      'Generated with Kalt Code',
    )
    expect(stripMatchingQuotes("'Generated with Kalt Code'")).toBe(
      'Generated with Kalt Code',
    )
    expect(stripMatchingQuotes('"Generated with Kalt Code')).toBe(
      '"Generated with Kalt Code',
    )
  })

  it('formats a sanitized co-author trailer', () => {
    expect(
      formatCoAuthorTrailer('Kalt Code <gpt>\n', '<noreply@kalt-code.dev>'),
    ).toBe('Co-Authored-By: Kalt Code gpt <noreply@kalt-code.dev>')
  })

  it('makes set scope explicit with example text', () => {
    expect(USAGE).toContain(
      'Controls only the attribution text appended after /commit messages.',
    )
    expect(USAGE).toContain(
      '/commit-message set "Generated with Kalt Code using GPT-5.5"',
    )
    expect(USAGE).not.toContain('/commit-message set-attribution')
  })
})
