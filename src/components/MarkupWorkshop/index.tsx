import ReadingReference from './ReadingReference'
import { loadCourseWorkbook, previousDraftFiles, workbookKey } from './storage'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { practiceFiles } from './practicePackage'
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, DownloadIcon, ReaderIcon, ResetIcon } from '@radix-ui/react-icons'
import { courses } from './course'
import type { Locale, Syntax } from './course'
import { checkAll, checkTableSpans, compileDocument, documentHeadings } from './engine'
import { sanitizePreview } from './sanitize'
import { spanSource } from './tableSpans'
import { assemble, editPart, freshWorkbook } from './workbook'
import type { Book, Format, Workbook } from './workbook'
import { zipFiles } from './zip'
import SourceEditor from './SourceEditor'
import SyntaxReference from './SyntaxReference'
import CourseIntroduction from './CourseIntroduction'
import CourseHandoff from './CourseHandoff'
import ContentReuse from './ContentReuse'
import CheckFeedback from './CheckFeedback'
import DitaPanel, { ditaLabels } from './DitaPanel'
import styles from './styles.module.css'
import { navigateWorkbook, readRoute } from './navigation'
import type { Panel } from './navigation'
import { ditaExercises, ditaFile, ditaPassed } from './ditaProgress'

const names = { markdown: 'Markdown', asciidoc: 'AsciiDoc', dita: 'DITA' }
function useRendered(source: string, syntax: Syntax, ready: boolean) {
  const [output, setOutput] = useState({ source: '', syntax, html: '', safe: '', error: false })
  useEffect(() => {
    if (!ready) return
    let active = true
    const timer = setTimeout(() => {
      compileDocument(source, syntax).then((html) => {
        if (active) setOutput({ source, syntax, html, safe: sanitizePreview(html), error: false })
      }).catch(() => {
        if (active) setOutput({ source, syntax, html: '', safe: '', error: true })
      })
    }, 160)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [source, syntax, ready])
  return { ...output, busy: !ready || output.source !== source || output.syntax !== syntax }
}
function saveFile(data: BlobPart, filename: string, type = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([data], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
export default function MarkupWorkshop({ children }: { children?: ReactNode }) {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const locale = currentLocale === 'en' ? 'en' : 'zh'
  return (
    <>
      <Workshop key={locale} locale={locale}>{children}</Workshop>
      <ReadingReference locale={locale} />
    </>
  )
}
function Workshop({ locale, children }: { locale: Locale, children?: ReactNode }) {
  const tr = (zh: string, en: string) => locale === 'zh' ? zh : en
  const key = workbookKey(locale)
  const [previousDraft, setPreviousDraft] = useState<string | null>(null)
  const [state, setState] = useState<Workbook>(() => freshWorkbook(locale))
  const stateRef = useRef(state)
  stateRef.current = state
  const [ready, setReady] = useState(false)
  const [saved, setSaved] = useState(true)
  const [packing, setPacking] = useState(false)
  const [packageError, setPackageError] = useState(false)
  const panelUrl = useBaseUrl('/img/markup/mysql-architecture.svg')
  const [panel, setPanel] = useState<Panel>('lesson')
  const [help, setHelp] = useState<'reference' | 'compare' | null>(null)
  const [mobileView, setMobileView] = useState('source')
  const [fullView, setFullView] = useState('preview')
  const [undo, setUndo] = useState<{ format: Format, previous: Workbook } | null>(null)
  const [checkAttempt, setCheckAttempt] = useState(0)
  const [pendingAnchor, setPendingAnchor] = useState('')
  const [lastTextFormat, setLastTextFormat] = useState<Syntax>('markdown')
  const main = useRef<HTMLDivElement>(null)
  const format = state.format
  const syntax: Syntax = format === 'dita' ? 'markdown' : format
  const book = state.books[syntax]
  const step = format === 'dita' ? state.dita.step : book.step
  const tasks = courses[locale]
  const task = tasks.find(item => item.id === step)
  const merging = step === 'table-spans'
  const part = book.parts.find(item => item.id === step)
  const source = part?.source ?? ''
  const fullSource = assemble(book)
  const full = useRendered(fullSource, syntax, ready && format !== 'dita')
  const current = useRendered(source, syntax, ready && format !== 'dita')
  const checks = useMemo(() => checkAll(full.html, locale, syntax), [full.html, locale, syntax])
  const selectedChecks = merging ? checkTableSpans(full.html, locale) : checks[step] || []
  const completed = book.checked.filter(id => id === 'table-spans' ? checkTableSpans(full.html, locale).every(c => c.ok) : checks[id]?.every(c => c.ok)).length
  const exerciseCount = tasks.length + 1
  const checked = !full.busy && book.checked.includes(step)
  const success = selectedChecks.length > 0 && selectedChecks.every(c => c.ok)
  const other = syntax === 'markdown' ? 'asciidoc' : 'markdown'
  const answer = merging ? spanSource(locale, syntax) : task?.answer[syntax] ?? ''
  const initial = merging ? spanSource(locale, syntax, false) : task?.initial[syntax] ?? ''
  const headings = useMemo(() => documentHeadings(full.html), [full.html])
  const groups = format === 'dita'
    ? [{ title: tr('开始', 'Start here'), ids: ['intro'] }, { title: tr('认识主题', 'Topics'), ids: ['concept', 'task', 'reference'] }, { title: tr('组成手册', 'Build a guide'), ids: ['map', 'reuse'] }, { title: tr('继续实践', 'Keep learning'), ids: ['oxygen'] }]
    : [{ title: tr('开始', 'Start here'), ids: ['intro'] }, { title: tr('组织文字', 'Organize the text'), ids: ['headings', 'bullets', 'ordered', 'nested', 'emphasis', 'literal'] }, { title: tr('补充信息', 'Add the details'), ids: ['media', 'table', 'table-spans', 'xref', 'note', 'checklist', 'escape'] }]
  const lessonIds = groups.flatMap(group => group.ids)
  const index = lessonIds.indexOf(step)
  const defaults = useMemo(() => freshWorkbook(locale), [locale])
  function lessonStatus(id: string): 'passed' | 'changed' | 'new' {
    if (format === 'dita') {
      if (ditaPassed(state.dita.files, state.dita.receipts, id)) return 'passed'
      const name = ditaFile(id)
      return state.dita.files[name] !== defaults.dita.files[name] ? 'changed' : 'new'
    }
    const passed = book.checked.includes(id) && !full.busy && (id === 'table-spans' ? checkTableSpans(full.html, locale).every(c => c.ok) : checks[id]?.every(c => c.ok))
    if (passed) return 'passed'
    const section = book.parts.find(p => p.id === id)
    return section && section.source !== defaults.books[syntax].parts.find(p => p.id === id)?.source ? 'changed' : 'new'
  }
  const statusLabel = (status: string) => status === 'passed' ? tr('已通过', 'Passed') : status === 'changed' ? tr('已修改', 'Edited') : tr('未开始', 'Not started')
  const resumed = format === 'dita' ? state.dita.lastStep : book.lastStep
  const resumeStep = resumed && lessonIds.includes(resumed) ? resumed : undefined
  const firstUnfinished = lessonIds.find(id => id !== 'intro' && id !== 'oxygen' && lessonStatus(id) !== 'passed')
  const ditaCompleted = ditaExercises.filter(id => ditaPassed(state.dita.files, state.dita.receipts, id)).length
  function label(id: string) {
    if (id === 'intro') return tr('认识文档标记', 'Understanding markup')
    if (format === 'dita') return ditaLabels(locale)[id] || id
    if (id === 'table-spans') return tr('合并单元格', 'Merged cells')
    return tasks.find(t => t.id === id)?.label ?? id
  }
  useEffect(() => {
    let restored = freshWorkbook(locale)
    try {
      const loaded = loadCourseWorkbook(name => localStorage.getItem(name), locale)
      restored = loaded.workbook
      setPreviousDraft(loaded.previousDraft)
    }
    catch { setSaved(false) }
    const url = new URL(window.location.href)
    const first = readRoute(url, restored, locale)
    restored = navigateWorkbook(restored, first.format, first.step)
    setState(restored)
    setPanel(first.panel)
    if (first.format !== 'dita') setLastTextFormat(first.format)
    // Make an unqualified initial URL restorable when the user goes Back.
    url.searchParams.set('syntax', first.format)
    url.searchParams.set('exercise', first.step)
    window.history.replaceState(window.history.state, '', url)
    setReady(true)
    const restoreLocation = () => {
      const currentURL = new URL(window.location.href)
      const destination = readRoute(currentURL, stateRef.current, locale)
      const next = navigateWorkbook(stateRef.current, destination.format, destination.step)
      stateRef.current = next
      setState(next)
      setPanel(destination.panel)
      if (destination.format !== 'dita') setLastTextFormat(destination.format)
      try {
        localStorage.setItem(key, JSON.stringify(next))
        setSaved(true)
      }
      catch { setSaved(false) }
      setHelp(null)
      setUndo(null)
      setCheckAttempt(0)
      setPendingAnchor('')
      setMobileView('source')
    }
    window.addEventListener('popstate', restoreLocation)
    window.addEventListener('hashchange', restoreLocation)
    return () => {
      window.removeEventListener('popstate', restoreLocation)
      window.removeEventListener('hashchange', restoreLocation)
    }
  }, [locale, key])
  useEffect(() => {
    if (!ready) return
    const anchor = window.location.hash
    if (anchor.startsWith('#markup-') && step === 'intro') {
      document.getElementById(anchor.slice(1))?.scrollIntoView({ block: 'start' })
      return
    }
    main.current?.scrollIntoView({ block: 'start' })
    const heading = main.current?.querySelector<HTMLElement>('h2')
    heading?.setAttribute('tabindex', '-1')
    heading?.focus({ preventScroll: true })
  }, [ready, format, step, panel])
  useEffect(() => {
    if (panel !== 'full' || full.busy || !pendingAnchor) return
    document.getElementById(pendingAnchor)?.scrollIntoView({ block: 'start' })
    setPendingAnchor('')
  }, [panel, full.busy, pendingAnchor])
  function commit(next: Workbook) {
    stateRef.current = next
    setState(next)
    try {
      localStorage.setItem(key, JSON.stringify(next))
      setSaved(true)
    }
    catch { setSaved(false) }
  }
  function changeBook(next: Book) {
    commit({ ...state, books: { ...state.books, [syntax]: next } })
  }
  function route(nextFormat: Format, nextStep: string, nextPanel: Panel) {
    const url = new URL(window.location.href)
    url.searchParams.set('syntax', nextFormat)
    url.searchParams.set('exercise', nextStep)
    url.searchParams.delete('table')
    if (nextPanel === 'full' || nextPanel === 'reuse') url.searchParams.set('view', nextPanel)
    else url.searchParams.delete('view')
    url.hash = nextPanel === 'resources' ? 'where-next' : ''
    if (url.href !== window.location.href) window.history.pushState(window.history.state, '', url)
    setPanel(nextPanel)
    setHelp(null)
    setCheckAttempt(0)
    setUndo(null)
    setMobileView('source')
    main.current?.scrollIntoView({ block: 'start' })
  }
  function select(id: string) {
    commit(navigateWorkbook(state, format, id))
    route(format, id, 'lesson')
  }
  function changeFormat(next: Format) {
    let nextState = { ...state, format: next }
    if (step === 'intro' && next === 'dita') nextState = { ...nextState, dita: { ...state.dita, step: 'intro' } }
    if (next !== 'dita' && (format !== 'dita' || step === 'intro')) nextState = { ...nextState, books: { ...state.books, [next]: { ...state.books[next], step } } }
    if (next !== 'dita') setLastTextFormat(next)
    const nextStep = next === 'dita' ? nextState.dita.step : nextState.books[next].step
    commit(navigateWorkbook(nextState, next, nextStep))
    setUndo(null)
    route(next, next === 'dita' ? nextState.dita.step : nextState.books[next].step, panel === 'reuse' ? 'reuse' : 'lesson')
  }
  function edit(value: string) {
    setCheckAttempt(0)
    changeBook(editPart(book, step, value))
    setUndo(null)
  }
  function replacePart(value: string) {
    setCheckAttempt(0)
    setUndo({ format, previous: state })
    changeBook(editPart(book, step, value))
  }
  function nextLesson() {
    if (index >= lessonIds.length - 1) route(format, step, 'full')
    else select(lessonIds[index + 1]!)
  }
  async function downloadPackage() {
    setPacking(true)
    setPackageError(false)
    try {
      const response = await fetch(panelUrl)
      if (!response.ok) throw new Error('Panel image unavailable')
      const panelImage = await response.text()
      if (!panelImage.includes('<svg')) throw new Error('Invalid panel image')
      const files = practiceFiles(fullSource, syntax, locale, panelImage)
      saveFile(zipFiles(files).buffer as ArrayBuffer, 'mysql-operations-' + syntax + '-practice.zip', 'application/zip')
    }
    catch {
      setPackageError(true)
    }
    finally {
      setPacking(false)
    }
  }
  function download() {
    if (format === 'dita') {
      const readme = tr('# MySQL 运维手册 DITA 项目\n\n在 Oxygen 中打开 guide.ditamap，校验并使用 HTML5 发布场景。\n此项目包含当前编辑内容，下载不代表已经通过 DITA 规范校验。', '# MySQL Operations DITA Project\n\nOpen guide.ditamap in Oxygen, validate, and publish with an HTML5 scenario.\nThis archive contains your current edits; downloading does not imply full DITA validation.')
      saveFile(zipFiles({ ...state.dita.files, 'README.md': readme }).buffer as ArrayBuffer, 'mysql-dita.zip', 'application/zip')
    }
    else saveFile(fullSource, 'mysql-operations-guide.' + (syntax === 'markdown' ? 'md' : 'adoc'))
  }
  function previewClick(event: React.MouseEvent) {
    const href = (event.target as Element).closest('a')?.getAttribute('href')
    if (!href?.startsWith('#')) return
    event.preventDefault()
    let id = href.slice(1)
    try {
      id = decodeURIComponent(id)
    }
    catch { return }
    setPendingAnchor(id)
    setFullView('preview')
    route(format, step, 'full')
  }
  return (
    <div className={styles.workshop}>
      <aside className={styles.rail} aria-label={tr('示例目录', 'Example outline')}>
        <div className={styles.railTitle}>
          <Link className={styles.backToDocs} to={locale === 'en' ? '/en/docs/' : '/docs/'}>
            <ArrowLeftIcon aria-hidden="true" />
            {tr('技术文档实践', 'Documentation practice')}
          </Link>
          <h1>{tr('文档标记语言', 'Document markup')}</h1>
          <p>{tr('对照写法，理解能力与取舍。', 'Compare notation, capabilities, and tradeoffs.')}</p>
        </div>
        <label className={styles.mobilePicker}>
          {tr('示例目录', 'Example outline')}
          <select
            disabled={!ready}
            value={panel === 'lesson' ? 'lesson:' + step : 'panel:' + panel}
            onChange={(event) => {
              const [kind, target] = event.target.value.split(':')
              if (kind === 'panel') route(format, step, target as Panel)
              else if (target) select(target)
            }}
          >
            {groups.map(group => (
              <optgroup key={group.title} label={group.title}>
                {group.ids.map(id => (
                  <option key={id} value={'lesson:' + id}>
                    {label(id)}
                    {id !== 'intro' && id !== 'oxygen' ? ' · ' + statusLabel(lessonStatus(id)) : ''}
                  </option>
                ))}
              </optgroup>
            ))}
            <option value="panel:reuse">{tr('内容复用 · 一处修改，多处使用', 'Content reuse · Change once, use in several places')}</option>
            <option value="panel:full">{tr('完整成果', 'Your complete work')}</option>
            <option value="panel:resources">{tr('参考与关联实践', 'References and related practice')}</option>
          </select>
        </label>
        <nav className={styles.steps} aria-label={tr('练习目录', 'Exercises')}>
          {groups.map(group => (
            <div key={group.title} className={styles.navGroup}>
              <h2>{group.title}</h2>
              {group.ids.map(id => (
                <button key={id} disabled={!ready} aria-current={panel === 'lesson' && id === step ? 'step' : undefined} onClick={() => select(id)}>
                  <span className={styles.navMarker} aria-hidden="true">{id !== 'intro' && id !== 'oxygen' && (lessonStatus(id) === 'passed' ? <CheckIcon /> : lessonStatus(id) === 'changed' ? <span className={styles.editedDot} /> : <span className={styles.emptyDot} />)}</span>
                  <span className={styles.navLabel}>{label(id)}</span>
                  {id !== 'intro' && id !== 'oxygen' && <span className={styles.navStatus}>{statusLabel(lessonStatus(id))}</span>}
                </button>
              ))}
            </div>
          ))}
          <div className={styles.navGroup}>
            <h2>{tr('能力与取舍', 'Capabilities and tradeoffs')}</h2>
            <button disabled={!ready} aria-current={panel === 'reuse' ? 'page' : undefined} onClick={() => route(format, step, 'reuse')}>
              <span className={styles.navLabel}>{tr('内容复用', 'Content reuse')}</span>
            </button>
          </div>
        </nav>
        <div className={styles.railBottom}>
          <a href="#markup-reference">{tr('完整文字参考', 'Full text reference')}</a>
          <div className={styles.progress}>
            <progress value={format === 'dita' ? ditaCompleted : completed} max={format === 'dita' ? ditaExercises.length : exerciseCount} aria-label={tr('已完成练习', 'Completed exercises')} />
            <span>
              {format === 'dita' ? ditaCompleted : completed}
              {' '}
              /
              {' '}
              {format === 'dita' ? ditaExercises.length : exerciseCount}
            </span>
          </div>
          <button aria-current={panel === 'full' ? 'page' : undefined} onClick={() => route(format, step, 'full')}>
            <ReaderIcon />
            {format === 'dita' ? tr('查看示例项目', 'View the project') : tr('查看整份说明', 'View the full guide')}
          </button>
          <button aria-current={panel === 'resources' ? 'page' : undefined} onClick={() => route(format, step, 'resources')}>
            {tr('参考与关联实践', 'References and related practice')}
            <ArrowRightIcon />
          </button>
        </div>
      </aside>
      <div className={styles.main} ref={main} data-panel={panel} data-step={step}>
        <header className={styles.toolbar}>
          <span className={styles.toolbarTitle}>{tr('MySQL 运维指南 · 互动练习', 'MySQL operations guide · Interactive lessons')}</span>
          <div className={styles.learningRoutes}>
            <div className={styles.routeSwitch} role="group" aria-label={tr('学习路线', 'Learning path')}>
              <button disabled={!ready} aria-pressed={format !== 'dita'} onClick={() => changeFormat(lastTextFormat)}>{tr('写一份说明', 'Write a guide')}</button>
              <button disabled={!ready} aria-pressed={format === 'dita'} onClick={() => changeFormat('dita')}>{tr('DITA · 组织多份说明', 'DITA · Organize guides')}</button>
            </div>
            {format !== 'dita' && (
              <div className={styles.formatSwitch} role="group" aria-label={tr('本节写法', 'Lesson syntax')}>
                {(['markdown', 'asciidoc'] as const).map(item => <button disabled={!ready} key={item} aria-pressed={format === item} onClick={() => changeFormat(item)}>{names[item]}</button>)}
              </div>
            )}
            {format === 'dita' && <span className={styles.routeNote}>{tr('主题 → map → 复用', 'Topics → maps → reuse')}</span>}
          </div>
        </header>
        {previousDraft && (step === 'intro' || panel === 'resources') && (
          <aside className={styles.previousDraft} aria-label={tr('之前的练习草稿', 'Previous exercise drafts')}>
            <p>{tr('练习已更新为 MySQL 示例。之前的草稿仍保存在这个浏览器中，可以下载留存，再把需要的文字复制到新练习。', 'The exercises now use MySQL examples. Your previous drafts are still saved in this browser. Download them to keep a copy, then copy any text you need into the new exercises.')}</p>
            <button
              type="button"
              onClick={() => {
                const files = previousDraftFiles(previousDraft, locale)
                saveFile(zipFiles(files).buffer as ArrayBuffer, 'previous-markup-drafts.zip', 'application/zip')
              }}
            >
              {tr('下载之前的草稿', 'Download previous drafts')}
            </button>
          </aside>
        )}
        {panel === 'reuse' && <ContentReuse locale={locale} format={format} />}
        {panel === 'resources' && (
          <div className={styles.resources}>
            <CourseHandoff locale={locale} format={format} />
            {children}
          </div>
        )}
        {panel === 'full' && format !== 'dita' && (
          <section className={styles.fullDocument}>
            <div className={styles.fullHeading}>
              <div>
                <span className={styles.eyebrow}>{names[format]}</span>
                <h2>{completed === exerciseCount && !full.busy ? tr('这份说明，完成了', 'Your guide is complete') : tr('当前草稿', 'Your current draft')}</h2>
                <p>
                  {tr('已通过', 'Passed')}
                  {' '}
                  {completed}
                  {' '}
                  /
                  {' '}
                  {exerciseCount}
                  {tr('。', '. ')}
                  {completed === exerciseCount && !full.busy ? tr('可以下载源文件，继续用自己的工具编辑。', 'Download the source and continue in your own tools.') : tr('包含你修改过的内容和还没完成的练习素材。下载也会保留这些素材。', 'Includes your edits and unfinished starter material. Downloads retain both.')}
                </p>
                {firstUnfinished && (
                  <button className={styles.textButton} disabled={!ready || full.busy} onClick={() => select(firstUnfinished)}>
                    {tr('继续未完成练习：', 'Continue an unfinished lesson: ')}
                    {label(firstUnfinished)}
                    <ArrowRightIcon />
                  </button>
                )}
              </div>
              <button className={styles.secondary} onClick={download}>
                <DownloadIcon />
                {tr('只下载源文件', 'Source file only')}
              </button>
            </div>
            <div className={styles.fullControls}>
              <button className={styles.primary} onClick={downloadPackage} disabled={!ready || packing}>
                <DownloadIcon />
                {packing ? tr('正在打包…', 'Packaging…') : tr('下载练习包（含图片）', 'Download practice package with image')}
              </button>
              <p>{tr('发布时推荐使用练习包：包含当前草稿与面板图，已改为相对图片路径。单独下载源文件仍使用本站图片路径。', 'For publishing, use the package: your current draft and panel image with relative paths. The source-only download retains this site’s image paths.')}</p>
            </div>
            {packageError && <p role="alert">{tr('图片未能读取，练习包没有下载。请重试，或先下载源文件。', 'The image could not be loaded, so no package was downloaded. Retry or download the source file.')}</p>}
            {book.parts.some(p => p.id === 'legacy') && <p className={styles.material}>{tr('旧稿中未匹配到练习的内容也保留在这里。', 'Content from your earlier draft that did not match a lesson is preserved here too.')}</p>}
            <div className={styles.fullControls}>
              <div className={styles.tableModes} role="group" aria-label={tr('全文视图', 'Full document view')}>
                <button aria-pressed={fullView === 'preview'} onClick={() => setFullView('preview')}>{tr('阅读效果', 'Read')}</button>
                <button aria-pressed={fullView === 'source'} onClick={() => setFullView('source')}>{tr('完整源码', 'Source')}</button>
              </div>
              {fullView === 'preview' && (
                <label>
                  {tr('文档目录', 'Document outline')}
                  <select aria-label={tr('文档目录', 'Document outline')} value="" onChange={event => document.getElementById('markup-preview-' + event.target.value)?.scrollIntoView({ block: 'start' })}>
                    <option value="">{tr('跳到章节…', 'Jump to a section…')}</option>
                    {headings.map(h => <option key={h.id} value={h.id}>{h.title}</option>)}
                  </select>
                </label>
              )}
            </div>
            {fullView === 'source' ? <pre className={styles.completeSource}>{fullSource}</pre> : <div className={`${styles.paper} ${styles.fullPaper}`} onClick={previewClick}>{full.error ? <p role="alert">{tr('预览失败，请检查源码。', 'Preview failed. Check the source.')}</p> : <div dangerouslySetInnerHTML={{ __html: full.safe }} />}</div>}
            <button className={styles.secondary} onClick={() => route(format, step, 'lesson')}>
              <ArrowLeftIcon />
              {tr('回到当前练习', 'Back to the lesson')}
            </button>
          </section>
        )}
        {(panel === 'full' || (panel === 'lesson' && step !== 'intro')) && format === 'dita' && (
          <DitaPanel
            locale={locale}
            ready={ready}
            lesson={panel === 'full' ? 'project' : step}
            files={state.dita.files}
            onChange={(name, value) => {
              commit({ ...state, dita: { ...state.dita, files: { ...state.dita.files, [name]: value } } })
              setUndo(null)
            }}
            onDownload={download}
            onNext={nextLesson}
            completed={ditaCompleted}
            onContinue={firstUnfinished ? () => select(firstUnfinished) : undefined}
            saved={saved}
            passed={ditaPassed(state.dita.files, state.dita.receipts, step)}
            onComplete={(lesson, receipt) => commit({ ...state, dita: { ...state.dita, receipts: { ...state.dita.receipts, [lesson]: receipt } } })}
          />
        )}
        {panel === 'lesson' && step === 'intro' && (
          <CourseIntroduction locale={locale} format={format} ready={ready} onStart={() => select(format === 'dita' ? 'concept' : 'headings')} resumeLabel={resumeStep ? label(resumeStep) : undefined} onResume={() => resumeStep && select(resumeStep)} />
        )}
        {panel === 'lesson' && format !== 'dita' && step !== 'intro' && (
          <section className={styles.lesson}>
            <header className={styles.lessonHeader}>
              <span className={styles.eyebrow}>
                {names[syntax]}
                {' '}
                ·
                {' '}
                {tr('当前练习', 'Current lesson')}
              </span>
              <h2>{label(step)}</h2>
              <div className={styles.taskBrief}>
                <strong>{tr('这一节要做什么', 'Your task')}</strong>
                <p>{merging ? tr('把“物理备份”合并成跨两行的分类，让“通用规范”跨两列。删掉合并位置多余的单元格。', 'Span two rows for the physical backup category and two columns for the general policy. Remove the cells occupied by each span.') : task?.goal}</p>
                {step === 'note' && <p>{tr('练习从普通段落开始；加上提示标记后，效果区会出现带色块和边线的提示区域。', 'The exercise starts with plain text. Adding the markup creates a tinted callout in the preview.')}</p>}
                {step === 'xref' && <p>{tr('点击预览中的页内链接，会打开整份说明并跳到目标章节。', 'A section link opens its destination in the complete guide.')}</p>}
              </div>
              <SyntaxReference locale={locale} format={syntax} lesson={step} detail={task?.hint[syntax]} />
              {step === 'table' && (
                <button className={styles.textButton} onClick={() => select('table-spans')}>
                  {tr('需要跨行或跨列？进入“合并单元格”练习', 'Need row or column spans? Try the merged-cell lesson')}
                  <ArrowRightIcon />
                </button>
              )}
            </header>
            {!part && (
              <div className={styles.material}>
                <span>{tr('这份草稿还没有本节内容。添加素材会保留已有文字。', 'This section is not in your draft yet. Add it without replacing your writing.')}</span>
                <button className={styles.secondary} disabled={!ready || fullSource.length + initial.length > 39998} onClick={() => replacePart(initial)}>{tr('添加本节素材', 'Add this section')}</button>
              </div>
            )}
            <div className={styles.mobileTabs} role="group" aria-label={tr('练习视图', 'Lesson view')}>
              <button aria-pressed={mobileView === 'source'} onClick={() => setMobileView('source')}>{tr('编辑', 'Edit')}</button>
              <button aria-pressed={mobileView === 'preview'} onClick={() => setMobileView('preview')}>{tr('效果', 'Result')}</button>
            </div>
            <div className={styles.workspace} data-view={mobileView} data-empty={!part || undefined}>
              <section className={styles.editorPane} aria-label={tr('当前段落', 'Current section')}>
                <div className={styles.paneHeader}>
                  <label htmlFor="markup-source">{tr('练习编辑区', 'Exercise editor')}</label>
                  <span>{tr('只编辑这一段', 'Just this section')}</span>
                </div>
                <p className={styles.editorNotice}>{!part ? tr('先添加本节素材，再按上方任务练习。', 'Add this section to start the exercise.') : source === initial ? tr('这是待修改的素材。按上方任务补上标记，再点击“检查这段”。', 'This is starter material. Add the markup described above, then check your work.') : tr('这是当前保存的草稿，可以继续修改。需要重新练习，可在下方恢复素材。', 'This is your saved draft. Keep editing, or restore the starter below to try again.')}</p>
                <SourceEditor value={source} focusKey={format + step} ready={ready && !!part} label={tr('当前段落编辑区', 'Current section editor')} maxLength={Math.max(source.length, 40000 - fullSource.length + source.length)} onChange={edit} />
              </section>
              <section className={styles.previewPane} aria-label={tr('本节效果', 'Section result')} aria-busy={current.busy}>
                <div className={styles.paneHeader}>
                  <span>{tr('这段的效果', 'This section’s result')}</span>
                  <span>{names[syntax]}</span>
                </div>
                <div className={styles.paper} onClick={previewClick}>{current.error ? <p role="alert">{tr('这段内容暂时无法预览，请检查写法。', 'This section could not be previewed. Check its syntax.')}</p> : current.busy ? <p>{tr('正在更新…', 'Updating…')}</p> : source ? <div dangerouslySetInnerHTML={{ __html: current.safe }} /> : <p>{tr('写一点内容，效果就会显示在这里。', 'Write something to see the result here.')}</p>}</div>
              </section>
            </div>
            <div className={styles.lessonActions}>
              <div className={styles.actions}>
                <button
                  className={styles.primary}
                  disabled={!part || full.busy || full.error}
                  onClick={() => {
                    changeBook({ ...book, checked: book.checked.includes(step) ? book.checked : [...book.checked, step] })
                    setCheckAttempt(n => n + 1)
                  }}
                >
                  {tr('检查这段', 'Check this section')}
                </button>
                <button className={styles.secondary} aria-expanded={help === 'reference'} onClick={() => setHelp(help === 'reference' ? null : 'reference')}>{tr('看参考答案', 'Reference answer')}</button>
                <button className={styles.textButton} aria-expanded={help === 'compare'} onClick={() => setHelp(help === 'compare' ? null : 'compare')}>
                  {tr('对照', 'Compare')}
                  {' '}
                  {names[other]}
                </button>
              </div>
              <span className={styles.saveNote} role="status">{!ready ? tr('正在载入…', 'Loading…') : saved ? tr('自动保存在此浏览器', 'Saved in this browser') : tr('浏览器无法保存，请及时下载。', 'Storage unavailable. Download your work.')}</span>
            </div>
            {checked && <CheckFeedback locale={locale} success={success} checks={selectedChecks} attempt={checkAttempt} onNext={nextLesson} nextLabel={index >= lessonIds.length - 1 ? tr('查看完整成果', 'View your complete work') : tr('继续：', 'Next: ') + label(lessonIds[index + 1]!)} />}
            {help && (
              <div className={styles.help}>
                <div>
                  <strong>{help === 'reference' ? tr('本题参考答案', 'Reference answer for this exercise') : names[other]}</strong>
                  <button className={styles.textButton} onClick={() => setHelp(null)}>{tr('收起', 'Close')}</button>
                </div>
                <pre><code>{help === 'reference' ? answer : merging ? spanSource(locale, other) : task?.answer[other]}</code></pre>
                {help === 'reference' && <button className={styles.secondary} onClick={() => replacePart(answer)}>{tr('把参考写法填入这一段', 'Use this reference in the section')}</button>}
              </div>
            )}
            <details className={styles.draftTools}>
              <summary>{tr('重新练习这一段', 'Start this section again')}</summary>
              <p>{tr('只替换当前段落，可以撤销。', 'Only this section is replaced. You can undo it.')}</p>
              <button className={styles.secondary} onClick={() => replacePart(initial)}>{tr('恢复本节素材', 'Restore the starter')}</button>
            </details>
          </section>
        )}
        {panel === 'full' && <CourseHandoff locale={locale} format={format} />}
        {undo && undo.format === format && (
          <button
            className={styles.secondary}
            onClick={() => {
              commit(undo.previous)
              setUndo(null)
            }}
          >
            <ResetIcon />
            {tr('撤销刚才的替换', 'Undo replacement')}
          </button>
        )}
        {panel === 'lesson' && step !== 'intro' && (
          <footer className={styles.navigation}>
            <button className={styles.textButton} disabled={index <= 0} onClick={() => select(lessonIds[index - 1]!)}>
              <ArrowLeftIcon />
              {tr('上一项', 'Previous')}
            </button>
            <button className={styles.secondary} disabled={!ready} onClick={() => index >= lessonIds.length - 1 ? route(format, step, 'full') : select(lessonIds[index + 1]!)}>
              {index >= lessonIds.length - 1 ? tr('查看完整成果', 'View your complete work') : tr('下一项', 'Next')}
              <ArrowRightIcon />
            </button>
          </footer>
        )}
      </div>
    </div>
  )
}
