function slugifySubject(subject: string): string {
  const slug = subject
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)

  return slug || 'change'
}

export function buildSyncBranchName(input: { sha: string; subject: string }): string {
  const shortSha = input.sha.slice(0, 7)
  return `sync/upstream-${shortSha}-${slugifySubject(input.subject)}`
}
