import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const source = await readFile('src/lib/localePath.ts', 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
const { alternateLocalePath } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))
const cases = [
  ['/blog/tags/技术写作/', true, '/en/blog/tags/technical-writing/'],
  ['/blog/tags/%E6%8A%80%E6%9C%AF%E5%86%99%E4%BD%9C/', true, '/en/blog/tags/technical-writing/'],
  ['/en/blog/tags/technical-writing/', false, '/blog/tags/技术写作/'],
  ['/blog/tags/ai-审校/', true, '/en/blog/tags/ai-review/'],
  ['/en/blog/tags/ai-review/', false, '/blog/tags/ai-审校/'],
  ['/blog/tags/deep-seek/', true, '/en/blog/tags/deep-seek/'],
  ['/en/blog/tags/mac-os/', false, '/blog/tags/mac-os/'],
  ['/blog/tags/技术写作/page/2/', true, '/en/blog/tags/technical-writing/'],
  ['/blog/tags/new-untranslated-topic/', true, '/en/blog/tags/'],
  ['/blog/tags/%ZZ/', true, '/en/blog/tags/'],
  ['/404.html', true, '/en/'],
  ['/en/404/', false, '/'],
  ['/about/', true, '/en/about/'],
  ['/en/docs/markup/', false, '/docs/markup/'],
]
for (const [path, english, expected] of cases) assert.equal(alternateLocalePath(path, english), expected, path)
console.log(`${cases.length} locale navigation checks passed`)
