import type { Locale } from './course'
import type { Format } from './workbook'

function xmlText(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export interface Preset {
  id: string
  labelZh: string
  labelEn: string
  productNameZh: string
  productNameEn: string
  port: string
  badgeZh: string
  badgeEn: string
  warningZh: string
  warningEn: string
}

export const PRESETS: Preset[] = [
  {
    id: 'titan',
    labelZh: '研发内测',
    labelEn: 'Internal test',
    productNameZh: 'Project Titan (代号泰坦)',
    productNameEn: 'Project Titan',
    port: '2881',
    badgeZh: '内测代号阶段',
    badgeEn: 'Alpha Internal',
    warningZh: '变更前记录当前配置，并与参与测试的同事确认测试时间。',
    warningEn: 'Record the current configuration and agree on a test window with the other testers.',
  },
  {
    id: 'polaris',
    labelZh: '公开发布',
    labelEn: 'Public release',
    productNameZh: 'PolarisDB 分布式数据库',
    productNameEn: 'PolarisDB Distributed Database',
    port: '5432',
    badgeZh: '公开发布示例',
    badgeEn: 'Release example',
    warningZh: '变更前确认适用版本、验证方法和恢复方案。具体要求以相应操作说明为准。',
    warningEn: 'Before making a change, confirm the applicable version, verification steps, and recovery procedure. Refer to the instructions for that operation.',
  },
  {
    id: 'fin',
    labelZh: '培训环境',
    labelEn: 'Training environment',
    productNameZh: 'PolarisDB 培训版',
    productNameEn: 'PolarisDB Training Edition',
    port: '6432',
    badgeZh: '培训示例',
    badgeEn: 'Training example',
    warningZh: '本示例使用培训数据。练习结束后，按课程说明恢复初始配置。',
    warningEn: 'This example uses training data. Restore the initial configuration after the exercise.',
  },
]

export function reuseExamples(locale: Locale, format: Format, values: { productName?: string, clusterPort?: string, sharedWarning?: string, separateStaging?: boolean } = {}) {
  const trs = (zh: string, en: string) => locale === 'zh' ? zh : en
  const preset = PRESETS[1]!
  const productName = values.productName ?? trs(preset.productNameZh, preset.productNameEn)
  const clusterPort = values.clusterPort ?? preset.port
  const sharedWarning = values.sharedWarning ?? trs(preset.warningZh, preset.warningEn)
  const separateStaging = values.separateStaging ?? false
  const stagingWaiver = trs('本手册适用于演练环境。使用测试数据，结束后恢复初始配置。', 'This guide covers a practice environment. Use test data and restore the initial configuration afterwards.')
  if (format === 'asciidoc') return {
    title: trs('AsciiDoc：属性、包含文件和条件', 'AsciiDoc: Attributes, includes, and conditions'),
    description: trs('下面四个文件放在同一个项目中。两份手册读取共享属性；手册 B 用条件选择自己的提醒。', 'Place these four files in one project. Both guides read the shared attributes; Manual B uses a condition to choose its own notice.'),
    after: '',
    files: [
      { language: 'asciidoc', name: 'shared-attributes.adoc', code: `:product-name: ${productName}\n:cluster-port: ${clusterPort}` },
      { language: 'asciidoc', name: 'snippets/dr-safety-notice.adoc', code: `[NOTE]\n====\n${sharedWarning}\n====` },
      { language: 'asciidoc', name: 'guide-production.adoc', code: `= {product-name} ${trs('运维说明', 'Operations')}\ninclude::shared-attributes.adoc[]\n\n${trs('服务端口：', 'Service port: ')}{cluster-port}\n\ninclude::snippets/dr-safety-notice.adoc[]` },
      { language: 'asciidoc', name: 'guide-staging.adoc', code: `= {product-name} ${trs('演练说明', 'Practice')}\ninclude::shared-attributes.adoc[]\n${separateStaging ? ':env-staging:\n' : ''}\nifdef::env-staging[]\n[NOTE]\n====\n${stagingWaiver}\n====\nendif::[]\nifndef::env-staging[]\ninclude::snippets/dr-safety-notice.adoc[]\nendif::[]` },
    ],
    links: [{ url: 'https://docs.asciidoctor.org/asciidoc/latest/directives/include/', label: trs('AsciiDoc 文件包含说明', 'AsciiDoc include reference') }],
  }
  if (format === 'markdown') return {
    title: trs('Markdown：复用方式取决于工具', 'Markdown: Reuse depends on the tool'),
    description: trs('Markdown 本身没有变量和文件包含。下面是 Docusaurus 的 MDX 示例，需要 MDX 和 JavaScript 环境；普通 Markdown 编辑器不能直接执行。', 'Markdown itself has no variables or file inclusion. This Docusaurus example requires MDX and JavaScript; a plain Markdown editor cannot execute it.'),
    after: trs('手册 B 可以导入相同片段，也可以直接写自己的提醒。VitePress 则有另一套文件包含写法，不能与这里的 MDX 代码混用。', 'Manual B can import the same fragment or use its own notice. VitePress has a different inclusion syntax; it is not interchangeable with this MDX example.'),
    files: [
      { language: 'javascript', name: 'shared.js', code: `export const productName = ${JSON.stringify(productName)};\nexport const clusterPort = ${JSON.stringify(clusterPort)};` },
      { language: 'markdown', name: 'snippets/SafetyNotice.mdx', code: `> **${trs('提醒', 'Note')}**\n>\n> ${sharedWarning.replaceAll('\n', '\n> ')}` },
      { language: 'markdown', name: 'guide-production.mdx', code: `---\ntitle: ${trs('运维说明', 'Operations')}\n---\n\nimport SafetyNotice from './snippets/SafetyNotice.mdx';\nimport { productName, clusterPort } from './shared.js';\n\n# {productName}\n\n${trs('服务端口：', 'Service port: ')}{clusterPort}\n\n<SafetyNotice />` },
    ],
    links: [{ url: 'https://docusaurus.io/docs/3.9.2/markdown-features/react', label: trs('Docusaurus MDX 说明', 'Docusaurus MDX reference') }, { url: 'https://vitepress.dev/guide/markdown#markdown-file-inclusion', label: trs('VitePress 文件包含说明', 'VitePress file inclusion') }],
  }
  if (format === 'dita') return {
    title: trs('DITA：键引用与内容引用', 'DITA: Key and content references'),
    description: trs('键定义放在 map 中，正文通过 keyref 引用产品名；note 通过 conref 引用另一份文件中的提醒。下面是结构片段，需放入完整项目并用 DITA 工具校验。', 'Define keys in a map and reference the product name with keyref. A note uses conref to reuse a notice from another file. These structural fragments need a complete project and validation with DITA tools.'),
    after: trs('若某份手册需要独立提醒，可以引用另一片段；更复杂的条件发布需要配置过滤属性和 DITAVAL。本页不会执行这些处理。', 'A guide that needs its own notice can reference a different fragment. More complex conditional publishing requires filtering attributes and DITAVAL. This page does not run those processes.'),
    files: [
      { language: 'xml', name: 'root.ditamap', code: `<map>\n  <title>${trs('示例手册', 'Example guide')}</title>\n  <keydef keys="product_name">\n    <topicmeta><keywords><keyword>${xmlText(productName)}</keyword></keywords></topicmeta>\n  </keydef>\n  <topicref href="guide-production.dita"/>\n</map>` },
      { language: 'xml', name: 'shared-topics.dita', code: `<topic id="safety-defs">\n  <title>${trs('共享提醒', 'Shared notice')}</title>\n  <body>\n    <note id="dr-warning">${xmlText(sharedWarning)}</note>\n  </body>\n</topic>` },
      { language: 'xml', name: 'guide-production.dita', code: `<concept id="prod-guide">\n  <title>${trs('运维说明', 'Operations')}</title>\n  <conbody>\n    <p>${trs('产品：', 'Product: ')}<ph keyref="product_name"/></p>\n    <note conref="shared-topics.dita#safety-defs/dr-warning"/>\n  </conbody>\n</concept>` },
    ],
    links: [],
  }
  throw new Error('Unknown reuse format')
}
