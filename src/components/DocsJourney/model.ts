export type Locale = 'zh' | 'en'
export type PageId = 'start' | 'engines' | 'troubleshooting'
export type Draft = {
  title: string
  order: PageId[]
  color: string
  compact: boolean
}
export const palette = ['#6654d9', '#087f78', '#ad5817']
export function initialDraft(locale: Locale): Draft {
  return {
    title: locale === 'zh' ? 'MySQL 服务运维指南' : 'MySQL Operations Guide',
    order: ['start', 'engines', 'troubleshooting'],
    color: palette[0]!,
    compact: false,
  }
}
export function pageLabel(id: PageId, locale: Locale) {
  const labels = {
    start: ['实例初始化', 'Instance setup'],
    engines: ['存储引擎对照', 'Storage engines'],
    troubleshooting: ['故障排查与维护', 'Troubleshooting'],
  }
  return labels[id][locale === 'zh' ? 0 : 1]!
}
export const sameDraft = (a: Draft | null, b: Draft | null) => JSON.stringify(a) === JSON.stringify(b)
export const copyDraft = (draft: Draft): Draft => ({ ...draft, order: [...draft.order] })

// Text-safe version of a swatch colour: the swatch itself stays for fills, the tone is for text.
const TEXT_TONES: Record<string, string> = {
  '#6654d9': 'var(--tone-violet)',
  '#087f78': 'var(--tone-teal)',
  '#ad5817': 'var(--tone-amber)',
}
export const textTone = (color: string) => TEXT_TONES[color] ?? color
