import { assemble, restoreWorkbook } from './workbook'
import type { Locale } from './course'

export const workbookKey = (locale: Locale) => 'flowingdocs-markup-mysql-v1-' + locale

export function loadCourseWorkbook(read: (key: string) => string | null, locale: Locale) {
  return {
    workbook: restoreWorkbook(read(workbookKey(locale)), null, locale),
    previousDraft: read('flowingdocs-markup-v3-' + locale) || read('flowingdocs-markup-v2-' + locale),
  }
}

export function previousDraftFiles(raw: string, locale: Locale): Record<string, string> {
  const files: Record<string, string> = { 'original-workbook.json': raw }
  try {
    const original = JSON.parse(raw)
    for (const syntax of ['markdown', 'asciidoc'] as const) {
      const parts = original.books?.[syntax]?.parts
      const source = Array.isArray(parts) && parts.every(p => typeof p?.source === 'string' && typeof p?.after === 'string')
        ? assemble({ parts, checked: [], step: 'intro' })
        : original.drafts?.[syntax]?.source
      if (typeof source === 'string') files['previous-draft.' + (syntax === 'markdown' ? 'md' : 'adoc')] = source
    }
    for (const [name, source] of Object.entries(original.dita?.files || {})) {
      if (/^[a-z0-9-]+\.(dita|ditamap)$/.test(name) && typeof source === 'string') files[name] = source
    }
  }
  catch { /* Even an unreadable draft can still be recovered from the original JSON. */ }
  return files
}
