import { type GlobalConfig, saveGlobalConfig } from '../utils/config.js'

type LegacyKaltCodeConfig = GlobalConfig & {
  claudeCodeFirstTokenDate?: string
  claudeCodeHints?: {
    plugin?: string[]
    disabled?: boolean
  }
}

export function migrateLegacyKaltCodeConfigKeys(): void {
  saveGlobalConfig(current => {
    const legacy = current as LegacyKaltCodeConfig
    let changed = false
    let next = current

    if (
      next.kaltCodeFirstTokenDate === undefined &&
      legacy.claudeCodeFirstTokenDate !== undefined
    ) {
      next = {
        ...next,
        kaltCodeFirstTokenDate: legacy.claudeCodeFirstTokenDate,
      }
      changed = true
    }

    if (next.kaltCodeHints === undefined && legacy.claudeCodeHints !== undefined) {
      next = {
        ...next,
        kaltCodeHints: legacy.claudeCodeHints,
      }
      changed = true
    }

    return changed ? next : current
  })
}
