import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons'
import type { Locale } from './model'
import styles from './AssemblyLoop.module.css'

type Props = { locale: Locale }

type Wires = {
  width: number
  height: number
  toGenerator: string
  toOutput: string
}

// Time spent on each step. Step 0 resets the stage; steps 1–5 tell the story.
const DURATIONS = [900, 2400, 3200, 2400, 2400, 3400]
const LAST_STEP = DURATIONS.length - 1
const SEGMENTS = [0, 1, 2, 3]

const COPY = {
  zh: {
    label: '网站生成过程',
    eyebrow: '生成流程 · 可分步查看或播放一次',
    summary: '内容、结构、主题分别维护。静态生成器在构建时把它们装配成普通 HTML，读者直接读取这些页面。修改后需要重新构建并发布；是否支持增量构建取决于工具和配置。',
    tagContent: '内容 · Markdown',
    tagStructure: '结构 · 侧边栏',
    tagTheme: '主题 · 配置',
    brand: '品牌色',
    tagGenerator: '静态生成器',
    steps: ['解析 Markdown', '计算侧边栏与路由', '装配主题', '预渲染 HTML'],
    status: ['待命', '待命', '装配中', '已完成', '已完成', '重新生成'],
    titleOld: 'MySQL 服务运维指南',
    titleNew: 'MySQL 运维手册',
    tree: ['├ 实例初始化', '├ 存储引擎', '└ 故障排查'],
    body: '初始化数据库前，核实数据目录权限与 3306 端口占用。',
    url: 'example.com/docs/install',
    unchanged: '未变化',
    updated: '已更新',
    captions: [
      '内容、结构、主题分开维护，都是纯文本或配置文件。',
      '生成器在构建时把三者装配到一起，而不是在访问时拼装。',
      '输出的是普通 HTML 文件，可以直接托管。',
      '读者打开的是已经装配好的页面。',
      '修改后重新生成，再发布新版本。示意图只高亮内容发生变化的页面。',
    ],
    reduced: '源文件经生成器装配为静态页面，读者直接读取；修改后需要重新生成并发布。',
    pause: '暂停',
    play: '播放',
  },
  en: {
    label: 'Assembly process explainer',
    eyebrow: 'The generation process · choose a step or play once',
    summary: 'Content, structure, and theme are maintained separately. The static generator assembles them into plain HTML at build time, and readers open those pages directly. After editing, rebuild and publish. Incremental build support depends on the tool and configuration.',
    tagContent: 'Content · Markdown',
    tagStructure: 'Structure · sidebar',
    tagTheme: 'Theme · config',
    brand: 'Brand color',
    tagGenerator: 'Static generator',
    steps: ['Parse Markdown', 'Resolve sidebar and routes', 'Assemble theme', 'Pre-render HTML'],
    status: ['Idle', 'Idle', 'Assembling', 'Done', 'Done', 'Rebuild'],
    titleOld: 'MySQL Operations Guide',
    titleNew: 'MySQL Operations Handbook',
    tree: ['├ Instance setup', '├ Storage engines', '└ Troubleshooting'],
    body: 'Check data directory permissions and port 3306 before you initialize the database.',
    url: 'example.com/docs/install',
    unchanged: 'Unchanged',
    updated: 'Updated',
    captions: [
      'Content, structure, and theme live in separate plain-text or config files.',
      'The generator assembles all three at build time instead of when a reader visits.',
      'The output is plain HTML that any static host can serve.',
      'Readers open pages that are already assembled.',
      'After editing, rebuild and publish. The diagram highlights changed content, not the scope of the actual build.',
    ],
    reduced: 'Sources are assembled into static pages that readers open directly. After editing, rebuild and publish.',
    pause: 'Pause',
    play: 'Play',
  },
}

const SWATCHES = ['#6654d9', '#087f78', '#334155']
const FILES = [
  { name: 'index.html', updated: false },
  { name: 'install.html', updated: true },
  { name: 'storage.html', updated: false },
]

// Smooth S-curve between two points, used for the connectors.
function curve(x1: number, y1: number, x2: number, y2: number) {
  const mid = (x2 - x1) / 2
  return `M${x1} ${y1} C${x1 + mid} ${y1} ${x2 - mid} ${y2} ${x2} ${y2}`
}

export default function AssemblyLoop({ locale }: Props) {
  const c = COPY[locale]
  const [step, setStep] = useState(4)
  const [paused, setPaused] = useState(true)
  const [reduced, setReduced] = useState(false)
  const [wires, setWires] = useState<Wires | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const sourceRef = useRef<HTMLDivElement>(null)
  const generatorRef = useRef<HTMLDivElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => {
      setReduced(query.matches)
      if (query.matches) setStep(LAST_STEP)
    }
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    if (paused || reduced) return
    const timer = window.setTimeout(() => {
      if (step === LAST_STEP) setPaused(true)
      else setStep(step + 1)
    }, DURATIONS[step])
    return () => window.clearTimeout(timer)
  }, [step, paused, reduced])

  // Connectors are measured from the real layout, so they follow the columns at any width.
  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const measure = () => {
      const base = stage.getBoundingClientRect()
      const source = sourceRef.current?.getBoundingClientRect()
      const generator = generatorRef.current?.getBoundingClientRect()
      const output = outputRef.current?.getBoundingClientRect()
      if (!source || !generator || !output || Math.abs(generator.left - source.left) < 20) {
        setWires(null)
        return
      }
      const sourceY = source.top + source.height / 2 - base.top
      const generatorY = generator.top + generator.height / 2 - base.top
      const outputY = output.top + output.height / 2 - base.top
      setWires({
        width: base.width,
        height: base.height,
        toGenerator: curve(source.right - base.left, sourceY, generator.left - base.left, generatorY),
        toOutput: curve(generator.right - base.left, generatorY, output.left - base.left, outputY),
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  // SMIL packets are paused with the rest of the loop.
  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    if (paused) svg.pauseAnimations()
    else svg.unpauseAnimations()
  }, [paused, wires])

  const caption = reduced ? c.reduced : c.captions[Math.max(0, step - 1)]

  return (
    <section className={styles.loop} aria-label={c.label}>
      <p className={styles.eyebrow}>{c.eyebrow}</p>
      <p className={styles.srOnly}>{c.summary}</p>

      <div ref={stageRef} className={styles.stage} data-step={step} data-paused={paused} aria-hidden="true">
        {wires && !reduced && (
          <svg
            ref={svgRef}
            className={styles.wires}
            width={wires.width}
            height={wires.height}
            focusable="false"
          >
            <path d={wires.toGenerator} className={styles.track} />
            <path d={wires.toGenerator} className={styles.flowIn} />
            <path d={wires.toOutput} className={styles.track} />
            <path d={wires.toOutput} className={styles.flowOut} />
            {[0, 0.9].map(begin => (
              <circle key={`in-${begin}`} r="3.5" className={styles.packetIn}>
                <animateMotion dur="1.8s" begin={`${begin}s`} repeatCount="indefinite" path={wires.toGenerator} />
              </circle>
            ))}
            {[0, 0.9].map(begin => (
              <circle key={`out-${begin}`} r="3.5" className={styles.packetOut}>
                <animateMotion dur="1.8s" begin={`${begin}s`} repeatCount="indefinite" path={wires.toOutput} />
              </circle>
            ))}
          </svg>
        )}

        <div ref={sourceRef} className={styles.col}>
          <div className={`${styles.card} ${styles.src} ${styles.srcContent}`} style={{ '--d': '0s' } as React.CSSProperties}>
            <div className={styles.tag}>{c.tagContent}</div>
            <div className={styles.mdLine}>
              <span className={styles.hash}>#</span>
              <span className={styles.old}>{c.titleOld}</span>
              <span className={styles.new}>{c.titleNew}</span>
            </div>
            <div className={styles.ln} />
            <div className={`${styles.ln} ${styles.lnShort}`} />
          </div>
          <div className={`${styles.card} ${styles.src}`} style={{ '--d': '0.7s' } as React.CSSProperties}>
            <div className={styles.tag}>{c.tagStructure}</div>
            <div className={styles.tree}>
              {c.tree.map(line => (
                <div key={line}>{line}</div>
              ))}
            </div>
          </div>
          <div className={`${styles.card} ${styles.src}`} style={{ '--d': '1.4s' } as React.CSSProperties}>
            <div className={styles.tag}>{c.tagTheme}</div>
            <div className={styles.swatchRow}>
              {SWATCHES.map(color => (
                <span key={color} className={styles.swatch} style={{ background: color }} />
              ))}
              <span className={styles.swatchLabel}>{c.brand}</span>
            </div>
          </div>
        </div>

        <div className={styles.col}>
          <div ref={generatorRef} className={`${styles.card} ${styles.gen}`}>
            <div className={styles.tag}>{c.tagGenerator}</div>
            <div className={styles.segments}>
              {SEGMENTS.map(index => (
                <span key={index} className={styles.segment} style={{ '--i': index } as React.CSSProperties}>
                  <i />
                </span>
              ))}
            </div>
            <div className={styles.status}>{c.status[step]}</div>
            <ul className={styles.steps}>
              {c.steps.map((label, index) => (
                <li key={label} style={{ '--i': index } as React.CSSProperties}>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={outputRef} className={styles.col}>
          <div className={styles.files}>
            {FILES.map((file, index) => (
              <div
                key={file.name}
                className={`${styles.file} ${file.updated ? styles.fileUpdated : ''}`}
                style={{ '--d': `${index * 0.18}s` } as React.CSSProperties}
              >
                <span>{file.name}</span>
                <span className={file.updated ? styles.tagNew : styles.tagSame}>
                  {file.updated ? c.updated : c.unchanged}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.browser}>
            <div className={styles.browserBar}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.url}>{c.url}</span>
            </div>
            <div className={styles.browserBody}>
              <h3>
                <span className={styles.old}>{c.titleOld}</span>
                <span className={styles.new}>{c.titleNew}</span>
              </h3>
              <p className={styles.bodyText}>{c.body}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <p key={step} className={styles.caption}>{caption}</p>
        <div className={styles.stepChoices} aria-label={locale === 'zh' ? '选择生成阶段' : 'Choose a stage'}>
          {(locale === 'zh' ? ['源文件', '生成', '网站文件', '读者访问', '修改后'] : ['Source', 'Build', 'Files', 'Readers', 'Edit again']).map((label, index) => (
            <button
              key={label}
              type="button"
              aria-pressed={step === index + 1}
              onClick={() => {
                setPaused(true)
                setStep(index + 1)
              }}
            >
              {label}
            </button>
          ))}
        </div>
        {!reduced && (
          <button
            type="button"
            className={styles.pause}
            onClick={() => {
              if (paused) setStep(1)
              setPaused(value => !value)
            }}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
            <span>{paused ? c.play : c.pause}</span>
          </button>
        )}
      </div>
    </section>
  )
}
