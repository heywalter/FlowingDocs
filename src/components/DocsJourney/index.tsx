import React, { useEffect, useRef, useState } from 'react'
import Link from '@docusaurus/Link'
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CodeIcon,
  FileTextIcon,
  GearIcon,
  PlayIcon,
  ReloadIcon,
  RocketIcon,
} from '@radix-ui/react-icons'
import Scene from './Scene'
import AssemblyLoop from './AssemblyLoop'
import { copyDraft, initialDraft, pageLabel, sameDraft, textTone, type Draft, type Locale } from './model'
import styles from './styles.module.css'

type Variant = 'hero' | 'workbench'

export default function DocsJourney({ locale = 'zh', variant = 'hero' }: { locale?: Locale, variant?: Variant }) {
  const tr = (zh: string, en: string) => (locale === 'zh' ? zh : en)
  const [activeTab, setActiveTab] = useState<'markdown' | 'sidebar'>('markdown')
  const [draft, setDraft] = useState<Draft>(() => initialDraft(locale))
  const [built, setBuilt] = useState<Draft | null>(null)
  const [published, setPublished] = useState<Draft | null>(null)
  const [phase, setPhase] = useState(0)
  const [running, setRunning] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [preview, setPreview] = useState<'draft' | 'built' | 'published'>('draft')

  const [buildStep, setBuildStep] = useState<number>(0)
  const [buildLog, setBuildLog] = useState<string>('')
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [deploySuccess, setDeploySuccess] = useState<boolean>(false)
  const [is3D, setIs3D] = useState<boolean>(false)

  const titleInputRef = useRef<HTMLInputElement>(null)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  function cancelPending() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  function schedule(action: () => void, delay: number) {
    const timer = setTimeout(() => {
      timers.current = timers.current.filter(value => value !== timer)
      action()
    }, delay)
    timers.current.push(timer)
  }
  useEffect(() => () => cancelPending(), [])
  const buildCurrent = sameDraft(draft, built)
  const publishCurrent = built !== null && published !== null && sameDraft(built, published)
  const shown = (preview === 'built' ? built : preview === 'published' ? published : draft) || draft

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  function edit(next: Draft) {
    cancelPending()
    setIsDeploying(false)
    setRunning(false)
    setPhase(0)
    setBuildStep(0)
    setBuildLog('')
    setDeploySuccess(false)
    setPreview('draft')
    setDraft(next)
  }

  function move(index: number, direction: number) {
    const order = [...draft.order]
    const next = index + direction
    if (next < 0 || next >= order.length) return
    ;[order[index], order[next]] = [order[next]!, order[index]!]
    edit({ ...draft, order })
  }

  function generate() {
    if (!draft.title.trim()) return
    cancelPending()
    setIsDeploying(false)
    setDeploySuccess(false)
    setPhase(1)
    setRunning(true)
    setBuildStep(1)
    setBuildLog(tr('$ docusaurus build: [1/4] 解析 Markdown AST 与 Front Matter...', '$ docusaurus build: [1/4] Parsing Markdown AST & Front Matter...'))

    schedule(() => {
      setBuildStep(2)
      setBuildLog(tr('$ [2/4] 计算侧边栏层级与多语言路由树...', '$ [2/4] Resolving sidebars & i18n route tree...'))
    }, reduced ? 0 : 380)

    schedule(() => {
      setBuildStep(3)
      setBuildLog(tr('$ [3/4] 编译 MDX 交互组件与主题资源包...', '$ [3/4] Compiling MDX components & theme chunks...'))
    }, reduced ? 0 : 760)

    schedule(() => {
      setBuildStep(4)
      setBuildLog(tr('$ [4/4] 静态预渲染 HTML 并写入 build/ 目录...', '$ [4/4] Pre-rendering static HTML to build/...'))
    }, reduced ? 0 : 1140)

    schedule(() => {
      setBuilt(copyDraft(draft))
      setPreview('built')
      setPhase(2)
      setRunning(false)
      setBuildLog(tr('✔ 模拟构建完成（4/4）', '✔ Simulated build complete (4/4)'))
    }, reduced ? 0 : 1500)
  }

  function publish() {
    if (!built || !buildCurrent || isDeploying) return
    setIsDeploying(true)
    setDeploySuccess(false)

    schedule(() => {
      setPublished(copyDraft(built))
      setPreview('published')
      setPhase(3)
      setIsDeploying(false)
      setDeploySuccess(true)
    }, reduced ? 0 : 1100)
  }

  function reset() {
    cancelPending()
    setRunning(false)
    setBuildStep(0)
    setBuildLog('')
    setIsDeploying(false)
    setDeploySuccess(false)
    setDraft(initialDraft(locale))
    setBuilt(null)
    setPublished(null)
    setPreview('draft')
    setPhase(0)
    setActiveTab('markdown')
  }

  const status = !draft.title.trim()
    ? tr('请输入文档标题后重试构建。', 'Enter a document title before running the build.')
    : running
      ? tr('正在演示解析 Markdown、组织目录和装配主题…', 'Static generator is parsing Markdown, generating routes, and bundling assets…')
      : phase === 3 || (built && buildCurrent && publishCurrent)
        ? tr('已完成模拟部署。读者端已同步呈现最新内容，后续修改需重新生成。', 'Simulated deploy complete. Live preview updated; future edits require rebuilding.')
        : built && buildCurrent
          ? tr('模拟网站文件已生成。点击发布，查看读者收到的版本。', 'Simulated website files are ready. Publish to inspect the reader version.')
          : built
            ? tr('检测到源码已修改。当前编辑预览已实时更新，已生成的构建产物保持快照。', 'Source modified. Working draft updated; previously built bundle remains snapshot.')
            : tr('试着修改文档标题、调整目录顺序或定制主题，随后模拟生成网站。', 'Try editing the title, reordering sidebars, or toggling themes, then trigger a build.')

  if (variant === 'hero') {
    return (
      <section className={styles.journey} data-journey="hero" aria-label={tr('文档从源码到网页的生成流', 'Docs-as-Code Build Pipeline')}>
        <header className={styles.intro}>
          <h1>{tr('文档怎样变成网页？', 'How do documents become a website?')}</h1>
          <p>
            {tr(
              '源文件写内容，目录组织页面，主题决定外观。生成器把它们处理成可发布的网站文件。',
              'Source files hold the content, navigation organizes pages, and the theme defines their appearance. A generator produces the website files.',
            )}
          </p>
        </header>

        <nav className={styles.topicLinks} aria-label={tr('按问题选择主题', 'Choose a topic')}>
          <Link to={`${locale === 'en' ? '/en' : ''}/docs/markup/`}>
            <strong>{tr('标记语言', 'Markup')}</strong>
            <span>{tr('写法、表格与内容复用', 'Syntax, tables and reuse')}</span>
          </Link>
          <Link to={`${locale === 'en' ? '/en' : ''}/docs/information-design/`}>
            <strong>{tr('信息表达', 'Information design')}</strong>
            <span>{tr('内容、步骤与排版', 'Content, steps and layout')}</span>
          </Link>
          <Link to={`${locale === 'en' ? '/en' : ''}/docs/publishing/`}>
            <strong>{tr('文档发布', 'Publishing')}</strong>
            <span>{tr('工具选择与维护成本', 'Tools and maintenance')}</span>
          </Link>
        </nav>
        <AssemblyLoop locale={locale} />

        <footer className={styles.footer}>
          <p>{tr('从手头的问题开始。每个主题都有例子、处理方式和适用边界。', 'Start with your current problem. Each topic includes examples, approaches and limits.')}</p>
          <div className={styles.footerLinks}>
            <Link to={`${locale === 'en' ? '/en' : ''}/docs/markup/`}>
              {tr('文档标记语言演练', 'Document Markup Workshop')}
              <ArrowRightIcon />
            </Link>
            <Link to={`${locale === 'en' ? '/en' : ''}/docs/publishing/`}>
              {tr('静态生成器选型指南', 'Publishing Toolchain Guide')}
              <ArrowRightIcon />
            </Link>
          </div>
        </footer>
      </section>
    )
  }

  return (
    <section className={styles.journey} data-journey="workbench" aria-label={tr('文档从源码到网页的生成流', 'Docs-as-Code Build Pipeline')}>
      {/* Interactive Hands-on Assembly Console */}

      {/* 2. Interactive Hands-on Assembly Console */}
      <div id="pipeline-lab" className={styles.labSection}>
        <div className={styles.labHeader}>
          <span className={styles.labBadge}>
            <GearIcon />
            <span>{tr('原理演示 · 改一改，再生成', 'Simulation · edit, then build')}</span>
          </span>
          <h3>{tr('试一试：修改、生成与发布', 'Try editing, building and publishing')}</h3>
          <p>
            {tr(
              '在下方修改文档标题或调整侧边栏顺序，点击“模拟生成网站”，右侧会呈现生成的页面。更多主题与视图设置在下方展开。',
              'Edit the title or reorder the sidebar below, then run the static build to see the generated page on the right. Theme and view options are under "More".',
            )}
          </p>
        </div>

        <p className={styles.simulationNote}>{tr('本页只演示状态变化，不会真正构建或部署站点。', 'This page simulates state changes; it does not build or deploy a site.')}</p>
        <div className={styles.stage} data-running={running}>
          <Scene running={running} reduced={reduced} locale={locale} />

          {/* 1. Source & Config Workspace */}
          <div className={styles.sourceColumn}>
            <div className={styles.sourceCard}>
              <div className={styles.tabBar}>
                <button
                  type="button"
                  className={styles.tabButton}
                  data-active={activeTab === 'markdown'}
                  onClick={() => setActiveTab('markdown')}
                >
                  <FileTextIcon />
                  <span>start.md</span>
                </button>
                <button
                  type="button"
                  className={styles.tabButton}
                  data-active={activeTab === 'sidebar'}
                  onClick={() => setActiveTab('sidebar')}
                >
                  <CodeIcon />
                  <span>sidebars.ts</span>
                </button>
              </div>

              <div className={styles.tabContent}>
                {activeTab === 'markdown' && (
                  <>
                    <label className={styles.sourceTitle}>
                      <span aria-hidden="true">#</span>
                      <input
                        ref={titleInputRef}
                        aria-label={tr('修改文档标题', 'Edit document title')}
                        maxLength={40}
                        value={draft.title}
                        onChange={e => edit({ ...draft, title: e.target.value })}
                      />
                    </label>
                    <div className={styles.markdownBody}>
                      <b>{`## ${tr('环境预检', 'Pre-flight checks')}`}</b>
                      <p>{tr('初始化数据库前，核实数据目录权限与 3306 端口占用。', 'Verify data directory permissions and port 3306 availability before initialization.')}</p>
                      <b>{`## ${tr('操作流程', 'Operation steps')}`}</b>
                      <p>
                        {`1. ${tr('执行 mysqld --initialize 生成基础系统表。', 'Run mysqld --initialize to generate system tables.')}`}
                        <br />
                        {`2. ${tr('使用 systemctl start mysqld 拉起后台服务。', 'Start mysqld daemon via systemctl start mysqld.')}`}
                      </p>
                    </div>
                  </>
                )}

                {activeTab === 'sidebar' && (
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--muted)', margin: '0 0 10px' }}>
                      {tr('调整侧边栏层级与阅读时序：', 'Reorder navigation hierarchy and reading sequence:')}
                    </p>
                    <ol className={styles.navigationList} aria-label={tr('侧边栏顺序', 'Sidebar order')}>
                      {draft.order.map((id, index) => (
                        <li key={id}>
                          <span>{pageLabel(id, locale)}</span>
                          <button
                            type="button"
                            className={styles.moveBtn}
                            disabled={index === 0}
                            aria-label={tr('上移', 'Move up')}
                            onClick={() => move(index, -1)}
                          >
                            <ArrowUpIcon />
                          </button>
                          <button
                            type="button"
                            className={styles.moveBtn}
                            disabled={index === draft.order.length - 1}
                            aria-label={tr('下移', 'Move down')}
                            onClick={() => move(index, 1)}
                          >
                            <ArrowDownIcon />
                          </button>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* 2. Static Generator Engine Center */}
          <div className={styles.engineColumn}>
            <div className={styles.engineCard}>
              <div className={styles.engineStatus}>
                <div className={styles.engineTitle}>
                  <GearIcon />
                  <span>{tr('静态生成器', 'Static Generator')}</span>
                </div>
                <span
                  className={styles.statusBadge}
                  data-status={running ? 'compiling' : built ? 'ready' : 'idle'}
                >
                  {running ? tr('构建中', 'BUILDING') : built ? tr('已就绪', 'READY') : tr('待命', 'IDLE')}
                </span>
              </div>

              {running && (
                <div className={styles.progressBarTrack} role="progressbar" aria-valuenow={buildStep} aria-valuemin={1} aria-valuemax={4}>
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${(buildStep / 4) * 100}%` }}
                  />
                </div>
              )}

              <ul className={styles.pipelineList}>
                <li className={styles.pipelineStep} data-active={running ? buildStep >= 1 : phase >= 1}>
                  <span className={styles.stepDot} />
                  <span>{tr('1. 解析 Markdown 语法树', '1. Parse Markdown AST')}</span>
                </li>
                <li className={styles.pipelineStep} data-active={running ? buildStep >= 2 : phase >= 2}>
                  <span className={styles.stepDot} />
                  <span>{tr('2. 解析侧边栏与路由', '2. Resolve Sidebars & Routes')}</span>
                </li>
                <li className={styles.pipelineStep} data-active={running ? buildStep >= 3 : phase >= 2}>
                  <span className={styles.stepDot} />
                  <span>{tr('3. 打包主题与 MDX', '3. Bundle Theme & MDX')}</span>
                </li>
                <li className={styles.pipelineStep} data-active={running ? buildStep >= 4 : phase >= 2}>
                  <span className={styles.stepDot} />
                  <span>{tr('4. 静态预渲染 HTML', '4. SSG HTML Pre-render')}</span>
                </li>
              </ul>

              {buildLog && (
                <div className={styles.engineLogBox} title={buildLog}>
                  <span>{buildLog}</span>
                </div>
              )}

              <div className={styles.engineActions}>
                <button
                  type="button"
                  className={styles.btnBuild}
                  disabled={running || !draft.title.trim()}
                  onClick={generate}
                >
                  {running ? <ReloadIcon className={styles.spin} /> : <PlayIcon />}
                  <span>{running ? tr('正在生成静态产物…', 'Compiling bundle…') : tr('模拟生成网站', 'Simulate a build')}</span>
                </button>

                <button
                  type="button"
                  className={styles.btnPublish}
                  disabled={running || !built || !buildCurrent || publishCurrent || isDeploying}
                  onClick={publish}
                >
                  {isDeploying
                    ? (
                        <ReloadIcon className={styles.spin} />
                      )
                    : phase === 3 || publishCurrent
                      ? (
                          <CheckIcon />
                        )
                      : (
                          <RocketIcon />
                        )}
                  <span>
                    {isDeploying
                      ? tr('模拟发布中…', 'Simulating publication…')
                      : !built
                          ? tr('先生成网站', 'Build first')
                          : !buildCurrent
                              ? tr('重新生成后发布', 'Rebuild before publishing')
                              : publishCurrent
                                ? tr('已模拟发布', 'Publication simulated')
                                : tr('模拟发布给读者', 'Simulate publication')}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Live Browser Viewport */}
          <div className={styles.resultColumn}>
            <div className={`${styles.browserCard} ${isDeploying || deploySuccess ? styles.deployShimmer : ''}`}>
              <div className={styles.browserBar}>
                <div className={styles.trafficLights}>
                  <span className={styles.dotRed} />
                  <span className={styles.dotYellow} />
                  <span className={styles.dotGreen} />
                </div>

                <div className={styles.urlPill}>
                  <span className={styles.urlText}>example.com/docs/start/</span>
                  {deploySuccess && preview === 'published' && (
                    <span className={styles.liveBadge}>{tr('● 模拟读者版本', '● Simulated reader version')}</span>
                  )}
                </div>

              </div>

              {is3D
                ? (
                    <div className={styles.viewport3DStage}>
                      {running && <div className={styles.laserScanline} />}
                      <div className={styles.explodedBox} data-snapping={running}>
                        {/* Layer 1: Bottom - Skeleton & Routes */}
                        <div className={`${styles.explodedLayer} ${styles.layerBottom}`}>
                          <span className={styles.layerTag}>{tr('第 1 层：sidebars.ts（目录）', 'Layer 1: sidebars.ts (navigation)')}</span>
                          <div className={styles.layerBottomTree}>
                            <div>├── docs/</div>
                            {shown.order.map(id => (
                              <div key={id} style={{ paddingLeft: 12 }}>
                                └──
                                {' '}
                                {id === 'start' ? '● ' : '○ '}
                                {id}
                                .md (
                                {pageLabel(id, locale)}
                                )
                              </div>
                            ))}
                            <div style={{ marginTop: 4, color: 'var(--muted)', fontSize: 10 }}>
                              {tr('➔ 根据配置生成 /docs/ 页面路径', '➔ Generate page routes from the configuration')}
                            </div>
                          </div>
                        </div>

                        {/* Layer 2: Middle - Markdown AST Content */}
                        <div className={`${styles.explodedLayer} ${styles.layerMiddle}`}>
                          <span className={styles.layerTag}>{tr('第 2 层：Markdown（正文）', 'Layer 2: Markdown (content)')}</span>
                          <div className={styles.layerMiddleContent}>
                            <h4>
                              #
                              {shown.title || tr('未命名文档', 'Untitled')}
                            </h4>
                            <p>
                              ##
                              {tr('环境预检', 'Pre-flight')}
                              {' '}
                              {tr('· 3306 端口 & 目录权限', '· Port 3306 & Permissions')}
                            </p>
                            <p>
                              ##
                              {tr('操作流程', 'Steps')}
                              {' '}
                              · mysqld --initialize
                            </p>
                            <div style={{ marginTop: 6, fontSize: 10, color: 'var(--accent)' }}>
                              {tr('✔ 纯文本数据，内容排版彻底解耦', '✔ Pure markup, decoupling content & style')}
                            </div>
                          </div>
                        </div>

                        {/* Layer 3: Top - Glass Theme UI */}
                        <div
                          className={`${styles.explodedLayer} ${styles.layerTop}`}
                          style={{ '--demo-accent': shown.color, '--demo-accent-text': textTone(shown.color) } as React.CSSProperties}
                        >
                          <span className={styles.layerTag}>{tr('Layer 3: Design Tokens (主题外壳)', 'Layer 3: Design Tokens (Theme Shell)')}</span>
                          <div className={styles.layerTopUI}>
                            <span>FlowingDocs Theme</span>
                            <span style={{ width: 10, height: 10, borderRadius: '50%', background: shown.color }} />
                          </div>
                          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--ink)' }}>
                            <div>
                              {tr('主题品牌色: ', 'Accent: ')}
                              <strong>{shown.color}</strong>
                            </div>
                            <div>
                              {tr('排版行距: ', 'Spacing: ')}
                              {shown.compact ? tr('紧凑', 'Compact') : tr('标准', 'Relaxed')}
                            </div>
                            <div style={{ marginTop: 6, fontSize: 10, color: '#10b981' }}>
                              {tr('● 编译期一次性烘焙装配 (Snap Assembly)', '● Baked at compile time')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                : (
                    <div
                      className={styles.browserContent}
                      style={{
                        '--demo-accent': shown.color,
                        '--demo-accent-text': textTone(shown.color),
                        '--demo-leading': shown.compact ? 1.45 : 1.75,
                      } as React.CSSProperties}
                    >
                      <div className={styles.previewSidebar}>
                        <div className={styles.previewSidebarTitle}>FlowingDocs</div>
                        <ul className={styles.previewNav}>
                          {shown.order.map(id => (
                            <li key={id} data-active={id === 'start'}>
                              {pageLabel(id, locale)}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className={styles.previewDoc}>
                        <h3>{shown.title || tr('未命名文档', 'Untitled document')}</h3>
                        <h4>{tr('环境预检', 'Pre-flight checks')}</h4>
                        <p>{tr('初始化数据库前，核实数据目录权限与 3306 端口占用。', 'Verify data directory permissions and port 3306 availability before initialization.')}</p>
                        <h4>{tr('操作流程', 'Operation steps')}</h4>
                        <ol>
                          <li>{tr('执行 mysqld --initialize 生成基础系统表。', 'Run mysqld --initialize to generate system tables.')}</li>
                          <li>{tr('使用 systemctl start mysqld 拉起后台服务。', 'Start mysqld daemon via systemctl start mysqld.')}</li>
                        </ol>
                      </div>
                    </div>
                  )}
            </div>
          </div>
        </div>

        <details className={styles.moreControls}>
          <summary>{tr('更多：主题与视图', 'More: theme and views')}</summary>
          <div className={styles.moreBody}>
            <div className={styles.moreGroup}>
              <span className={styles.moreLabel}>{tr('主题', 'Theme')}</span>
              <div className={styles.themeControls}>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>
                    {tr('文档主题品牌色：', 'Brand Accent Color:')}
                  </span>
                  <div className={styles.swatches}>
                    {[
                      ['#6654d9', tr('现代紫', 'Violet')],
                      ['#087f78', tr('极客绿', 'Teal')],
                      ['#334155', tr('工业深灰', 'Slate')],
                    ].map(([color, label]) => (
                      <label key={color}>
                        <input
                          type="radio"
                          name={`journey-color-${locale}`}
                          checked={draft.color === color}
                          onChange={() => color && edit({ ...draft, color })}
                          style={{ '--swatch': color } as React.CSSProperties}
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <label className={styles.compactToggle}>
                  <input
                    type="checkbox"
                    checked={draft.compact}
                    onChange={e => edit({ ...draft, compact: e.target.checked })}
                  />
                  <span>{tr('紧凑文字行距排版', 'Compact line height')}</span>
                </label>
              </div>
            </div>
            <div className={styles.moreGroup}>
              <span className={styles.moreLabel}>{tr('视图', 'View')}</span>
              <div className={styles.viewControls}>
                <button
                  type="button"
                  className={styles.btn3D}
                  data-active={is3D}
                  onClick={() => setIs3D(!is3D)}
                  title={tr('切换 3D 空间图层拆解视角', 'Toggle 3D exploded view')}
                >
                  <span>{is3D ? tr('3D 拆解', '3D') : tr('平面视角', '2D')}</span>
                </button>

                <select
                  className={styles.viewSelect}
                  aria-label={tr('选择视窗模式', 'Select viewport mode')}
                  value={preview}
                  onChange={e => setPreview(e.target.value as typeof preview)}
                >
                  <option value="draft">{tr('实时草稿', 'Draft')}</option>
                  <option value="built" disabled={!built}>{tr('构建产物', 'Built')}</option>
                  <option value="published" disabled={!published}>{tr('读者版本', 'Live')}</option>
                </select>
              </div>
            </div>
          </div>
        </details>

        {/* Pipeline Navigation / Reset HUD */}
        <div className={styles.controls}>
          <ol className={styles.pipelineSteps} aria-label={tr('构建阶段', 'Build pipeline stages')}>
            {[tr('源码与配置', 'Source'), tr('静态编译', 'Build'), tr('产物生成', 'Output'), tr('读者访问', 'Live')].map((label, idx) => (
              <li key={label} aria-current={idx === phase ? 'step' : undefined} data-complete={idx < phase}>
                <span>{idx < phase ? <CheckIcon /> : idx + 1}</span>
                {label}
              </li>
            ))}
          </ol>

          <p className={styles.statusBar} role="status">{status}</p>
          <p className={styles.simulationNote}>
            {tr(
              '原理演示：本页的构建与发布均为模拟，不会调用 Docusaurus 或上传文件。',
              'Simulation only: no Docusaurus build runs and no files are uploaded.',
            )}
          </p>
        </div>
      </div>
    </section>
  )
}
