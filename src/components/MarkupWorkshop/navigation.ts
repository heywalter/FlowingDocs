import { courses } from './course'
import type { Locale } from './course'
import { ditaSteps } from './workbook'
import type { Format, Workbook } from './workbook'

export type Panel = 'lesson' | 'full' | 'resources' | 'reuse'
export function readRoute(url: URL, state: Workbook, locale: Locale) {
  const requested = url.searchParams.get('syntax')
  let format: Format = requested === 'markdown' || requested === 'asciidoc' || requested === 'dita' ? requested : state.format
  if (url.hash === '#dita') format = 'dita'
  let step = url.searchParams.get('exercise')
  if (url.searchParams.get('table') === 'spans' || url.hash === '#table-spans-title') {
    step = 'table-spans'
    if (!requested) format = 'asciidoc'
  }
  const referenceAnchor = url.hash === '#markup-reference' || url.hash.startsWith('#markup-reference-')
  const introAnchor = !referenceAnchor && url.hash.startsWith('#markup-') && !url.hash.startsWith('#markup-preview-')
  if (introAnchor) step = 'intro'
  const ids = format === 'dita' ? ditaSteps : ['intro', 'table-spans', ...courses[locale].map(t => t.id)]
  const panel: Panel = url.searchParams.get('view') === 'reuse' ? 'reuse' : url.searchParams.get('view') === 'full' ? 'full' : url.hash && !introAnchor && !referenceAnchor && !['#dita', '#table-spans-title'].includes(url.hash) ? 'resources' : 'lesson'
  // A general entry opens the introduction. Resuming a saved lesson is an explicit action.
  if (!step || !ids.includes(step)) step = panel === 'lesson' ? 'intro' : format === 'dita' ? state.dita.step : state.books[format].step
  return { format, step, panel }
}
export function navigateWorkbook(state: Workbook, format: Format, step: string): Workbook {
  if (format === 'dita') return { ...state, format, dita: { ...state.dita, step, ...(step !== 'intro' ? { lastStep: step } : {}) } }
  return { ...state, format, books: { ...state.books, [format]: { ...state.books[format], step, ...(step !== 'intro' ? { lastStep: step } : {}) } } }
}
