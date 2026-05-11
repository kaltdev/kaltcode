import { join } from 'path'
import { KALTCODE_CONFIG_DIR_NAME } from '../../constants/product.js'
import type { WikiPaths } from './types.js'

export const KALTCODE_DIRNAME = KALTCODE_CONFIG_DIR_NAME
export const WIKI_DIRNAME = 'wiki'

export function getWikiPaths(cwd: string): WikiPaths {
  const root = join(cwd, KALTCODE_DIRNAME, WIKI_DIRNAME)

  return {
    root,
    pagesDir: join(root, 'pages'),
    sourcesDir: join(root, 'sources'),
    schemaFile: join(root, 'schema.md'),
    indexFile: join(root, 'index.md'),
    logFile: join(root, 'log.md'),
  }
}
