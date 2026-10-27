import { courses, documentSource } from './course'
import type { Locale, Syntax } from './course'
export type Draft = { source: string, checked: string[], step: number }
export type Session = { syntax: Syntax, drafts: Record<Syntax, Draft> }
export function freshSession(locale: Locale): Session {
  const draft = (syntax: Syntax): Draft => ({ source: documentSource(locale, syntax), checked: [], step: 0 })
  return { syntax: 'markdown', drafts: { markdown: draft('markdown'), asciidoc: draft('asciidoc') } }
}
export function restoreSession(raw: string | null, locale: Locale): Session {
  const fallback = freshSession(locale)
  try {
    const value = JSON.parse(raw || 'null')
    if (!value || !value.drafts) return fallback
    for (const syntax of ['markdown', 'asciidoc'] as const) {
      const d = value.drafts[syntax]
      if (!d || typeof d.source !== 'string' || d.source.length > 40000) continue
      // Older drafts stored a separate position for each of the two pages.
      const oldStep = Number.isInteger(d.steps?.advanced) && d.steps.advanced > 0 && d.steps.advanced < 6
        ? d.steps.advanced + 6
        : Number.isInteger(d.steps?.basic) && d.steps.basic >= 0 && d.steps.basic < 6 ? d.steps.basic : 0
      const step = d.step === undefined ? oldStep : d.step
      fallback.drafts[syntax] = {
        source: d.source,
        checked: Array.isArray(d.checked) ? d.checked.filter((id: unknown) => typeof id === 'string') : [],
        step: Number.isInteger(step) && step >= 0 && step < courses[locale].length ? step : 0,
      }
    }
    fallback.syntax = value.syntax === 'asciidoc' ? 'asciidoc' : 'markdown'
  }
  catch { /* Corrupt storage must not prevent the course from opening. */ }
  return fallback
}
