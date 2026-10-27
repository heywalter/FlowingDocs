import { readFile, readdir, stat } from 'node:fs/promises'
import { resolve, join, relative } from 'node:path'
import { parse } from 'parse5'

const root = resolve(process.argv[2] || 'build')
const siteOrigin = 'https://flowingdocs.com'
const cache = new Map()
async function exists(path) {
  try {
    return (await stat(path)).isFile()
  }
  catch { return false }
}
async function pages(path) {
  const result = []
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = join(path, entry.name)
    if (entry.isDirectory()) result.push(...await pages(file))
    else if (entry.name.endsWith('.html')) result.push(file)
  }
  return result
}
async function inspect(file) {
  if (cache.has(file)) return cache.get(file)
  const result = { ids: new Set(), refs: [] }
  function visit(node) {
    const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]))
    if (attrs.id) result.ids.add(attrs.id)
    if (node.tagName === 'a' && attrs.href) result.refs.push({ url: attrs.href, anchor: true })
    if (['img', 'script'].includes(node.tagName) && attrs.src) result.refs.push({ url: attrs.src, anchor: false })
    if (node.tagName === 'link' && /^(icon|apple-touch-icon|manifest|stylesheet|alternate|canonical|describedby)$/.test(attrs.rel || '') && attrs.href) result.refs.push({ url: attrs.href, anchor: false })
    for (const child of node.childNodes || []) visit(child)
  }
  visit(parse(await readFile(file, 'utf8')))
  cache.set(file, result)
  return result
}
let count = 0
const failures = []
const sourcePages = process.argv.includes('--all') ? await pages(root) : [...await pages(join(root, 'docs')), ...await pages(join(root, 'en/docs'))]
for (const file of sourcePages) {
  const pagePath = '/' + relative(root, file).replaceAll('\\', '/').replace(/index\.html$/, '')
  const base = new URL(pagePath, siteOrigin)
  for (const ref of (await inspect(file)).refs) {
    const url = new URL(ref.url, base)
    if (url.origin !== siteOrigin) continue
    let target = resolve(root, '.' + decodeURIComponent(url.pathname))
    if (!target.startsWith(root + '/') && target !== root) continue
    if (!await exists(target)) target = join(target, 'index.html')
    count++
    if (!await exists(target)) failures.push(`${pagePath} → ${ref.url} (missing file)`)
    else if (ref.anchor && url.hash && target.endsWith('.html') && !(await inspect(target)).ids.has(decodeURIComponent(url.hash.slice(1)))) {
      failures.push(`${pagePath} → ${ref.url} (missing anchor)`)
    }
  }
}
if (failures.length) {
  console.error([...new Set(failures)].join('\n'))
  throw new Error(`${failures.length} unresolved local references`)
}
console.log(`Checked ${sourcePages.length} pages and ${count} local page/resource references. All resolved.`)
console.log('This check does not verify external URLs, downloads contents or client-only interactions.')
