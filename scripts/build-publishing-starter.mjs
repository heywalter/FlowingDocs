import { readFile, writeFile, mkdir } from 'node:fs/promises'
import ts from 'typescript'

// Reuse the browser's ZIP writer; the build needs no Python or archive utility.
const source = await readFile('src/components/MarkupWorkshop/zip.ts', 'utf8')
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText
const { zipFiles } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'))
const names = ['package.json', 'package-lock.json', 'docusaurus.config.js', 'sidebars.js', 'docs/index.md', 'src/css/custom.css', '.gitignore', 'README.md']
const files = {}
for (const name of names) files['publishing-starter/' + name] = await readFile('examples/publishing-starter/' + name, 'utf8')
await mkdir('static/docs', { recursive: true })
await writeFile('static/docs/publishing-starter.zip', zipFiles(files))
console.log('static/docs/publishing-starter.zip')
