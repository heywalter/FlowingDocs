import React, { useEffect, useMemo, useState } from 'react'
import type { Locale } from './course'
import { ditaProject, ditaExerciseAnswer } from './dita'
import SourceEditor from './SourceEditor'
import SyntaxReference from './SyntaxReference'
import CheckFeedback from './CheckFeedback'
import { changedText, ditaFile, ditaFingerprint, reorderedTopics } from './ditaProgress'
import { DownloadIcon } from '@radix-ui/react-icons'
import styles from './styles.module.css'

export function ditaLabels(locale: Locale): Record<string, string> {
  return locale === 'zh' ? { concept: '概念：解释存储引擎', task: '任务：写出步骤', reference: '参考：整理参数表', map: '用 map 组成说明书', reuse: '同一主题，多处使用', oxygen: '在 Oxygen 中继续' } : { concept: 'Concept: explain storage engines', task: 'Task: write the steps', reference: 'Reference: parameter table', map: 'Build a guide with a map', reuse: 'Reuse a shared topic', oxygen: 'Continue in Oxygen' }
}
function parseXML(source: string): Document | null {
  if (typeof DOMParser === 'undefined' || /<!ENTITY/i.test(source)) return null
  const doc = new DOMParser().parseFromString(source, 'application/xml')
  return doc.querySelector('parsererror') ? null : doc
}
// Render only the teaching subset as React nodes; XML never becomes executable HTML.
function content(node: Node, key = 'root'): React.ReactNode {
  if (node.nodeType === 3) return node.textContent
  if (node.nodeType !== 1) return null
  const el = node as Element
  const children = Array.from(el.childNodes).filter(child => !['simpletable', 'sthead', 'strow'].includes(el.tagName) || child.nodeType !== 3 || !!child.textContent?.trim()).map((child, i) => content(child, key + '-' + i))
  switch (el.tagName) {
    case 'title': return <h3 key={key}>{children}</h3>
    case 'p': case 'cmd': case 'shortdesc': return <p key={key}>{children}</p>
    case 'steps': case 'ol': return <ol key={key}>{children}</ol>
    case 'ul': return <ul key={key}>{children}</ul>
    case 'step': case 'li': return <li key={key}>{children}</li>
    case 'b': return <strong key={key}>{children}</strong>
    case 'i': return <em key={key}>{children}</em>
    case 'codeph': return <code key={key}>{children}</code>
    case 'note': return <blockquote key={key}>{children}</blockquote>
    case 'simpletable': return <table key={key}><tbody>{children}</tbody></table>
    case 'sthead': case 'strow': return <tr key={key}>{children}</tr>
    case 'stentry': return el.parentElement?.tagName === 'sthead' ? <th key={key}>{children}</th> : <td key={key}>{children}</td>
    case 'concept': case 'task': case 'reference': case 'conbody': case 'taskbody': case 'refbody': return <React.Fragment key={key}>{children}</React.Fragment>
    default: return null
  }
}
export default function DitaPanel({ locale, lesson, files, ready, onChange, onDownload, onNext, onComplete, passed, completed, onContinue, saved }: {
  locale: Locale
  lesson: string
  files: Record<string, string>
  ready: boolean
  onChange: (name: string, source: string) => void
  onDownload: () => void
  onNext: () => void
  onComplete: (lesson: string, receipt: string) => void
  passed: boolean
  completed: number
  onContinue?: () => void
  saved: boolean
}) {
  const tr = (zh: string, en: string) => locale === 'zh' ? zh : en
  const [mapName, setMapName] = useState('quickstart.ditamap')
  const [reference, setReference] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const [checked, setChecked] = useState('')
  const [viewedMaps, setViewedMaps] = useState<string[]>([])
  const [view, setView] = useState('source')
  const [undo, setUndo] = useState<{ name: string, source: string } | null>(null)
  useEffect(() => {
    setReference(false)
    setChecked('')
    setAttempt(0)
    setView('source')
    setViewedMaps([])
    setUndo(null)
  }, [lesson])
  const name = ditaFile(lesson)
  const source = files[name]!
  useEffect(() => {
    // Count the map actually visible after an edit; mobile source mode is not a view.
    if (ready && lesson === 'reuse' && (view === 'preview' || window.matchMedia('(min-width: 651px)').matches)) {
      const visible = mapName.replace('.ditamap', '')
      setViewedMaps(previous => previous.includes(visible) ? previous : [...previous, visible])
    }
  }, [ready, lesson, source, mapName, view])
  const project = ditaProject(locale)
  const answer = ditaExerciseAnswer(locale, lesson)
  const doc = useMemo(() => ready ? parseXML(source) : null, [source, ready])
  const root = doc?.documentElement
  const map = parseXML(files[lesson === 'map' ? 'guide.ditamap' : mapName]!)
  const refs = Array.from(map?.querySelectorAll('topicref') ?? []).map(el => el.getAttribute('href') || '')
  const mapLesson = ['map', 'reuse', 'project'].includes(lesson)
  const errors: string[] = []
  if (!doc) errors.push(tr('XML 还不能解析。检查标签是否成对闭合；本练习不支持自定义实体。', 'The XML cannot be parsed. Check matching tags; custom entities are not supported here.'))
  else {
    const expected = name.endsWith('.ditamap') ? 'map' : name === 'start-service.dita' ? 'task' : name === 'parameters.dita' ? 'reference' : 'concept'
    if (root?.tagName !== expected) errors.push(tr('根元素应为 ', 'The root element must be ') + '<' + expected + '>.')
    if (!root?.querySelector('title')?.textContent?.trim()) errors.push(tr('补上非空标题。', 'Add a nonempty title.'))
    if (expected !== 'map' && !root?.getAttribute('id')) errors.push(tr('主题需要 id。', 'The topic needs an id.'))
    if (expected === 'concept' && !root?.querySelector('conbody > p')?.textContent?.trim()) errors.push(tr('在 conbody 中写一段解释。', 'Add an explanation in conbody.'))
    if (expected === 'task' && (!root?.querySelectorAll('steps > step > cmd').length || Array.from(root.querySelectorAll('step')).some(el => !el.querySelector('cmd')?.textContent?.trim()))) errors.push(tr('每个 step 中都要有非空的 cmd 操作。', 'Each step needs a nonempty cmd instruction.'))
    if (expected === 'reference' && !root?.querySelector('simpletable > strow')) errors.push(tr('在参考主题中保留参数表的数据行。', 'Keep at least one data row in the parameters table.'))
    if (expected === 'map' && (!refs.length || refs.some(href => !files[href]))) errors.push(tr('map 需要引用项目中实际存在的主题文件。', 'The map must reference topic files in this project.'))
  }
  const original = parseXML(project.files[name]!)
  const texts = (document: Document | null, selector: string) => Array.from(document?.querySelectorAll(selector) ?? []).map(el => el.textContent || '')
  const taskErrors: string[] = []
  if (lesson === 'concept' && !changedText(texts(doc, 'conbody > p'), texts(original, 'conbody > p'))) taskErrors.push(tr('改写 conbody 中的一段解释；只修改空格不算完成。', 'Rewrite a conbody paragraph; whitespace-only edits do not complete the task.'))
  if (['task', 'reuse'].includes(lesson) && !changedText(texts(doc, 'steps > step > cmd'), texts(original, 'steps > step > cmd'))) taskErrors.push(tr('修改至少一项 cmd 操作的文字。', 'Change the text of at least one cmd instruction.'))
  if (lesson === 'reference' && !changedText(texts(doc, 'simpletable > strow > stentry'), texts(original, 'simpletable > strow > stentry'))) taskErrors.push(tr('修改参数表中至少一项说明。', 'Change at least one entry in the parameter table.'))
  if (lesson === 'map') {
    const originalRefs = Array.from(original?.querySelectorAll('topicref') ?? []).map(el => el.getAttribute('href') || '')
    if (!reorderedTopics(refs, originalRefs)) taskErrors.push(tr('保留全部三个主题，交换其中两个的顺序。', 'Keep all three topics and change their order.'))
  }
  if (lesson === 'reuse') {
    if (!project.maps.every(item => parseXML(files[item.id + '.ditamap']!)?.querySelector('topicref[href="start-service.dita"]'))) taskErrors.push(tr('两份 map 都需要引用 start-service.dita。', 'Both maps must reference start-service.dita.'))
    if (!passed && !project.maps.every(item => viewedMaps.includes(item.id))) taskErrors.push(tr('修改后，分别打开“快速上手”和“完整运维手册”，确认共享步骤都已更新。', 'After editing, open both Quick start and Full operations guide to inspect the shared steps.'))
  }
  const allErrors = [...errors, ...taskErrors]
  const descriptions: Record<string, string> = {
    concept: tr('在 conbody 中改写存储引擎介绍，解释 InnoDB 与 MyISAM 的区别。', 'Edit the conbody paragraphs to explain InnoDB and MyISAM.'),
    task: tr('修改一个 cmd 中的操作，保留 steps → step → cmd 的结构。', 'Edit an instruction inside cmd. Keep the steps → step → cmd structure.'),
    reference: tr('在 simpletable 中改写一项参数说明，观察行和列怎样组织。', 'Edit a parameter description in simpletable and see how its rows are organized.'),
    map: tr('交换两个 topicref 的顺序，右侧的手册也会重新排列。', 'Swap two topicref entries and watch the guide reorder alongside the source.'),
    reuse: tr('修改“初始化并启动服务”中的一个步骤，再切换两本手册，看看它们怎样使用同一份主题。', 'Edit a service initialization step, then switch between the two guides to see the same topic in both.'),
  }
  function edit(value: string) {
    onChange(name, value)
    setChecked('')
    setAttempt(0)
    setViewedMaps([])
    setUndo(null)
  }
  function restore(value: string) {
    setUndo({ name, source })
    onChange(name, value)
    setChecked('')
    setAttempt(0)
    setViewedMaps([])
  }
  function assembled() {
    if (!map || !refs.length) return <p role="alert">{tr('map 暂时无法解析，或还没有引用主题。', 'The map cannot be parsed or contains no topic references.')}</p>
    return refs.map((href, i) => {
      const topic = files[href] ? parseXML(files[href]!) : null
      return (
        <section key={href + i} className={styles.assembledTopic}>
          <small>{href}</small>
          {topic
            ? content(topic.documentElement)
            : (
                <p role="alert">
                  {tr('主题不存在或 XML 无法解析：', 'Missing or invalid topic: ')}
                  {href}
                </p>
              )}
        </section>
      )
    })
  }
  if (lesson === 'oxygen') return (
    <section className={styles.ditaTools}>
      <span className={styles.eyebrow}>DITA · Oxygen</span>
      <h2>{tr('把这组主题带到 Oxygen', 'Take these topics into Oxygen')}</h2>
      <p>{tr('这里练习了主题和 map 的关系。Oxygen 可以继续做可视化编辑、完整校验和发布。', 'You have explored topics and maps. Continue in Oxygen for visual authoring, full validation, and publishing.')}</p>
      <SyntaxReference locale={locale} format="dita" lesson="oxygen" />
      <ol>
        <li>{tr('下载当前项目并解压，在 DITA Maps Manager 中打开 guide.ditamap。', 'Download and extract the current project. Open guide.ditamap in DITA Maps Manager.')}</li>
        <li>{tr('打开 start-service.dita，在 Author 视图中查看刚才改过的步骤。', 'Open start-service.dita in Author mode to see the steps you edited.')}</li>
        <li>{tr('运行校验，修正提示的问题，再选择 HTML5 发布场景。', 'Validate, resolve any reported problems, then select an HTML5 transformation scenario.')}</li>
        <li>{tr('打开 quickstart.ditamap，确认它也使用同一份主题。', 'Open quickstart.ditamap and confirm that it uses the same shared topic.')}</li>
      </ol>
      <button className={styles.primary} onClick={onDownload}>
        <DownloadIcon />
        {tr('下载我的 DITA 项目', 'Download my DITA project')}
      </button>
      <p className={styles.scope}>
        <a href="https://www.oxygenxml.com/xml_author/dita_editor.html">{tr('Oxygen 官方 DITA 指引', 'Oxygen DITA documentation')}</a>
        {' '}
        ·
        {' '}
        <a href="https://www.dita-ot.org/">DITA-OT</a>
      </p>
    </section>
  )
  if (lesson === 'project') return (
    <section className={styles.fullDocument}>
      <div className={styles.fullHeading}>
        <div>
          <span className={styles.eyebrow}>DITA</span>
          <h2>{tr('同一组主题，两本运维手册', 'Shared topics, two operations guides')}</h2>
          <p>{completed === 5 ? tr('五项练习已完成。', 'All five exercises are complete. ') : tr('当前项目草稿，已通过 ', 'Current project draft: ') + completed + '/5' + tr('。包含未完成的示例素材。', ' passed. Includes unfinished starter material.')}</p>
          {onContinue && <button className={styles.textButton} onClick={onContinue}>{tr('继续未完成练习', 'Continue an unfinished lesson')}</button>}
          <p>{tr('切换目录查看组装结果，下载包包含你修改过的全部主题和 map。', 'Switch maps to read each guide. The download includes all your edited topics and maps.')}</p>
        </div>
        <button className={styles.secondary} onClick={onDownload}>
          <DownloadIcon />
          {tr('下载项目', 'Download project')}
        </button>
      </div>
      <div className={styles.tableModes} role="group" aria-label={tr('说明书', 'Guide')}>
        {project.maps.map(item => (
          <button
            key={item.id}
            aria-pressed={mapName === item.id + '.ditamap'}
            onClick={() => {
              setMapName(item.id + '.ditamap')
              setViewedMaps(previous => previous.includes(item.id) ? previous : [...previous, item.id])
            }}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className={`${styles.paper} ${styles.fullPaper}`}>{assembled()}</div>
    </section>
  )
  return (
    <section className={styles.lesson}>
      <header className={styles.lessonHeader}>
        <span className={styles.eyebrow}>
          DITA ·
          {tr('当前练习', 'Current lesson')}
        </span>
        <h2>{ditaLabels(locale)[lesson]}</h2>
        <div className={styles.taskBrief}>
          <strong>{tr('这一节要做什么', 'Your task')}</strong>
          <p>{descriptions[lesson]}</p>
        </div>
        <SyntaxReference locale={locale} format="dita" lesson={lesson} />
      </header>
      <div className={styles.mobileTabs} role="group" aria-label={tr('练习视图', 'Lesson view')}>
        <button aria-pressed={view === 'source'} onClick={() => setView('source')}>{tr('编辑', 'Edit')}</button>
        <button aria-pressed={view === 'preview'} onClick={() => setView('preview')}>{tr('效果', 'Result')}</button>
      </div>
      <div className={styles.workspace} data-view={view}>
        <section className={styles.editorPane}>
          <div className={styles.paneHeader}>
            <label htmlFor="markup-source">{name}</label>
            <span>XML</span>
          </div>
          <p className={styles.editorNotice}>{tr('这是可编辑的示例素材，请按上方任务修改 XML。', 'This is an editable example. Change the XML as described above.')}</p>
          <SourceEditor value={source} focusKey={lesson} ready={ready} label={tr('DITA 源码编辑区', 'DITA source editor')} maxLength={12000} onChange={edit} />
        </section>
        <section className={styles.previewPane} aria-label={tr('DITA 教学预览', 'DITA teaching preview')}>
          <div className={styles.paneHeader}>
            <span>{mapLesson ? tr('组装后的说明', 'Assembled guide') : tr('主题效果', 'Topic result')}</span>
            <span>{tr('教学预览', 'Teaching preview')}</span>
          </div>
          {lesson === 'reuse' && (
            <div className={styles.mapChoices}>
              {project.maps.map(item => (
                <button
                  className={styles.textButton}
                  key={item.id}
                  aria-pressed={mapName === item.id + '.ditamap'}
                  onClick={() => {
                    setMapName(item.id + '.ditamap')
                    setViewedMaps(previous => previous.includes(item.id) ? previous : [...previous, item.id])
                  }}
                >
                  {item.title}
                </button>
              ))}
            </div>
          )}
          <div className={styles.paper}>{!ready ? <p>{tr('正在载入…', 'Loading…')}</p> : !doc ? <p role="alert">{errors[0]}</p> : mapLesson ? assembled() : content(doc.documentElement)}</div>
        </section>
      </div>
      <div className={styles.actions}>
        <button
          className={styles.primary}
          disabled={!ready}
          onClick={() => {
            if (!allErrors.length) onComplete(lesson, ditaFingerprint(files, lesson))
            setChecked(lesson)
            setAttempt(n => n + 1)
          }}
        >
          {tr('检查本节任务', 'Check this task')}
        </button>
        <button className={styles.secondary} aria-expanded={reference} onClick={() => setReference(!reference)}>{tr('看参考答案', 'Reference answer')}</button>
      </div>
      <p className={styles.saveNote} role="status">{saved ? tr('自动保存在此浏览器', 'Saved in this browser') : tr('浏览器无法保存，请及时下载项目。', 'Storage unavailable. Download your project.')}</p>
      {checked === lesson && !errors.length && taskErrors.length > 0 && <p className={styles.structureNotice} role="status">{tr('基本结构检查通过；还需要完成下面的操作。', 'Basic structure checks passed; the actions below are still needed.')}</p>}
      {checked === lesson && <CheckFeedback locale={locale} success={!allErrors.length} checks={allErrors.map(message => ({ ok: false, message }))} attempt={attempt} onNext={onNext} />}
      {reference && (
        <div className={styles.help}>
          <pre><code>{answer}</code></pre>
          <button className={styles.secondary} onClick={() => restore(answer)}>{tr('把参考写法填入这一份文件', 'Use this reference in the file')}</button>
        </div>
      )}
      {undo?.name === name && (
        <button
          className={styles.textButton}
          onClick={() => {
            onChange(undo.name, undo.source)
            setUndo(null)
          }}
        >
          {tr('撤销替换', 'Undo replacement')}
        </button>
      )}
      <p className={styles.scope}>{tr('预览支持本课程使用的常用元素，不执行 XML 中的代码，也不读取外部文件。它不能替代完整的 DITA 校验或发布。', 'This preview supports the elements used in these lessons. It does not execute code or read external files, and does not replace full DITA validation or publishing.')}</p>
    </section>
  )
}
