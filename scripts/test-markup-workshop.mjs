import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import ts from 'typescript'
import { runInNewContext } from 'node:vm'

// Compile only the pure course modules; keep the tests independent of the site build.
const temporary = await mkdtemp(resolve('node_modules/.markup-test-'))
let count = 0
function verify(value, message) {
  assert.ok(value, message)
  count++
}
try {
  for (const file of ['course', 'engine', 'state', 'tableSpans', 'section', 'dita', 'workbook', 'zip', 'navigation', 'ditaProgress', 'practicePackage', 'storage']) {
    const source = await readFile(resolve('src/components/MarkupWorkshop', file + '.ts'), 'utf8')
    const output = ts.transpileModule(source, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 },
    }).outputText.replace(/(['\"])\.\/(course|tableSpans|state|dita|workbook|ditaProgress)\1/g, (_, quote, name) => quote + './' + name + '.mjs' + quote)
    await writeFile(join(temporary, file + '.mjs'), output)
  }
  const { courses, documentSource } = await import(pathToFileURL(join(temporary, 'course.mjs')))
  const { practiceFiles } = await import(pathToFileURL(join(temporary, 'practicePackage.mjs')))
  const panelImage = await readFile(resolve('static/img/markup/mysql-architecture.svg'), 'utf8')
  for (const syntax of ['markdown', 'asciidoc']) {
    const source = '# Draft\nUser edits remain\n/img/markup/mysql-architecture.svg\nhttps://example.org/other.svg'
    const files = practiceFiles(source, syntax, 'zh', panelImage)
    const draft = files['mysql-operations-guide.' + (syntax === 'markdown' ? 'md' : 'adoc')]
    verify(draft === source.replace('/img/markup/mysql-architecture.svg', './images/mysql-architecture.svg'), 'Portable export preserves edits and unrelated image references')
    verify(files['images/mysql-architecture.svg'] === panelImage, 'Portable export includes the real course asset')
    verify(files['README.txt'].includes('未完成'), 'Portable export explains unfinished material')
  }

  const { compileDocument, checkAll, checkTask, checkTableSpans } = await import(pathToFileURL(join(temporary, 'engine.mjs')))
  const { spanSource, appendSpanSource } = await import(pathToFileURL(join(temporary, 'tableSpans.mjs')))
  const { freshSession, restoreSession } = await import(pathToFileURL(join(temporary, 'state.mjs')))
  const { sectionRange } = await import(pathToFileURL(join(temporary, 'section.mjs')))
  const { ditaProject, ditaExerciseAnswer } = await import(pathToFileURL(join(temporary, 'dita.mjs')))
  const sections = '# Guide\n\n## First\n\n~~~md\n## Second\n~~~\n\n## Second\nText\n\n## Third'
  const location = sectionRange(sections, 'Second')
  verify(location.firstLine === 8 && location.endLine === 11 && sections.slice(location.start).startsWith('## Second'), 'Locate actual sections, ignoring fenced headings')
  verify(sectionRange(sections, 'First', true).firstLine === 0, 'First exercise includes the document title')
  verify(!sectionRange(sections, 'Missing').found, 'Missing sections are reported without changing text')
  verify(sectionRange('= 说明书\n\n== 初始化实例\n步骤', '初始化实例').start === 7, 'Locate Chinese AsciiDoc sections')
  for (const locale of ['zh', 'en']) {
    const project = ditaProject(locale)
    for (const [lesson, filename] of [['concept', 'engines.dita'], ['task', 'start-service.dita'], ['reference', 'parameters.dita'], ['map', 'guide.ditamap'], ['reuse', 'start-service.dita']]) {
      verify(ditaExerciseAnswer(locale, lesson) !== project.files[filename], 'DITA reference answer performs the lesson action: ' + lesson)
    }
    verify(Object.keys(project.files).length === 5, 'DITA project has three topics and two maps')
    verify(project.maps.every(map => map.topics.includes('start-service')), 'Both maps reuse the same task')
    for (const map of project.maps) {
      for (const id of map.topics) verify(project.files[map.id + '.ditamap'].includes('href="' + id + '.dita"') && project.files[id + '.dita'], 'Every map reference resolves to a shared source file')
    }
  }
  for (const locale of ['zh', 'en']) {
    for (const syntax of ['markdown', 'asciidoc']) {
      const full = documentSource(locale, syntax, true)
      const html = await compileDocument(full, syntax)
      const results = checkAll(html, locale, syntax)
      for (const [id, checks] of Object.entries(results)) {
        verify(checks.every(c => c.ok), locale + '/' + syntax + '/' + id + ': ' + JSON.stringify(checks))
      }
      const starter = await compileDocument(documentSource(locale, syntax), syntax)
      for (const [id, checks] of Object.entries(checkAll(starter, locale, syntax))) {
        verify(!checks.every(c => c.ok), 'Unfinished exercise should fail: ' + locale + '/' + syntax + '/' + id)
      }
      verify(courses[locale].length === 12 && courses[locale].every(t => documentSource(locale, syntax).includes(t.heading)), 'A new draft includes every exercise')
      const xref = courses[locale].find(t => t.id === 'xref')
      const broken = html.replace(/href="#[^"]*"/g, 'href="#does-not-exist"')
      verify(!checkTask(broken, xref, locale, syntax).every(c => c.ok), 'Broken section links fail')
      const note = courses[locale].find(t => t.id === 'note')
      const outside = await compileDocument(documentSource(locale, syntax, true).replace(note.answer[syntax], note.initial[syntax]), syntax)
      verify(!checkTask(outside, note, locale, syntax).every(c => c.ok), 'A reminder after the action fails')
    }
  }
  for (const locale of ['zh', 'en']) {
    const merged = await compileDocument(spanSource(locale, 'asciidoc'), 'asciidoc')
    verify(checkTableSpans(merged, locale).every(c => c.ok), 'Merged cells pass in ' + locale)
    const plain = await compileDocument(spanSource(locale, 'asciidoc', false), 'asciidoc')
    verify(!checkTableSpans(plain, locale).every(c => c.ok), 'Unmerged starter does not pass')
    const noRowSpan = merged.replace('rowspan="2"', 'rowspan="1"')
    verify(!checkTableSpans(noRowSpan, locale)[1].ok, 'Removing the row span fails')
    const noColumnSpan = merged.replace('colspan="2"', 'colspan="1"')
    verify(!checkTableSpans(noColumnSpan, locale)[2].ok, 'Removing the column span fails')
    const badWidth = await compileDocument(spanSource(locale, 'asciidoc').replace('2+|', '3+|'), 'asciidoc')
    verify(!checkTableSpans(badWidth, locale).every(c => c.ok), 'A wrong span factor fails')
    const repeated = await compileDocument(spanSource(locale, 'asciidoc').replace('|Hot backup', '|Physical backup |Hot backup').replace('|增量热备', '|物理备份 |增量热备'), 'asciidoc')
    verify(!checkTableSpans(repeated, locale).every(c => c.ok), 'Leaving the occupied cell in place fails')
    const md = await compileDocument(spanSource(locale, 'markdown'), 'markdown')
    verify(checkTableSpans(md, locale).every(c => c.ok), 'Markdown HTML table has matching row and column spans')
    verify(!checkTableSpans(await compileDocument(spanSource(locale, 'markdown', false), 'markdown'), locale).every(c => c.ok), 'Markdown HTML starter still needs cell merging')
    verify(!checkTableSpans(md.replace('rowspan=\"2\"', 'rowspan=\"1\"'), locale)[1].ok, 'Markdown requires the requested row span')
    const original = documentSource(locale, 'asciidoc') + '\n\nMy own notes.'
    const appended = appendSpanSource(original, locale, 'asciidoc')
    verify(appended.startsWith(original), 'Adding the exercise preserves all previous text')
    verify(appendSpanSource(appended, locale, 'asciidoc') === appended, 'Adding the exercise twice does not duplicate it')
    const otherSection = await compileDocument('= Guide\n\n== Unrelated\n\n' + spanSource(locale, 'asciidoc').split('\n').slice(2).join('\n'), 'asciidoc')
    verify(!checkTableSpans(otherSection, locale).every(c => c.ok), 'Spans in another section do not pass')
  }
  const unsafeTable = await compileDocument('<table onclick="alert(1)"><tr><td rowspan="2" style="position:fixed"><script>alert(1)</script><strong>Safe</strong><img src=x onerror=alert(1)></td></tr></table>', 'markdown')
  verify(unsafeTable.includes('rowspan="2"') && unsafeTable.includes('<strong>Safe</strong>'), 'HTML table keeps spans and inline formatting')
  verify(!/onclick|onerror|<script|<img|style=/.test(unsafeTable), 'HTML table rejects active content and arbitrary attributes')
  verify(!(await compileDocument('```html\n<table><tr><td rowspan="2">Sample</td></tr></table>\n```', 'markdown')).includes('<table>'), 'Fenced HTML stays a code example')
  const alternate = documentSource('en', 'markdown', true)
    .replace(/^- /gm, '+ ')
    .replace(/^2\. /gm, '1. ')
    .replace(/^3\. /gm, '1. ')
    .replace('**systemctl start mysqld**', '__systemctl start mysqld__')
  verify(Object.values(checkAll(await compileDocument(alternate, 'markdown'), 'en', 'markdown')).every(checks => checks.every(c => c.ok)), 'Equivalent Markdown is accepted')
  const fenced = ['~~~md', documentSource('en', 'markdown', true), '~~~'].join('\n')
  verify(!checkTask(await compileDocument(fenced, 'markdown'), courses.en[0], 'en', 'markdown').every(c => c.ok), 'Examples inside a code fence do not count as real headings')
  verify(!(await compileDocument('<script>alert(1)</script>\n\n# Safe', 'markdown')).includes('<script>'), 'Markdown does not pass through raw HTML')
  verify((await compileDocument('= Guide\n\ninclude::https://invalid.example/secret.adoc[]', 'asciidoc')).includes('href='), 'Secure AsciiDoc converts includes to links instead of fetching them')
  const source = freshSession('zh')
  source.syntax = 'asciidoc'
  source.drafts.markdown.source = 'Markdown draft'
  source.drafts.asciidoc.source = 'AsciiDoc draft'
  source.drafts.asciidoc.step = 10
  const restored = restoreSession(JSON.stringify(source), 'zh')
  assert.deepEqual(restored, source)
  count++
  verify(restoreSession('not json', 'en').drafts.markdown.source.includes('MySQL Database Service'), 'Corrupt storage falls back to fresh content')
  source.drafts.asciidoc.source = 'x'.repeat(40001)
  source.drafts.markdown.step = 99
  const invalid = restoreSession(JSON.stringify(source), 'zh')
  verify(invalid.drafts.asciidoc.source.length < 40000 && invalid.drafts.markdown.step === 0, 'Oversized drafts and invalid steps are discarded')
  const old = { syntax: 'asciidoc', drafts: {
    markdown: { source: 'My existing Markdown notes', checked: ['headings', 'ordered'], steps: { basic: 2, advanced: 0 } },
    asciidoc: { source: 'My existing AsciiDoc notes', checked: ['table', 'xref'], steps: { basic: 5, advanced: 2 } },
  } }
  const migrated = restoreSession(JSON.stringify(old), 'en')
  verify(migrated.syntax === 'asciidoc', 'Migration preserves the selected syntax')
  for (const syntax of ['markdown', 'asciidoc']) {
    verify(migrated.drafts[syntax].source === old.drafts[syntax].source, 'Migration preserves the exact source for ' + syntax)
    assert.deepEqual(migrated.drafts[syntax].checked, old.drafts[syntax].checked)
    count++
  }
  verify(migrated.drafts.markdown.step === 2 && migrated.drafts.asciidoc.step === 8, 'Old page positions map to the combined course')
  verify(restoreSession(JSON.stringify({ drafts: { markdown: { source: '', checked: [], steps: { basic: 99, advanced: -1 } } } }), 'en').drafts.markdown.step === 0, 'Invalid legacy positions fall back safely')
  for (const prefix of ['', '/en']) {
    for (const route of ['advanced', 'markdown/first-guide']) {
      const page = await readFile(resolve('static/docs/markup', route, 'index.html'), 'utf8')
      const script = page.match(/<script>([\s\S]*?)<\/script>/)[1]
      const incoming = new URL('https://flowingdocs.com' + prefix + '/docs/markup/' + route + '/?syntax=asciidoc#table-spans-title')
      let destination
      runInNewContext(script, { URL, window: { location: {
        pathname: incoming.pathname, origin: incoming.origin, search: incoming.search, hash: incoming.hash,
        replace: (value) => { destination = new URL(value) },
      } } })
      verify(destination.pathname === prefix + '/docs/markup/' && destination.searchParams.get('syntax') === 'asciidoc' && destination.hash === incoming.hash, 'Legacy route preserves locale, syntax, and anchor: ' + prefix + route)
      const fallback = page.match(/<a href="([^"]+)"/)[1]
      verify(new URL(fallback, incoming).pathname === prefix + '/docs/markup/', 'No-script link preserves locale: ' + prefix + route)
    }
  }
  const { loadCourseWorkbook, previousDraftFiles, workbookKey } = await import(pathToFileURL(join(temporary, 'storage.mjs')))
  const { assemble, editPart, splitDocument, freshWorkbook, restoreWorkbook } = await import(pathToFileURL(join(temporary, 'workbook.mjs')))
  const { zipFiles } = await import(pathToFileURL(join(temporary, 'zip.mjs')))
  const { readRoute, navigateWorkbook } = await import(pathToFileURL(join(temporary, 'navigation.mjs')))
  for (const anchor of ['markup-reference', 'markup-reference-table-spans']) {
    const referenceRoute = readRoute(new URL('https://flowingdocs.com/docs/markup/?syntax=asciidoc&exercise=table-spans#' + anchor), freshWorkbook('zh'), 'zh')
    verify(referenceRoute.step === 'table-spans' && referenceRoute.panel === 'lesson', 'Reading-reference anchors must not replace the active exercise')
  }
  const { changedText, reorderedTopics, ditaPassed, ditaFingerprint } = await import(pathToFileURL(join(temporary, 'ditaProgress.mjs')))
  verify(!reorderedTopics(['a', 'b', 'c'], ['a', 'b', 'c']), 'Unchanged map cannot complete reordering task')
  verify(!reorderedTopics(['a', 'a', 'c'], ['a', 'b', 'c']), 'Duplicate topics cannot complete reordering task')
  verify(!reorderedTopics(['b', 'a'], ['a', 'b', 'c']), 'Deleting a topic cannot complete reordering task')
  verify(reorderedTopics(['b', 'a', 'c'], ['a', 'b', 'c']), 'A real reorder with all topics completes the task')
  verify(!changedText(['one  two'], ['one two']), 'Whitespace-only edits do not complete a text task')
  verify(!changedText([], ['one']), 'Empty content does not complete a text task')
  verify(changedText(['new instruction'], ['instruction']), 'A changed instruction satisfies the text task')
  for (const locale of ['zh', 'en']) {
    for (const syntax of ['markdown', 'asciidoc']) {
      for (const solved of [false, true]) {
        const original = documentSource(locale, syntax, solved) + '\n\nMy own extra notes.\n'
        const book = { parts: splitDocument(original, locale), step: 'ordered', checked: ['ordered', 'table'] }
        verify(assemble(book) === original, 'Segment migration preserves every source byte')
        verify(book.parts.some(p => p.id === 'ordered') && book.parts.some(p => p.id === 'note'), 'Known sections receive stable IDs')
        const updated = editPart(book, 'ordered', '## My new heading\n\n1. My own instruction')
        verify(updated.parts.find(p => p.id === 'ordered').source.includes('My new heading'), 'A renamed heading stays associated with the same exercise')
        verify(book.parts.filter(p => p.id !== 'ordered').every(p => updated.parts.find(next => next.id === p.id).source === p.source), 'Editing one section leaves all other sections intact')
        verify(!updated.checked.includes('ordered') && updated.checked.includes('table'), 'Editing clears only the current section check')
        verify(assemble(updated).includes('My own extra notes.'), 'Custom trailing notes survive section edits')
        if (syntax === 'asciidoc' && solved) verify(book.parts.find(p => p.id === 'note').source.startsWith('[[maintenance]]'), 'AsciiDoc anchors travel with their section')
      }
      const crlf = documentSource(locale, syntax, true).replace(/\n/g, '\r\n')
      verify(assemble({ parts: splitDocument(crlf, locale) }) === crlf, 'CRLF migration is lossless')
    }
    const legacy = { syntax: 'asciidoc', drafts: { markdown: { source: 'Unrecognized personal notes', checked: [], step: 0 }, asciidoc: { source: documentSource(locale, 'asciidoc', true), checked: ['table'], step: 6 } } }
    const migrated = restoreWorkbook(null, JSON.stringify(legacy), locale)
    verify(assemble(migrated.books.markdown) === legacy.drafts.markdown.source, 'Unrecognized old writing is retained in the complete guide')
    verify(assemble(migrated.books.asciidoc) === legacy.drafts.asciidoc.source && migrated.books.asciidoc.step === 'table', 'Old syntax and lesson state migrate')
    const afterAdd = editPart(migrated.books.markdown, 'ordered', 'New exercise')
    verify(assemble(afterAdd).startsWith('Unrecognized personal notes\n\n') && assemble(afterAdd).endsWith('New exercise'), 'Adding a missing section preserves old notes and separates the new section')
    const fresh = freshWorkbook(locale)
    const appliance = JSON.stringify({ books: { markdown: { parts: [{ id: 'headings', source: '# Washer\nMy saved text', after: '\n\n' }] } }, dita: { files: { 'start-wash.dita': '<task id="wash"/>', '../escape.txt': 'ignore' } } })
    const storage = new Map([['flowingdocs-markup-v3-' + locale, appliance]])
    const loaded = loadCourseWorkbook(key => storage.get(key) ?? null, locale)
    verify(assemble(loaded.workbook.books.markdown).includes('MySQL') && !assemble(loaded.workbook.books.markdown).includes('Washer'), 'New course never mixes previous appliance drafts into MySQL tasks')
    const backup = previousDraftFiles(loaded.previousDraft, locale)
    verify(backup['previous-draft.md'] === '# Washer\nMy saved text\n\n' && backup['original-workbook.json'] === appliance, 'Previous draft export preserves exact text and original data')
    verify(backup['start-wash.dita'] === '<task id="wash"/>' && !backup['../escape.txt'], 'Previous DITA topics remain downloadable with safe filenames')
    verify(previousDraftFiles('{broken', locale)['original-workbook.json'] === '{broken', 'Invalid legacy data is still downloadable')
    const currentDraft = { ...fresh, books: { ...fresh.books, markdown: editPart(fresh.books.markdown, 'headings', '# My own MySQL guide') } }
    storage.set(workbookKey(locale), JSON.stringify(currentDraft))
    verify(assemble(loadCourseWorkbook(key => storage.get(key) ?? null, locale).workbook.books.markdown).startsWith('# My own MySQL guide'), 'Current course edits resume independently of old drafts')
    verify(storage.get('flowingdocs-markup-v3-' + locale) === appliance, 'Loading the new course does not mutate the old storage entry')

    let visiting = navigateWorkbook(fresh, 'markdown', 'ordered')
    visiting = { ...visiting, books: { ...visiting.books, markdown: editPart(visiting.books.markdown, 'ordered', 'My edit') } }
    const snapshot = assemble(visiting.books.markdown)
    visiting = navigateWorkbook(visiting, 'markdown', 'intro')
    verify(visiting.books.markdown.lastStep === 'ordered', 'Overview does not erase the last exercise')
    verify(restoreWorkbook(JSON.stringify(visiting), null, locale).books.markdown.lastStep === 'ordered', 'Resume location survives reload')
    for (const [format, savedStep] of [['markdown', 'ordered'], ['asciidoc', 'table-spans'], ['dita', 'task']]) {
      const saved = navigateWorkbook(visiting, format, savedStep)
      const savedBook = format === 'dita' ? saved.dita : saved.books[format]
      for (const query of ['', '?syntax=' + format, '?syntax=' + format + '&exercise=unknown']) {
        const entry = readRoute(new URL('https://example.test/docs/markup/' + query), saved, locale)
        verify(entry.panel === 'lesson' && entry.step === 'intro' && entry.format === format, 'A general or invalid lesson URL opens the introduction, keeping the syntax preference')
        const entered = navigateWorkbook(saved, entry.format, entry.step)
        const enteredBook = format === 'dita' ? entered.dita : entered.books[format]
        verify(enteredBook.lastStep === savedStep, 'Entering the introduction keeps the explicit resume destination')
        assert.deepEqual(format === 'dita' ? enteredBook.files : enteredBook.parts, format === 'dita' ? savedBook.files : savedBook.parts)
        assert.deepEqual(format === 'dita' ? enteredBook.receipts : enteredBook.checked, format === 'dita' ? savedBook.receipts : savedBook.checked)
        count += 2
      }
      const deep = readRoute(new URL('https://example.test/docs/markup/?syntax=' + format + '&exercise=' + savedStep), saved, locale)
      verify(deep.step === savedStep, 'A shared or refreshed lesson URL still opens that exact lesson')
    }
    const destination = readRoute(new URL('https://example.test/docs/markup/?syntax=asciidoc&exercise=table&view=full'), visiting, locale)
    verify(destination.format === 'asciidoc' && destination.step === 'table' && destination.panel === 'full', 'History restores syntax, exercise and full-view panel')
    visiting = navigateWorkbook(visiting, destination.format, destination.step)
    verify(assemble(visiting.books.markdown) === snapshot, 'History navigation retains edits in the other format')
    verify(readRoute(new URL('https://example.test/docs/markup/?syntax=dita&exercise=map'), visiting, locale).step === 'map', 'DITA deep links remain valid')
    verify(readRoute(new URL('https://example.test/docs/markup/?syntax=markdown&exercise=intro#markup-ai-title'), visiting, locale).panel === 'lesson', 'Overview anchors stay on the overview after reload')
    verify(readRoute(new URL('https://example.test/docs/markup/#where-next'), visiting, locale).panel === 'resources', 'Further-reading anchors open the resources panel')
    for (const format of ['markdown', 'asciidoc', 'dita']) {
      const reuseRoute = readRoute(new URL('https://example.test/docs/markup/?syntax=' + format + '&view=reuse'), visiting, locale)
      verify(reuseRoute.panel === 'reuse' && reuseRoute.format === format, 'Reuse comparison restores its format on a direct URL')
      verify(reuseRoute.step === (format === 'dita' ? visiting.dita.step : visiting.books[format].step), 'Opening reuse does not replace the current exercise')
    }

    verify(readRoute(new URL('https://example.test/docs/markup/#table-spans-title'), fresh, locale).format === 'asciidoc', 'Legacy merged-table links preserve AsciiDoc routing')
    const editedDita = { ...fresh.dita.files, 'start-service.dita': fresh.dita.files['start-service.dita'].replace('</cmd>', ' Extra.</cmd>') }
    const receipt = { task: ditaFingerprint(editedDita, 'task'), reuse: ditaFingerprint(editedDita, 'reuse') }
    verify(ditaPassed(editedDita, receipt, 'task'), 'DITA completion belongs to checked source')
    verify(!ditaPassed(fresh.dita.files, receipt, 'task'), 'Changing checked source invalidates completion')
    verify(!ditaPassed({ ...editedDita, 'guide.ditamap': editedDita['guide.ditamap'] + ' ' }, receipt, 'reuse'), 'Editing a shared map invalidates reuse completion')
    const storedDita = { ...fresh, dita: { ...fresh.dita, files: editedDita, receipts: receipt, lastStep: 'task' } }
    verify(ditaPassed(restoreWorkbook(JSON.stringify(storedDita), null, locale).dita.files, restoreWorkbook(JSON.stringify(storedDita), null, locale).dita.receipts, 'task'), 'DITA completion receipts and edits survive reload')

    fresh.format = 'dita'
    fresh.dita.files['start-service.dita'] += '\n<!-- my draft -->'
    assert.deepEqual(restoreWorkbook(JSON.stringify(fresh), null, locale), fresh)
    count++
    fresh.dita.step = 'intro'
    assert.deepEqual(restoreWorkbook(JSON.stringify(fresh), null, locale), fresh)
    count++
    verify(restoreWorkbook('{bad', null, locale).books.markdown.parts.length === 13, 'Corrupt workbook storage has safe defaults')
    const files = { ...fresh.dita.files, '说明.txt': 'Edited UTF-8 contents' }
    const zipped = zipFiles(files)
    execFileSync('python3', ['-c', 'import sys,json,base64,io,zipfile; d=json.load(sys.stdin); z=zipfile.ZipFile(io.BytesIO(base64.b64decode(d["zip"]))); assert z.testzip() is None; assert {n:z.read(n).decode("utf-8") for n in z.namelist()} == d["files"]'], { input: JSON.stringify({ zip: Buffer.from(zipped).toString('base64'), files }) })
    count++
  }
  console.log(count + ' markup checks passed')
}
finally {
  await rm(temporary, { recursive: true, force: true })
}
