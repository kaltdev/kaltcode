import { readdirSync, readFileSync, statSync } from 'fs'
import { extname, join, relative, sep } from 'path'
import { expect, test } from 'bun:test'
import ts from 'typescript'

const REPO_ROOT = join(import.meta.dir, '..')
const SOURCE_ROOTS = ['src', 'scripts']
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx'])
const KALT_CODE_TOKEN_PATTERN = /\bkalt\s*-\s*code[A-Z]/
const IGNORED_DIRS = new Set([
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
])

function toRepoPath(path: string): string {
  return path.split(sep).join('/')
}

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue

    const absolutePath = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walk(absolutePath)
    } else if (
      entry.isFile() &&
      SOURCE_EXTENSIONS.has(extname(entry.name))
    ) {
      yield absolutePath
    }
  }
}

function isKaltCodeSubtraction(node: ts.BinaryExpression): boolean {
  if (node.operatorToken.kind !== ts.SyntaxKind.MinusToken) return false
  if (!ts.isIdentifier(node.right)) return false
  if (!/^code[A-Z]/.test(node.right.text)) return false

  if (ts.isIdentifier(node.left)) {
    return node.left.text === 'kalt'
  }

  if (ts.isPropertyAccessExpression(node.left)) {
    return node.left.name.text === 'kalt'
  }

  return false
}

test('branding replacement does not create invalid kalt-code identifier expressions', () => {
  const findings: string[] = []

  for (const sourceRoot of SOURCE_ROOTS) {
    const absoluteSourceRoot = join(REPO_ROOT, sourceRoot)
    if (!statSync(absoluteSourceRoot, { throwIfNoEntry: false })?.isDirectory()) {
      continue
    }

    for (const file of walk(absoluteSourceRoot)) {
      const repoPath = toRepoPath(relative(REPO_ROOT, file))
      const sourceText = readFileSync(file, 'utf8')
      if (!KALT_CODE_TOKEN_PATTERN.test(sourceText)) continue

      const sourceFile = ts.createSourceFile(
        repoPath,
        sourceText,
        ts.ScriptTarget.Latest,
        false,
        extname(file) === '.tsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
      )

      function visit(node: ts.Node): void {
        if (ts.isBinaryExpression(node) && isKaltCodeSubtraction(node)) {
          const { line, character } =
            sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
          findings.push(
            `${repoPath}:${line + 1}:${character + 1} ${node.getText(sourceFile)}`,
          )
        }

        ts.forEachChild(node, visit)
      }

      visit(sourceFile)
    }
  }

  expect(findings).toEqual([])
})
