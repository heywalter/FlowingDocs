import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { parse } from 'parse5'

const build = resolve(process.argv[2] || 'build')
const generated = '.docusaurus/docusaurus-plugin-content-blog/default/p'
const names = await readdir(generated)
let checks = 0
function verify(value, message) {
  assert.ok(value, message)
  checks++
}
function attr(node, name) {
  return node.attrs?.find(a => a.name === name)?.value
}
function nodes(node) {
  return [node, ...(node.childNodes || []).flatMap(nodes)]
}
function path(href) {
  return decodeURI(href).replace(/\/$/, '')
}
async function page(url) {
  return nodes(parse(await readFile(join(build, url, 'index.html'), 'utf8')))
}

for (const prefix of ['', '/en']) {
  const stem = prefix ? 'en-blog' : 'blog'
  const archiveFile = names.find(name => new RegExp(`^${stem}-archive-[a-z0-9]+\\.json$`).test(name))
  const tagsFile = names.find(name => new RegExp(`^${stem}-tags-[a-z0-9]+\\.json$`).test(name))
  assert.ok(archiveFile && tagsFile, `Missing generated ${stem} browsing data; run a bilingual build first`)
  const { archive } = JSON.parse(await readFile(join(generated, archiveFile), 'utf8'))
  const { tags } = JSON.parse(await readFile(join(generated, tagsFile), 'utf8'))
  const expected = archive.blogPosts.map(p => path(p.metadata.permalink)).sort()
  verify(expected.length > 0, `${stem}: expected published articles`)
  const archiveNodes = await page(`${prefix}/blog/archive`)
  const yearLists = archiveNodes.filter(n => attr(n, 'data-blog-archive-year') !== undefined)
  const archiveMain = archiveNodes.find(n => n.tagName === 'main')
  const articleLinks = nodes(archiveMain).filter(n => n.tagName === 'a' && expected.includes(path(attr(n, 'href') || ''))).map(n => path(attr(n, 'href')))
  assert.deepEqual([...articleLinks].sort(), expected, `${stem}: archive must actually render every article exactly once`)
  checks++
  const dates = yearLists.flatMap(nodes).filter(n => n.tagName === 'time').map(n => attr(n, 'datetime'))
  assert.deepEqual(dates, [...dates].sort().reverse(), `${stem}: archive dates must descend`)
  checks++
  for (const list of yearLists) verify(nodes(list).some(n => n.tagName === 'a'), `${stem}: every rendered year must have articles`)
  const topicNodes = await page(`${prefix}/blog/tags`)
  const allTopics = topicNodes.find(n => attr(n, 'data-blog-topic-list') !== undefined)
  verify(allTopics, `${stem}: complete tag list is present in initial HTML`)
  const tagLinks = nodes(allTopics).filter(n => n.tagName === 'a').map(n => path(attr(n, 'href'))).sort()
  assert.deepEqual(tagLinks, tags.map(t => path(t.permalink)).sort(), `${stem}: no topic is lost in the visual redesign`)
  checks++
  for (const post of archive.blogPosts) {
    const postNodes = await page(post.metadata.permalink)
    const sidebar = postNodes.find(n => attr(n, 'data-blog-sidebar') !== undefined)
    verify(sidebar, `${post.metadata.permalink}: history navigation present`)
    const sidebarNodes = nodes(sidebar)
    const history = sidebarNodes.filter(n => n.tagName === 'li').flatMap(nodes).filter(n => n.tagName === 'a')
    assert.deepEqual(history.map(n => path(attr(n, 'href'))).sort(), expected, `${post.metadata.permalink}: complete locale-specific history`)
    checks++
    verify(history.some(n => path(attr(n, 'href')) === path(post.metadata.permalink) && attr(n, 'aria-current') === 'page'), `${post.metadata.permalink}: current article indicated`)
  }
  const projectNodes = await page(`${prefix}/showcase`)
  const search = projectNodes.find(n => attr(n, 'id') === 'project-search')
  verify(search, `${stem}: project search is rendered`)
  verify(!projectNodes.filter(n => n.tagName === 'details').some(n => nodes(n).includes(search)), `${stem}: project filters are not behind a disclosure`)
}
console.log(`${checks} built blog browsing checks passed (archives, tags, article history, project filters).`)
