import React, { useEffect, useRef, useState } from 'react'
import { CodeIcon, FileTextIcon, LightningBoltIcon } from '@radix-ui/react-icons'
import styles from './styles.module.css'

export type Locale = 'zh' | 'en'

interface MarkupParadigmMatrixProps {
  locale?: Locale
}

type Text = [string, string]

// lean: -2 rich text clearly stronger · -1 slightly · 0 trade-off · +1 Docs-as-Code slightly · +2 clearly stronger
type Lean = -2 | -1 | 0 | 1 | 2

type Row = {
  dimension: Text
  lean: Lean
  richText: Text
  docsAsCode: Text
}

const ROWS: Row[] = [
  {
    dimension: ['即写即存', 'Instant save'],
    lean: -2,
    richText: ['打开即改，自动保存，改完即可分享。', 'Edit in place; changes save automatically and are ready to share.'],
    docsAsCode: ['改完需提交并推送，经构建后才能上线。', 'Commit, push, and build before changes go live.'],
  },
  {
    dimension: ['修改追溯', 'Change tracking'],
    lean: 2,
    richText: ['版本按文件保存，定位某一段较难。', 'Versions are saved per file, so finding one changed paragraph is hard.'],
    docsAsCode: ['版本库精确到行，能看到谁在何时改了哪句。', 'Version control records each change line by line, with author and date.'],
  },
  {
    dimension: ['评审', 'Review'],
    lean: 1,
    richText: ['批注与修订，靠人工逐处核对。', 'Comments and tracked changes, checked by hand.'],
    docsAsCode: ['合并请求评审，意见与改动同存。', 'Pull request review keeps comments and changes together.'],
  },
  {
    dimension: ['样式', 'Styling'],
    lean: 2,
    richText: ['样式分散在每个文件里，改版要逐份调整。', 'Styles live in each file; a redesign means editing every file.'],
    docsAsCode: ['主题统一管理，改一处全站生效。', 'A shared theme controls styles, so one change applies across the site.'],
  },
  {
    dimension: ['复用同一段内容', 'Reusing a passage'],
    lean: 1,
    richText: ['复制粘贴，副本容易不一致。', 'Copy and paste; copies drift apart.'],
    docsAsCode: ['通过片段或变量引用，具体能力取决于标记语言。', 'Shared snippets or variables; capability depends on the markup language.'],
  },
  {
    dimension: ['自动检查', 'Automated checks'],
    lean: 2,
    richText: ['以拼写与语法检查为主。', 'Mostly spelling and grammar checks.'],
    docsAsCode: ['流水线可运行死链、术语与构建检查。', 'Pipelines can run link, terminology, and build checks.'],
  },
  {
    dimension: ['上手成本', 'Learning curve'],
    lean: -2,
    richText: ['低，接近日常办公。', 'Low, close to everyday office work.'],
    docsAsCode: ['需要熟悉 Git 与纯文本语法。', 'Needs Git and plain-text syntax.'],
  },
]

const BEST_FIT = {
  richText: ['会议纪要、行政通知、一次性草稿。', 'Meeting notes, admin notices, one-off drafts.'] as Text,
  docsAsCode: ['架构规范、接口契约、长期维护的手册。', 'Architecture specs, API contracts, and long-lived manuals.'] as Text,
}

// Marker position across the track: 50% is the centre, ±2 sits 6% from each end.
const position = (lean: Lean) => 50 + lean * 22

function toneOf(lean: Lean) {
  if (lean < 0) return 'rich'
  if (lean > 0) return 'dac'
  return 'even'
}

function leanLabel(lean: Lean, locale: Locale) {
  if (lean === 0) return locale === 'zh' ? '各有取舍' : 'Trade-off'
  const strong = Math.abs(lean) === 2
  if (locale === 'zh') {
    const side = lean < 0 ? '富文本' : 'Docs-as-Code'
    return `${side}${strong ? '明显更强' : '略强'}`
  }
  const side = lean < 0 ? 'Rich text' : 'Docs-as-Code'
  return `${side} ${strong ? 'clearly stronger' : 'slightly stronger'}`
}

export default function MarkupParadigmMatrix({ locale = 'zh' }: MarkupParadigmMatrixProps) {
  const pick = (pair: Text) => (locale === 'zh' ? pair[0] : pair[1])
  const tr = (zh: string, en: string) => (locale === 'zh' ? zh : en)
  const wrapRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  // Markers start at the centre and travel to their lean once the section is on screen.
  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={wrapRef}
      className={`${styles.wrap} ${inView ? styles.inView : ''}`}
      aria-label={tr('富文本与纯文本标记的对照', 'Rich text versus plain-text markup comparison')}
    >
      <div className={styles.intro}>
        <span className={styles.badge}>
          <LightningBoltIcon aria-hidden="true" />
          <span>{tr('工程选型对照', 'Engineering Tradeoffs')}</span>
        </span>
        <p className={styles.lead}>
          {tr(
            '富文本适合即写即存的日常办公记录，Docs-as-Code 则让技术文档具备版本控制、自动化校验与持续集成能力。',
            'Rich text suits quick office notes, while Docs-as-Code brings version control, automated checks, and CI to technical docs.',
          )}
        </p>
      </div>

      <div className={styles.legend} aria-hidden="true">
        <span className={styles.legendRich}>
          <FileTextIcon />
          <span>{tr('富文本（Word、在线文档）', 'Rich text (Word, online docs)')}</span>
        </span>
        <span className={styles.legendMid}>{tr('倾向', 'Lean')}</span>
        <span className={styles.legendDac}>
          <CodeIcon />
          <span>{tr('纯文本 + Docs-as-Code', 'Plain text + Docs-as-Code')}</span>
        </span>
      </div>

      <ol className={styles.list}>
        {ROWS.map((row, index) => {
          const pos = position(row.lean)
          const fillLeft = row.lean < 0 ? pos : 50
          const fillWidth = Math.abs(pos - 50)
          return (
            <li
              key={row.dimension[0]}
              className={`${styles.row} ${styles[toneOf(row.lean)]}`}
              style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
            >
              <div className={styles.head}>
                <span className={styles.name}>{pick(row.dimension)}</span>
                <span className={styles.pill}>{leanLabel(row.lean, locale)}</span>
              </div>
              <div className={styles.body}>
                <p className={styles.left}>
                  <span className={styles.srOnly}>{tr('富文本：', 'Rich text: ')}</span>
                  {pick(row.richText)}
                </p>
                <div className={styles.track} aria-hidden="true">
                  <span
                    className={styles.fill}
                    style={{ '--fl': `${fillLeft}%`, '--fw': `${fillWidth}%` } as React.CSSProperties}
                  />
                  <span className={styles.marker} style={{ '--pos': `${pos}%` } as React.CSSProperties} />
                </div>
                <p className={styles.right}>
                  <span className={styles.srOnly}>{tr('纯文本 + Docs-as-Code：', 'Plain text + Docs-as-Code: ')}</span>
                  {pick(row.docsAsCode)}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className={styles.verdicts}>
        <div className={`${styles.verdict} ${styles.rich}`}>
          <p className={styles.verdictTitle}>
            <FileTextIcon aria-hidden="true" />
            <span>{tr('富文本', 'Rich text')}</span>
          </p>
          <p className={styles.verdictLabel}>{tr('适合', 'Best for')}</p>
          <p className={styles.verdictText}>{pick(BEST_FIT.richText)}</p>
        </div>
        <div className={`${styles.verdict} ${styles.dac}`}>
          <p className={styles.verdictTitle}>
            <CodeIcon aria-hidden="true" />
            <span>{tr('纯文本 + Docs-as-Code', 'Plain text + Docs-as-Code')}</span>
          </p>
          <p className={styles.verdictLabel}>{tr('适合', 'Best for')}</p>
          <p className={styles.verdictText}>{pick(BEST_FIT.docsAsCode)}</p>
        </div>
      </div>

      <p className={styles.note}>
        {tr(
          '两者解决的是不同问题。选型取决于文档要保存多久、由谁协作修改，而不是哪一种更先进。',
          'The two solve different problems. Choose by how long a document must live and who edits it, not by which is newer.',
        )}
      </p>
    </section>
  )
}
