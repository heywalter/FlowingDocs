import { courses } from './course'
import type { Locale, Syntax } from './course'
import { spanSource } from './tableSpans'
import { syntaxReference } from './syntaxData'
import { reuseExamples } from './reuseData'
import { ditaProject } from './dita'

export interface ReadingExample {
  title: string
  language: string
  paragraphs: string[]
  code: string
}
export interface ReadingSection {
  id: string
  title: string
  paragraphs: string[]
  examples: ReadingExample[]
  links: { label: string, url: string }[]
}

export function referenceIntro(locale: Locale) {
  return locale === 'zh'
    ? ['以下参考答案与互动练习使用同一份示例数据。可以直接阅读、复制，也可以下载 Markdown 版。', 'MySQL 片段用于比较文档写法，不是完整的生产运维流程。内容复用示例使用虚构产品；正式使用前应在所选工具链中验证。']
    : ['These reference answers share the data used by the interactive exercises. Read or copy them here, or download the Markdown version.', 'The MySQL fragments illustrate document structures, not complete production procedures. Reuse examples use a fictional product; validate them in your chosen toolchain.']
}

export function referenceSections(locale: Locale): ReadingSection[] {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en
  const sections: ReadingSection[] = []
  const formats: Syntax[] = ['markdown', 'asciidoc']
  for (const task of courses[locale]) {
    sections.push({
      id: task.id, title: task.label, paragraphs: [task.goal],
      examples: formats.map(format => ({
        title: format === 'markdown' ? 'Markdown' : 'AsciiDoc', language: format,
        paragraphs: [task.hint[format], syntaxReference(locale, format, task.id)?.pitfall ?? ''],
        code: task.answer[format],
      })),
      links: formats.map(format => ({ label: format === 'markdown' ? 'Markdown' : 'AsciiDoc', url: syntaxReference(locale, format, task.id)!.source })),
    })
    if (task.id === 'table') sections.push({
      id: 'table-spans', title: t('合并单元格', 'Merged cells'),
      paragraphs: [t('Markdown 的管道表格没有原生合并能力。这里使用 HTML 的 rowspan 和 colspan，需要发布平台允许内嵌 HTML。AsciiDoc 原生支持跨行和跨列。', 'Markdown pipe tables have no native cell spans. This example uses HTML rowspan and colspan, which the publishing platform must allow. AsciiDoc supports row and column spans natively.')],
      examples: formats.map(format => ({ title: format === 'markdown' ? 'Markdown + HTML' : 'AsciiDoc', language: format, paragraphs: [syntaxReference(locale, format, 'table-spans')!.pitfall], code: spanSource(locale, format) })),
      links: [{ label: 'AsciiDoc', url: 'https://docs.asciidoctor.org/asciidoc/latest/tables/span-cells/' }],
    })
  }
  for (const format of [...formats, 'dita'] as const) {
    const example = reuseExamples(locale, format)
    sections.push({
      id: 'reuse-' + format, title: example.title,
      paragraphs: [example.description, example.after].filter(Boolean),
      examples: example.files.map(file => ({ title: file.name, language: file.language, code: file.code, paragraphs: [] })),
      links: example.links,
    })
  }
  const project = ditaProject(locale)
  sections.push({
    id: 'dita-project', title: t('DITA：主题与 map', 'DITA: topics and maps'),
    paragraphs: [t('concept 解释概念，task 组织步骤，reference 提供查阅信息。两份 map 引用同一份主题文件，修改主题后重新发布，各手册就能使用更新后的内容。', 'A concept explains an idea, a task gives steps, and a reference provides lookup information. Both maps reference the same topic files; rebuild the guides to include changes to those topics.')],
    examples: Object.entries(project.files).map(([name, code]) => ({ title: name, language: 'xml', paragraphs: [], code })),
    links: [{ label: 'OASIS DITA 1.3', url: 'https://docs.oasis-open.org/dita/dita/v1.3/os/part0-overview/dita-v1.3-os-part0-overview.html' }],
  })
  const oxygen = syntaxReference(locale, 'dita', 'oxygen')!
  sections.push({
    id: 'oxygen', title: t('在 Oxygen 中继续', 'Continue in Oxygen'),
    paragraphs: [t('下载互动练习中的 DITA 项目，解压后在 Oxygen 的 DITA Maps Manager 中打开 guide.ditamap；在 Author 视图中编辑主题，校验后通过转换场景发布。', 'Download and extract the DITA project from the interactive exercises. Open guide.ditamap in Oxygen’s DITA Maps Manager, edit topics in Author mode, validate, then publish with a transformation scenario.'), oxygen.pitfall],
    examples: [], links: [{ label: 'Oxygen DITA Maps Manager', url: 'https://www.oxygenxml.com/doc/versions/27.1/ug-editor/topics/dita-maps-manager.html' }],
  })
  return sections
}

export function referenceMarkdown(locale: Locale) {
  // UI explanations are plain text. Escape them so example link notation does
  // not become a real link or image in the Markdown reference.
  const prose = (text: string) => text.replace(/([\\`*_{}\[\]()<>#+.!|~-])/g, '\\$1')
  const fence = (example: ReadingExample) => {
    const length = Math.max(3, ...[...example.code.matchAll(/`+/g)].map(match => match[0].length + 1))
    const marker = '`'.repeat(length)
    return `${marker}${example.language}\n${example.code}\n${marker}`
  }
  return [
    ...referenceIntro(locale).map(prose),
    ...referenceSections(locale).flatMap(section => [
      '## ' + prose(section.title), ...section.paragraphs.map(prose),
      ...section.examples.flatMap(example => ['### ' + prose(example.title), ...example.paragraphs.map(prose), fence(example)]),
      ...section.links.map(link => `[${link.label}](${link.url})`),
    ]),
  ].join('\n\n')
}
