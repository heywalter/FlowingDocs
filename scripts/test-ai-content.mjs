import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import { resolve, join, relative } from 'node:path'
import matter from 'gray-matter'
import { parse } from 'parse5'
import { parseMarkdown, cleanMarkdownForLLM } from './lib/reading-export.mjs'
import { loadCourseReference } from './lib/pure-modules.mjs'

const root = resolve('.')
let checks = 0
function verify(value, message) {
  assert.ok(value, message)
  checks++
}
async function files(dir, suffix) {
  const result = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) result.push(...await files(path, suffix))
    else if (suffix.test(path)) result.push(path)
  }
  return result
}
function descendants(node) {
  return [node, ...(node.children || []).flatMap(descendants)]
}
const sample = 'import Widget from "./Widget"\n\n<Tabs>\n<TabItem label="Example">\n\n```mdx\nimport Widget from "./Widget";\n\n<Widget />\n:::note Keep this literal\n[Example](./example.md)\n```\n\n`<Widget />`\n\n[Continue](./example.md#next)\n\n</TabItem>\n</Tabs>'
const cleaned = cleanMarkdownForLLM(sample, () => 'https://example.org/guide/#next')
const nodes = descendants(parseMarkdown(cleaned))
verify(nodes.some(node => node.type === 'code' && node.value === 'import Widget from "./Widget";\n\n<Widget />\n:::note Keep this literal\n[Example](./example.md)'), 'Fenced source must survive exactly, including imports, JSX, directives and URLs')
verify(nodes.some(node => node.type === 'inlineCode' && node.value === '<Widget />'), 'Inline code is preserved')
verify(cleaned.includes('<strong>Example</strong>'), 'Tab labels are retained')
verify(nodes.some(node => node.type === 'link' && node.url === 'https://example.org/guide/#next'), 'Prose links are resolved')
for (const [sourceDir, locale, kind] of [
  ['docs', 'zh', 'docs'], ['blog', 'zh', 'blog'],
  ['i18n/en/docusaurus-plugin-content-docs/current', 'en', 'docs'],
  ['i18n/en/docusaurus-plugin-content-blog', 'en', 'blog'],
]) {
  for (const file of await files(sourceDir, /\.mdx?$/)) {
    const { data, content } = matter(await readFile(file, 'utf8'))
    if (data.draft || data.unlisted) continue
    const output = join('static/llms', locale, kind, relative(sourceDir, file).replace(/\.mdx?$/, '.md').replace(/\/index\.md$/, '.md'))
    const exported = await readFile(output, 'utf8')
    const expected = descendants(parseMarkdown(content)).filter(n => n.type === 'code')
    const actual = descendants(parseMarkdown(exported)).filter(n => n.type === 'code')
    for (const code of expected) verify(actual.some(n => n.value === code.value && n.lang === code.lang), `${file}: missing or modified ${code.lang || 'text'} code example`)
    verify(exported.includes('Source: https://flowingdocs.com/'), `${output}: original page provenance`)
  }
}
const { referenceSections } = await loadCourseReference(root)
const reuseCode = referenceSections('zh').find(section => section.id === 'reuse-markdown').examples.find(example => example.title === 'guide-production.mdx').code
verify(reuseCode.includes('import SafetyNotice from \'./snippets/SafetyNotice.mdx\';') && reuseCode.includes('from \'./shared.js\';'), 'Loading shared data must not rewrite imports inside example strings')
for (const locale of ['zh', 'en']) {
  const markdown = await readFile(`static/llms/${locale}/docs/markup.md`, 'utf8')
  for (const section of referenceSections(locale)) for (const example of section.examples) verify(markdown.includes(example.code), `${locale}/${section.id}: static reference must contain the shared example`)
}

for (const file of ['static/llms.txt', 'static/llms-full.txt', ...await files('static/llms', /\.md$/)]) {
  for (const node of descendants(parseMarkdown(await readFile(file, 'utf8')))) {
    if (['link', 'image', 'definition'].includes(node.type)) verify(/^(?:https?:|mailto:)/.test(node.url), `${file}: unresolved source URL ${node.url}`)
  }
}

const build = process.argv[2] ? resolve(process.argv[2]) : undefined
if (build) {
  const html = new Map()
  for (const file of await files(build, /\.html$/)) {
    const nodes = []
    function visit(node) {
      nodes.push(node)
      for (const child of node.childNodes || []) visit(child)
    }
    visit(parse(await readFile(file, 'utf8')))
    html.set(file, nodes)
  }
  async function resolveTarget(url, message) {
    const targetUrl = new URL(url, 'https://flowingdocs.com')
    if (targetUrl.origin !== 'https://flowingdocs.com') return
    const path = join(build, decodeURIComponent(targetUrl.pathname))
    let target = path
    try {
      if ((await stat(path)).isDirectory()) target = join(path, 'index.html')
    }
    catch { assert.fail(`${message}: missing ${url}`) }
    verify((await stat(target)).isFile(), `${message}: ${url}`)
    if (targetUrl.hash && html.has(target)) verify(html.get(target).some(node => node.attrs?.some(attr => attr.name === 'id' && attr.value === decodeURIComponent(targetUrl.hash.slice(1)))), `${message}: missing anchor ${url}`)
    return target
  }
  let alternates = 0
  for (const [file, nodes] of html) {
    for (const node of nodes.filter(node => node.tagName === 'link')) {
      const attrs = Object.fromEntries(node.attrs.map(attr => [attr.name, attr.value]))
      if (!['alternate', 'canonical', 'describedby'].includes(attrs.rel)) continue
      const target = await resolveTarget(attrs.href, relative(build, file))
      if (attrs.hreflang && attrs.hreflang !== 'x-default' && target) {
        alternates++
        const current = 'https://flowingdocs.com/' + relative(build, file).replace(/index\.html$/, '')
        verify(html.get(target)?.some(candidate => candidate.tagName === 'link' && candidate.attrs.some(a => a.name === 'hreflang') && candidate.attrs.some(a => a.name === 'href' && decodeURI(a.value) === decodeURI(current))), `Missing reciprocal hreflang: ${current} → ${attrs.href}`)
      }
    }
  }
  const texts = [join(build, 'llms.txt'), join(build, 'llms-full.txt'), ...await files(join(build, 'llms'), /\.md$/)]
  let links = 0
  for (const file of texts) {
    for (const node of descendants(parseMarkdown(await readFile(file, 'utf8')))) {
      if (['link', 'image', 'definition'].includes(node.type)) {
        verify(/^(?:https?:|mailto:)/.test(node.url), `${file}: unresolved source URL ${node.url}`)
        await resolveTarget(node.url, relative(build, file))
        links++
      }
      if (node.type === 'html') {
        for (const match of node.value.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
          await resolveTarget(match[1], relative(build, file))
          links++
        }
      }
    }
  }
  for (const locale of ['zh', 'en']) {
    const page = join(build, locale === 'en' ? 'en/docs/markup/index.html' : 'docs/markup/index.html')
    const nodes = html.get(page)
    verify(nodes.some(node => node.tagName === 'details' && node.attrs.some(a => a.name === 'id' && a.value === 'markup-reference')), 'No-JS reference is available in built HTML')
    const text = nodes.filter(node => node.nodeName === '#text').map(node => node.value).join('')
    for (const section of referenceSections(locale)) for (const example of section.examples) verify(text.includes(example.code), `${locale}/${section.id}: missing server-rendered example`)
  }
  console.log(`Verified ${html.size} HTML pages, ${alternates} reciprocal language links, and ${links} exported text references.`)
}
console.log(`${checks} AI-readable content checks passed${build ? '' : ' (source/export; pass a build directory to check published URLs and HTML)'}.`)
