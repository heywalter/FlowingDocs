import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { tmpdir } from 'node:os'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
import { parse } from 'parse5'

execFileSync(process.execPath, ['scripts/build-publishing-starter.mjs'], { stdio: 'inherit' })
const temporary = await mkdtemp(join(tmpdir(), 'flowingdocs-publishing-'))
try {
  // Verify the downloadable archive itself, with the previous lesson's real output.
  execFileSync('python3', ['-c', 'import sys,zipfile; zipfile.ZipFile("static/docs/publishing-starter.zip").extractall(sys.argv[1])', temporary])
  const root = join(temporary, 'publishing-starter')
  for (const file of ['course', 'tableSpans', 'practicePackage']) {
    const source = await readFile(resolve('src/components/MarkupWorkshop', file + '.ts'), 'utf8')
    const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText.replaceAll('\'./tableSpans\'', '\'./tableSpans.mjs\'')
    await writeFile(join(temporary, file + '.mjs'), compiled)
  }
  const { documentSource } = await import(pathToFileURL(join(temporary, 'course.mjs')))
  const { practiceFiles } = await import(pathToFileURL(join(temporary, 'practicePackage.mjs')))
  const panel = await readFile('static/img/markup/mysql-architecture.svg', 'utf8')
  const starter = await readFile(join(root, 'docs/index.md'), 'utf8')
  const frontMatter = starter.slice(0, starter.indexOf('---', 3) + 3)
  for (const locale of ['zh', 'en']) {
    const files = practiceFiles(documentSource(locale, 'markdown', true), 'markdown', locale, panel)
    const name = locale === 'zh' ? 'index' : 'english'
    const meta = locale === 'zh' ? frontMatter : '---\nslug: /english\n---'
    await writeFile(join(root, 'docs', name + '.md'), meta + '\n\n' + files['mysql-operations-guide.md'] + '\n\n:::note Publishing check\nRendered notice.\n:::\n')
    await mkdir(join(root, 'docs/images'), { recursive: true })
    await writeFile(join(root, 'docs/images/mysql-architecture.svg'), files['images/mysql-architecture.svg'])
  }
  // Install from the downloaded lockfile just as a reader does. A symlink can
  // resolve loaders outside the temporary project and lose document metadata.
  execFileSync('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund', '--prefer-offline'], { cwd: root, stdio: 'inherit' })
  execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' })
  for (const filename of ['index.html', 'english/index.html']) {
    const html = await readFile(join(root, 'build', filename), 'utf8')
    assert.doesNotMatch(html, /Washer guide|Washing.machine/, 'published site must use the current example')
    assert.match(html, /rowspan="2"/, 'row span must survive publishing')
    assert.match(html, /colspan="2"/, 'column span must survive publishing')
    assert.match(html, /mysql-architecture[^"<> ]*\.svg/, 'bundled panel must be emitted')
    assert.match(html, /Rendered notice/, 'the documented notice extension must render')
    assert.match(html, /alert--secondary/, 'notice must be a styled admonition')
    assert.doesNotMatch(html, /src="\/img\/markup\//, 'no dependency on the course site image path')
    const nodes = []
    function visit(node) {
      nodes.push(node)
      for (const child of node.childNodes || []) visit(child)
    }
    visit(parse(html))
    const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value
    const image = nodes.find(node => node.nodeName === 'img' && attr(node, 'alt')?.includes(filename === 'index.html' ? '架构' : 'architecture'))
    assert.ok(image, 'guide must include its panel image')
    const imageSrc = attr(image, 'src')
    if (imageSrc.startsWith('data:image/svg+xml')) {
      const data = imageSrc.slice(imageSrc.indexOf(',') + 1)
      const svg = imageSrc.includes(';base64,') ? Buffer.from(data, 'base64').toString() : decodeURIComponent(data)
      assert.match(svg, /<svg/, 'inlined image must contain SVG data')
    }
    else await readFile(join(root, 'build', imageSrc.replace(/^\//, '')))
    const link = nodes.find(node => node.nodeName === 'a' && attr(node, 'href')?.includes('mysql-architecture'))
    assert.ok(link, 'full-size panel link must exist')
    await readFile(join(root, 'build', attr(link, 'href').replace(/^\//, '')))
  }
  console.log('Publishing starter passed: ZIP contents, both course languages, image and link assets, table spans, and notice rendering.')
}
finally {
  await rm(temporary, { recursive: true, force: true })
}
