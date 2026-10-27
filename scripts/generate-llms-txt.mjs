#!/usr/bin/env node
// Build readable copies from the published source set. llms.txt is an optional
// discovery format (https://llmstxt.org/), not a promise of search visibility.
import { readFile, writeFile, mkdir, readdir, copyFile, rm } from 'node:fs/promises'
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve, relative, basename } from 'node:path'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { cleanMarkdownForLLM } from './lib/reading-export.mjs'
import { loadCourseReference, loadLocalePaths } from './lib/pure-modules.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const BASE_URL = 'https://flowingdocs.com'
const docs = ['index.md', 'markup/index.mdx', 'information-design/index.mdx', 'information-design/concept.md', 'information-design/task.md', 'information-design/reference.md', 'publishing/index.md']
const locales = [
  { id: 'zh', prefix: '', docs: 'docs', blog: 'blog' },
  { id: 'en', prefix: '/en', docs: 'i18n/en/docusaurus-plugin-content-docs/current', blog: 'i18n/en/docusaurus-plugin-content-blog' },
]
const items = []
for (const locale of locales) {
  for (const [kind, files] of [['docs', docs], ['blog', (await readdir(join(ROOT, locale.blog))).filter(file => /\.mdx?$/.test(file)).sort()]]) {
    for (const file of files) {
      const source = join(ROOT, locale[kind], file)
      const { data, content } = matter(await readFile(source, 'utf8'))
      if (data.draft || data.unlisted) continue
      const slug = data.slug ?? file.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '')
      const path = `${locale.prefix}/${kind}/${slug}`.replace(/\/{2,}/g, '/').replace(/\/?$/, '/')
      const textPath = `/llms/${locale.id}/${kind}/${file.replace(/\.mdx?$/, '.md').replace(/\/index\.md$/, '.md')}`
      items.push({ locale, kind, file, source, data, content, path, textPath })
    }
  }
}
const bySource = new Map(items.map(item => [item.source, item]))
const assets = new Map()
function resolveLink(item, value) {
  if (value.startsWith('pathname://')) return BASE_URL + value.slice('pathname://'.length)
  if (/^(?:[a-z][\w+.-]*:|\/\/)/i.test(value)) return value
  if (value.startsWith('#')) return BASE_URL + item.path + value
  if (value.startsWith('/')) return BASE_URL + value
  const [, file, suffix = ''] = value.match(/^([^?#]*)([?#].*)?$/)
  const source = resolve(dirname(item.source), decodeURIComponent(file))
  const linked = bySource.get(source)
  if (linked) return BASE_URL + linked.path + suffix
  // Localized blog images can use the default-locale source asset.
  const fallback = item.locale.id === 'en' ? resolve(ROOT, item.kind === 'blog' ? 'blog' : 'docs', dirname(item.file), decodeURIComponent(file)) : source
  const asset = existsSync(source) ? source : fallback
  if (!existsSync(asset) || /\.mdx?$/.test(asset)) throw new Error(`Unresolved published link: ${relative(ROOT, item.source)} → ${value}`)
  const bytes = readFileSync(asset)
  const name = createHash('sha256').update(bytes).digest('hex').slice(0, 16) + '-' + basename(asset)
  const destination = '/llms/assets/' + name
  assets.set(asset, destination)
  return BASE_URL + destination + suffix
}
const { referenceMarkdown } = await loadCourseReference(ROOT)
const textSections = []
const markdownPaths = {}
for (const item of items) {
  const title = item.data.title || item.data.sidebar_label || item.file
  let body = cleanMarkdownForLLM(item.content, url => resolveLink(item, url))
  if (item.kind === 'docs' && item.file === 'markup/index.mdx') body += '\n' + referenceMarkdown(item.locale.id) + '\n'
  const text = `# ${title}\n\nSource: ${BASE_URL}${item.path}\n\n${body}`
  const target = join(ROOT, 'static', item.textPath)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, text)
  markdownPaths[item.path] = item.textPath
  textSections.push(text)
}
for (const [source, destination] of assets) {
  const target = join(ROOT, 'static', destination)
  await mkdir(dirname(target), { recursive: true })
  await copyFile(source, target)
}

// This directory is generated only. Remove obsolete copies after a source is
// renamed, unlisted, or deleted, so an old export does not remain public.
const expected = new Set([
  ...items.map(item => join(ROOT, 'static', item.textPath)),
  ...[...assets.values()].map(path => join(ROOT, 'static', path)),
])
async function removeObsolete(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await removeObsolete(path)
    else if (!expected.has(path)) await rm(path)
  }
}
await removeObsolete(join(ROOT, 'static/llms'))

// Match declared translation pairs only when both tags contain the same posts.
// Similar topics and navigation fallbacks must not be advertised as translations.
const require = createRequire(import.meta.url)
const blogRequire = createRequire(require.resolve('@docusaurus/plugin-content-blog'))
const { normalizeTags } = blogRequire('@docusaurus/utils')
const tagItems = new Map()
for (const item of items.filter(item => item.kind === 'blog')) {
  const tags = normalizeTags({ options: {}, source: item.source, frontMatterTags: item.data.tags, tagsBaseRoutePath: item.locale.prefix + '/blog/tags', tagsFile: null })
  for (const tag of tags) {
    const path = decodeURI(tag.permalink).replace(/\/?$/, '/')
    if (!tagItems.has(path)) tagItems.set(path, [])
    tagItems.get(path).push(item.file)
  }
}
const { tagPairs, sharedTags } = await loadLocalePaths(ROOT)
const pairs = [...tagPairs, ...[...sharedTags].map(tag => [tag, tag])]
const tagAlternates = {}
for (const [zh, en] of pairs) {
  if (pairs.filter(pair => pair[0] === zh || pair[1] === en).length !== 1) continue
  const zhPath = `/blog/tags/${zh}/`
  const enPath = `/en/blog/tags/${en}/`
  const a = tagItems.get(zhPath)?.sort().join('\n')
  const b = tagItems.get(enPath)?.sort().join('\n')
  if (!a || a !== b) continue
  const entry = { 'zh-Hans': zhPath, 'en': enPath }
  tagAlternates[zhPath] = entry
  tagAlternates[enPath] = entry
}
await mkdir(join(ROOT, 'src/data'), { recursive: true })
await writeFile(join(ROOT, 'src/data/reading-metadata.json'), JSON.stringify({ markdownPaths, tagAlternates }, null, 2) + '\n')
const index = [
  '# Flowing Docs', '',
  '> Walter’s notes on work, AI tools, self-hosted services, technical writing, projects, and everyday life.', '',
  'The links below provide Markdown copies. Each copy names its original page; examples retain their source syntax. Interactive markup exercises also have a full text reference.', '',
]
for (const locale of locales) for (const kind of ['docs', 'blog']) {
  index.push(`## ${locale.id === 'en' ? 'English' : 'Chinese'} ${kind === 'docs' ? 'documentation' : 'articles'}`, '')
  for (const item of items.filter(item => item.locale === locale && item.kind === kind)) index.push(`- [${item.data.title}](${BASE_URL}${item.textPath}): ${item.data.description || ''}`)
  index.push('')
}
index.push('## Combined text', '', `- [All included documentation and articles](${BASE_URL}/llms-full.txt): Chinese and English text in one file.`, '')
await writeFile(join(ROOT, 'static/llms.txt'), index.join('\n'))
await writeFile(join(ROOT, 'static/llms-full.txt'), '# Flowing Docs: documentation and articles\n\n' + textSections.join('\n\n---\n\n'))
console.log(`Generated ${items.length} readable pages, ${assets.size} local assets, and ${Object.keys(tagAlternates).length / 2} verified tag translation pairs.`)
