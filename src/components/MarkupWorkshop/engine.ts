import { fromMarkdown } from 'mdast-util-from-markdown'
import { gfm } from 'micromark-extension-gfm'
import { gfmFromMarkdown } from 'mdast-util-gfm'
import { toHast } from 'mdast-util-to-hast'
import { toHtml } from 'hast-util-to-html'
import { parseFragment } from 'parse5'
import { courses, panelImage } from './course'
import { spanExamples } from './tableSpans'
import type { Locale, Syntax, Task } from './course'

export function slug(text: string) {
  return text.trim().toLowerCase().replace(/[^\p{L}\p{N}_-]+/gu, '-').replace(/^-|-$/g, '') || 'section'
}
function nodeText(node: any): string {
  return node.value ?? node.children?.map(nodeText).join('') ?? ''
}
// Load the browser-compatible processor only when AsciiDoc is selected.
let asciidoctor: Promise<ReturnType<typeof import('@asciidoctor/core').default>> | undefined
export async function compileDocument(source: string, syntax: Syntax): Promise<string> {
  if (syntax === 'asciidoc') {
    asciidoctor ??= import('@asciidoctor/core').then(({ default: factory }) => factory())
    return String((await asciidoctor).convert(source, {
      safe: 'secure', standalone: false,
      attributes: { 'showtitle': true, 'source-highlighter': '', 'allow-uri-read': false },
    }))
  }
  const counts = new Map<string, number>()
  const tree = fromMarkdown(source, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] })
  const hast = toHast(tree, {
    handlers: {
      html(_state, node) {
        return tableMarkup(node.value)
      },
      heading(state, node) {
        const base = slug(nodeText(node))
        const count = counts.get(base) ?? 0
        counts.set(base, count + 1)
        return { type: 'element', tagName: 'h' + node.depth, properties: { id: base + (count ? '-' + count : '') }, children: state.all(node) }
      },
    },
  })
  return toHtml(hast)
}
// Markdown HTML is restricted to table markup before it reaches the preview sanitizer.
// Drop unsupported subtrees and all attributes except bounded span values.
function tableMarkup(value: string): any[] {
  const allowed = new Set(['table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'p', 'br', 'strong', 'b', 'em', 'i', 'code'])
  function convert(node: any): any {
    if (node.nodeName === '#text') return { type: 'text', value: node.value }
    if (!allowed.has(node.tagName)) return null
    const properties: Record<string, number> = {}
    if (['td', 'th'].includes(node.tagName)) {
      for (const a of node.attrs ?? []) {
        if (['rowspan', 'colspan'].includes(a.name) && /^\d+$/.test(a.value) && Number(a.value) >= 1 && Number(a.value) <= 100) properties[a.name === 'rowspan' ? 'rowSpan' : 'colSpan'] = Number(a.value)
      }
    }
    return { type: 'element', tagName: node.tagName, properties, children: (node.childNodes ?? []).map(convert).filter(Boolean) }
  }
  return parseFragment(value).childNodes.filter((node: any) => node.tagName === 'table').map(convert)
}
type Node = { tagName?: string, attrs?: { name: string, value: string }[], childNodes?: Node[], value?: string, parentNode?: Node }
function attr(n: Node, key: string) {
  return n.attrs?.find(a => a.name === key)?.value
}
function text(n: Node): string {
  return n.value ?? n.childNodes?.map(text).join('') ?? ''
}
function flat(n: Node): Node[] {
  if (['script', 'style', 'template', 'iframe'].includes(n.tagName || '')) return []
  return [...(n.tagName ? [n] : []), ...(n.childNodes?.flatMap(flat) ?? [])]
}
function children(n: Node, tag: string) {
  return n.childNodes?.filter(c => c.tagName === tag) ?? []
}
export type Check = { ok: boolean, message: string }
export function checkTask(html: string, task: Task, locale: Locale, syntax: Syntax): Check[] {
  const all = flat(parseFragment(html) as Node)
  const start = all.findIndex(n => n.tagName === 'h2' && text(n).trim() === task.heading)
  const next = all.findIndex((n, i) => i > start && (n.tagName === 'h1' || n.tagName === 'h2'))
  const scope = start < 0 ? [] : all.slice(start + 1, next < 0 ? undefined : next)
  const find = (tag: string) => scope.filter(n => n.tagName === tag)
  const says = (zh: string, en: string) => locale === 'zh' ? zh : en
  const result = (ok: boolean, zh: string, en: string) => ({ ok, message: says(zh, en) })
  const section = result(start >= 0, '保留“' + task.heading + '”小节标题，方便定位。', 'Keep the section heading “' + task.heading + '” so we can locate it.')
  let checks: Check[] = []
  switch (task.id) {
    case 'headings':
      checks = [result(all.filter(n => n.tagName === 'h1' && text(n).trim()).length === 1, '整份文档有一个非空的文档标题。', 'The document has one nonempty title.'),
        result(find('p').some(n => text(n).trim().length > 10), '小节标题后有介绍正文。', 'The section contains an introductory paragraph.')]
      break
    case 'bullets':
      checks = [result(find('ul').some(n => children(n, 'li').length === 3), '三项准备内容在一个无序列表中。', 'The three preparation items form an unordered list.')]
      break
    case 'ordered':
      checks = [result(find('ol').some(n => children(n, 'li').length === 3 && (!attr(n, 'start') || attr(n, 'start') === '1')), '一个从 1 开始的有序列表，包含三步。', 'An ordered list starts at 1 and contains three steps.')]
      break
    case 'emphasis':
      checks = [result(find('strong').some(n => /systemctl|mysqld/i.test(text(n))), '服务命令名称使用加粗。', 'The service command is bold.'),
        result(find('em').some(n => /中断|连接|会话|disconnect|session/i.test(text(n))), '停止服务的提醒使用斜体。', 'The shutdown reminder is italic.')]
      break
    case 'nested':
      checks = [result(find('ul').some(n => children(n, 'li').length === 2 && children(n, 'li').every(item => flat(item).some(c => c.tagName === 'ul'))), '两组实例规划各有一个子列表。', 'Both planning groups have a nested list.')]
      break
    case 'media':
      checks = [result(find('img').some(n => attr(n, 'src') === panelImage && (attr(n, 'alt')?.length ?? 0) > 5), '架构图使用课程路径，并有说明性的替代文字。', 'The architecture image uses the supplied path and descriptive alt text.'),
        result(find('a').some(n => attr(n, 'href') === panelImage && text(n).trim().length > 1), '有一个带文字的架构大图链接。', 'A text link points to the full-size architecture diagram.')]
      break
    case 'table':
      checks = [result(find('table').some(n => flat(n).filter(c => c.tagName === 'th').length === 3 && flat(n).filter(c => c.tagName === 'tr').length === 3), '表格有三列表头和两行引擎数据。', 'The table has three headers and two engine rows.')]
      break
    case 'literal':
      checks = [result(find('code').some(n => text(n).trim() === '1045' && n.parentNode?.tagName !== 'pre'), '1045 使用行内等宽文字。', '1045 is inline code.'),
        result(find('pre').some(n => text(n).trim().split('\n').length >= 2), '两行连接状态放在同一个原样文本块中。', 'The two status lines share a literal block.')]
      break
    case 'xref':
      checks = [result(find('a').some((n) => {
        const href = attr(n, 'href') || ''
        if (!href.startsWith('#') || href.length < 2) return false
        try {
          return all.some(target => attr(target, 'id') === decodeURIComponent(href.slice(1)))
        }
        catch { return false }
      }), '页内链接指向文档中实际存在的锚点。', 'The section link resolves to an anchor in this document.')]
      break
    case 'note': {
      const note = syntax === 'markdown' ? find('blockquote')[0] : scope.find(n => attr(n, 'class')?.split(' ').includes('admonitionblock'))
      const backupCmd = find('p').find(n => /mysqldump/.test(text(n)))
      checks = [result(!!note && /备份|back\s*up/i.test(text(note)), '备份提醒放在独立的提示区域。', 'The backup reminder is set apart.'),
        result(!!note && !!backupCmd && scope.indexOf(note) < scope.indexOf(backupCmd), '提醒在导出动作之前。', 'The reminder comes before the export instruction.')]
      break
    }
    case 'checklist': {
      const boxes = find('input').filter(n => attr(n, 'type') === 'checkbox')
      // Asciidoctor may render static checkbox glyphs rather than inputs.
      const content = scope.map(n => n.tagName === 'li' ? text(n) : '').join(' ')
      checks = [result((boxes.some(n => attr(n, 'checked') !== undefined) && boxes.some(n => attr(n, 'checked') === undefined))
        || (/[✓✔☑]/.test(content) && /[❏☐□]/.test(content)), '任务清单包含已完成和未完成两种状态。', 'The list contains checked and unchecked items.')]
      break
    }
    case 'escape':
      checks = [result(find('p').some(n => /\*\.\*/.test(text(n))) && !find('em').length && !find('strong').length,
        '两个星号都按普通文字显示。', 'Both asterisks appear as literal text.')]
      break
  }
  return [section, ...checks]
}
export function checkAll(html: string, locale: Locale, syntax: Syntax) {
  return Object.fromEntries(courses[locale].map(t => [t.id, checkTask(html, t, locale, syntax)]))
}

export function checkTableSpans(html: string, locale: Locale): Check[] {
  const e = spanExamples[locale]
  const all = flat(parseFragment(html) as Node)
  const start = all.findIndex(n => n.tagName === 'h2' && text(n).trim() === e.heading)
  const end = all.findIndex((n, i) => i > start && (n.tagName === 'h1' || n.tagName === 'h2'))
  const section = start < 0 ? [] : all.slice(start + 1, end < 0 ? undefined : end)
  const table = section.find(n => n.tagName === 'table')
  const nodes = table ? flat(table) : []
  const rows = nodes.filter(n => n.tagName === 'tr')
  const first = rows[1] ? children(rows[1], 'td') : []
  const second = rows[2] ? children(rows[2], 'td') : []
  const last = rows[3] ? children(rows[3], 'td') : []
  const result = (ok: boolean, zh: string, en: string) => ({ ok, message: locale === 'zh' ? zh : en })
  return [
    result(rows.length === 4 && nodes.filter(n => n.tagName === 'th').length === 3,
      '保留三列表头、两行备份方式和一行通用规范。',
      'Keep three column headers, two backup rows, and one policy row.'),
    result(first.length === 3 && second.length === 2
      && !!first[0] && attr(first[0], 'rowspan') === '2' && text(first[0]).trim() === e.category
      && !!second[0] && text(second[0]).trim() === e.quick,
    '“物理备份”跨两行，第二行不再重复类别。',
    '“Physical backup” spans two rows; the next row omits the category.'),
    result(last.length === 2 && !!last[1] && attr(last[1], 'colspan') === '2' && text(last[1]).trim() === e.note,
      '通用规范的内容跨两列，没有多余的空单元格。',
      'The policy reminder spans two columns, with no extra empty cell.'),
  ]
}

export function documentHeadings(html: string) {
  return flat(parseFragment(html) as Node).filter(n => n.tagName === 'h2' && attr(n, 'id')).map(n => ({ id: attr(n, 'id')!, title: text(n) }))
}
