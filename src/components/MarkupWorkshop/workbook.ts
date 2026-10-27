import { courses, documentSource } from './course'
import type { Locale, Syntax } from './course'
import { restoreSession } from './state'
import { spanExamples, spanSource } from './tableSpans'
import { ditaProject } from './dita'

export type Format = Syntax | 'dita'
export type Part = { id: string, source: string, after: string }
export type Book = { parts: Part[], checked: string[], step: string, lastStep?: string }
export type Workbook = { format: Format, books: Record<Syntax, Book>, dita: { files: Record<string, string>, step: string, lastStep?: string, receipts?: Record<string, string> } }
export const ditaSteps = ['intro', 'concept', 'task', 'reference', 'map', 'reuse', 'oxygen']

// Assign stable exercise IDs once, preserving every byte of an older full-file draft.
export function splitDocument(source: string, locale: Locale): Part[] {
  const titles = [...courses[locale].map(t => ({ id: t.id, heading: t.heading })), { id: 'table-spans', heading: spanExamples[locale].heading }]
  const lines = source.split('\n')
  const marks: { id: string, start: number }[] = []
  let offset = 0
  let fence = ''
  const seen = new Set<string>()
  lines.forEach((line, i) => {
    const marker = line.match(/^\s*(`{3,}|~{3,}|-{4,}|\.{4,})/)
    if (marker) fence = !fence ? marker[1]![0]! : marker[1]![0] === fence ? '' : fence
    else if (!fence) {
      const title = line.replace(/^(?:##|==)\s+/, '').trim()
      const task = titles.find(t => t.heading === title)
      if (task && !seen.has(task.id)) {
        seen.add(task.id)
        const anchor = i > 0 && /^\[\[.+\]\]\s*$/.test(lines[i - 1]!)
        marks.push({ id: task.id, start: task.id === 'headings' && !marks.length ? 0 : anchor ? offset - lines[i - 1]!.length - 1 : offset })
      }
    }
    offset += line.length + 1
  })
  if (!marks.length) return [{ id: 'legacy', source, after: '' }]
  if (marks[0]!.start > 0) marks.unshift({ id: 'legacy', start: 0 })
  return marks.map((mark, i) => {
    const text = source.slice(mark.start, marks[i + 1]?.start ?? source.length)
    const after = text.match(/(?:\r?\n[\t ]*)+$/)?.[0] ?? ''
    return { id: mark.id, source: after ? text.slice(0, -after.length) : text, after }
  })
}
export function assemble(book: Book) {
  return book.parts.map(p => p.source + p.after).join('')
}
export function editPart(book: Book, id: string, source: string): Book {
  const exists = book.parts.some(p => p.id === id)
  const parts = exists
    ? book.parts.map(p => p.id === id ? { ...p, source } : p)
    : [
        ...book.parts.map((p, i) => i === book.parts.length - 1 && !p.after.endsWith('\n\n') ? { ...p, after: p.after + '\n\n' } : p),
        { id, source, after: '' },
      ]
  return { ...book, parts, checked: book.checked.filter(item => item !== id) }
}
export function newBook(locale: Locale, syntax: Syntax): Book {
  return { parts: splitDocument(documentSource(locale, syntax) + '\n\n' + spanSource(locale, syntax, false), locale), checked: [], step: 'intro' }
}
export function freshWorkbook(locale: Locale): Workbook {
  return { format: 'markdown', books: { markdown: newBook(locale, 'markdown'), asciidoc: newBook(locale, 'asciidoc') }, dita: { files: ditaProject(locale).files, step: 'concept' } }
}
export function restoreWorkbook(raw: string | null, old: string | null, locale: Locale): Workbook {
  const result = freshWorkbook(locale)
  const ids = ['intro', ...courses[locale].map(t => t.id), 'table-spans']
  if (!raw && old) {
    const previous = restoreSession(old, locale)
    result.format = previous.syntax
    for (const syntax of ['markdown', 'asciidoc'] as const) {
      const draft = previous.drafts[syntax]
      result.books[syntax] = { parts: splitDocument(draft.source, locale), checked: draft.checked, step: courses[locale][draft.step]!.id }
    }
    return result
  }
  try {
    const value = JSON.parse(raw || 'null')
    if (!value) return result
    if (['markdown', 'asciidoc', 'dita'].includes(value.format)) result.format = value.format
    for (const syntax of ['markdown', 'asciidoc'] as const) {
      const book = value.books?.[syntax]
      if (!book || !Array.isArray(book.parts) || book.parts.length > 100) continue
      const parts = book.parts
      if (!parts.every((p: Part) => p && typeof p.id === 'string' && (ids.includes(p.id) || p.id === 'legacy') && typeof p.source === 'string' && typeof p.after === 'string' && /^\s*$/.test(p.after))) continue
      if (new Set(parts.map((p: Part) => p.id)).size !== parts.length || parts.reduce((n: number, p: Part) => n + p.source.length + p.after.length, 0) > 40000) continue
      result.books[syntax] = { parts, checked: Array.isArray(book.checked) ? book.checked.filter((id: string) => ids.includes(id)) : [], step: ids.includes(book.step) ? book.step : 'intro' }
    }
    for (const syntax of ['markdown', 'asciidoc'] as const) {
      const last = value.books?.[syntax]?.lastStep
      if (ids.includes(last) && last !== 'intro') result.books[syntax].lastStep = last
    }
    for (const name of Object.keys(result.dita.files)) {
      const source = value.dita?.files?.[name]
      if (typeof source === 'string' && source.length <= 12000) result.dita.files[name] = source
    }
    if (ditaSteps.includes(value.dita?.step)) result.dita.step = value.dita.step
    if (ditaSteps.includes(value.dita?.lastStep) && value.dita.lastStep !== 'intro') result.dita.lastStep = value.dita.lastStep
    if (value.dita?.receipts && typeof value.dita.receipts === 'object' && !Array.isArray(value.dita.receipts)) result.dita.receipts = Object.fromEntries(Object.entries(value.dita.receipts).filter(([id, receipt]) => ['concept', 'task', 'reference', 'map', 'reuse'].includes(id) && typeof receipt === 'string' && /^v1:[a-f0-9]{1,8}$/.test(receipt))) as Record<string, string>
  }
  catch { /* Keep recoverable defaults; the previous storage key is never overwritten. */ }
  return result
}
