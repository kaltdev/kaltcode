import { readdir, readFile, stat } from 'node:fs/promises'
import { extname, join, relative, sep } from 'node:path'

const FORBIDDEN = [
  'OpenClaude',
  'openclaude',
  'OPENCLAUDE',
  'Open Claude',
  'open-claude',
  'open_claude',
]

const IGNORED_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  '.turbo',
])

const IGNORED_FILES = new Set(['CHANGELOG.md'])
const MAX_FILE_BYTES = 2 * 1024 * 1024
const TEXT_EXTENSIONS = new Set([
  '',
  '.cjs',
  '.css',
  '.env',
  '.html',
  '.js',
  '.json',
  '.jsx',
  '.lock',
  '.md',
  '.mjs',
  '.mts',
  '.sh',
  '.svg',
  '.toml',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
])

const ALLOWED = [
  {
    file: /^src\/upstreamSync\//,
    line: /OpenClaude|openclaude|OPENCLAUDE|Gitlawb\/openclaude|@openclaude/,
  },
  {
    file: /^docs\/plans\/2026-04-11-upstream-sync-automation-implementation-plan\.md$/,
    line: /OpenClaude|openclaude|OPENCLAUDE|Gitlawb\/openclaude|@openclaude/,
  },
  {
    file: /^scripts\/upstream-sync-port\.ts$/,
    line: /Gitlawb\/openclaude/,
  },
  {
    file: /^(\.env\.example|docs\/advanced-setup\.md)$/,
    line: /Deprecated `?OPENCLAUDE_\*?|OPENCLAUDE_[A-Z0-9_]+/,
  },
  {
    file: /^web\/index\.html$/,
    line: /openclaude-theme/,
  },
  {
    file: /^vscode-extension\/kalt-code-vscode\/(README\.md|src\/state\.js)$/,
    line: /\.openclaude-profile\.json/,
  },
  {
    file: /^PLAYBOOK\.md$/,
    line: /\.openclaude-profile\.json/,
  },
  {
    file: /^\.gitignore$/,
    line: /\.openclaude/,
  },
  {
    file: /^src\/constants\/product\.ts$/,
    line: /DEPRECATED_OPENCLAUDE_CONFIG_DIR_NAME|\.openclaude/,
  },
  {
    file: /^src\/utils\/(env|envUtils|localInstaller|nativeInstaller\/installer|permissions\/filesystem|markdownConfigLoader)\.ts$/,
    line: /OpenClaude|openclaude|OPENCLAUDE|\.openclaude/,
  },
  {
    file: /^src\/utils\/(kaltcodePaths|kaltcodeInstallSurfaces|env)\.test\.ts$/,
    line: /OpenClaude|openclaude|OPENCLAUDE|\.openclaude/,
  },
  {
    file: /^src\/utils\/providerProfile\.ts$/,
    line: /DEPRECATED_PROFILE_FILE_NAME|\.openclaude-profile\.json|OPENCLAUDE_PROFILE_GOAL/,
  },
  {
    file: /^src\/utils\/(messages|knowledgeGraph|attribution)\.ts$/,
    line: /OPENCLAUDE_[A-Z0-9_]+/,
  },
  {
    file: /^src\/(cost-tracker|entrypoints\/cli|services\/api\/openaiShim)\.tsx?$/,
    line: /OPENCLAUDE_[A-Z0-9_]+/,
  },
  {
    file: /^src\/commands\/cacheStats\/cacheStats\.ts$/,
    line: /OPENCLAUDE_\*/,
  },
  {
    file: /^src\/ink\/components\/App\.tsx$/,
    line: /OPENCLAUDE_USE_(DATA|READABLE)_STDIN/,
  },
  {
    file: /^src\/utils\/secureStorage\/windowsCredentialStorage\.ts$/,
    line: /OPENCLAUDE_ENABLE_LEGACY_WINDOWS_PASSWORDVAULT/,
  },
  {
    file: /^src\/tools\/AgentTool\/loadAgentsDir\.test\.ts$/,
    line: /\.openclaude/,
  },
]

function toRepoPath(path) {
  return path.split(sep).join('/')
}

function isAllowed(file, line) {
  return ALLOWED.some(rule => rule.file.test(file) && rule.line.test(line))
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const absolutePath = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue
      yield* walk(absolutePath)
      continue
    }
    if (entry.isFile()) {
      yield absolutePath
    }
  }
}

const root = process.cwd()
const findings = []

for await (const absolutePath of walk(root)) {
  const file = toRepoPath(relative(root, absolutePath))
  if (IGNORED_FILES.has(file)) continue
  if (file === 'scripts/verify-kaltcode-branding.mjs') continue
  if (file.startsWith('docs/superpowers/')) continue
  if (!TEXT_EXTENSIONS.has(extname(file))) continue

  let content
  try {
    const fileStat = await stat(absolutePath)
    if (fileStat.size > MAX_FILE_BYTES) continue
    content = await readFile(absolutePath, 'utf8')
  } catch {
    continue
  }

  const lines = content.split(/\r?\n/)
  lines.forEach((line, index) => {
    for (const token of FORBIDDEN) {
      if (!line.includes(token)) continue
      if (isAllowed(file, line)) continue
      findings.push({
        file,
        lineNumber: index + 1,
        line: line.trim(),
        token,
      })
    }
  })
}

if (findings.length > 0) {
  console.error('Unexpected OpenClaude branding references found:')
  for (const finding of findings) {
    console.error(
      `${finding.file}:${finding.lineNumber} [${finding.token}] ${finding.line}`,
    )
  }
  process.exit(1)
}

console.log('Kalt Code branding verification passed.')
