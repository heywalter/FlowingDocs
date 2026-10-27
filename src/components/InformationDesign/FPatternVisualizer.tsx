import React, { useState, useEffect, useRef } from 'react'
import styles from './widgets.module.css'

interface FPatternVisualizerProps {
  locale?: 'zh' | 'en'
}

interface GazeStep {
  id: number
  x: number
  y: number
  glideMs: number
  dwellMs: number
  shortLabelZh: string
  shortLabelEn: string
  phaseZh: string
  phaseEn: string
  labelZh: string
  labelEn: string
  isAnchor?: boolean
}

const GAZE_STEPS: GazeStep[] = [
  {
    id: 1,
    x: 14,
    y: 8,
    glideMs: 400,
    dwellMs: 380,
    shortLabelZh: '主标题',
    shortLabelEn: 'Title',
    phaseZh: '第一横起点',
    phaseEn: 'Top Bar Start',
    labelZh: '视线首着陆点：快速扫描主标题核心关键词',
    labelEn: 'Gaze lands on primary headline keywords',
  },
  {
    id: 2,
    x: 70,
    y: 8,
    glideMs: 550,
    dwellMs: 320,
    shortLabelZh: '扫视右侧',
    shortLabelEn: 'Scan Right',
    phaseZh: '第一横展开',
    phaseEn: 'Top Bar Scan',
    labelZh: '向右横向扫视标题后半部，评估任务相关度',
    labelEn: 'Scanning rightward across title to assess task fit',
  },
  {
    id: 3,
    x: 14,
    y: 22,
    glideMs: 500,
    dwellMs: 280,
    shortLabelZh: '略读前言',
    shortLabelEn: 'Lead Scan',
    phaseZh: '第一横次级',
    phaseEn: 'Lead Line',
    labelZh: '折返左侧边缘，略读前言前几个单词，视线迅速衰减',
    labelEn: 'Snapping back left, glancing at lead words',
  },
  {
    id: 4,
    x: 14,
    y: 38,
    glideMs: 450,
    dwellMs: 260,
    shortLabelZh: '纵向滑行',
    shortLabelEn: 'Vertical Glide',
    phaseZh: '纵向边缘滑行',
    phaseEn: 'Vertical Glide',
    labelZh: '视线沿左边缘垂直滑行，快速扫过前置条件框',
    labelEn: 'Gliding down left margin past prerequisite callout',
  },
  {
    id: 5,
    x: 14,
    y: 55,
    glideMs: 450,
    dwellMs: 480,
    shortLabelZh: '动词【锁定】',
    shortLabelEn: 'Verb Lock',
    phaseZh: '第二横起点 (刹车锚点)',
    phaseEn: 'Action Anchor',
    labelZh: '关键视觉刹车：强动词【锁定】成功拦截滑行动线',
    labelEn: 'Visual brake: bold imperative verb Lock halts vertical scan',
    isAnchor: true,
  },
  {
    id: 6,
    x: 58,
    y: 64,
    glideMs: 600,
    dwellMs: 500,
    shortLabelZh: '精读命令',
    shortLabelEn: 'Code Inspect',
    phaseZh: '第二横深入 (高认知负荷)',
    phaseEn: 'Code Focus',
    labelZh: '第二横深入展开：视线横向停留在核心 SQL 命令上精读',
    labelEn: 'High cognitive dwell: absorbing actionable SQL command',
    isAnchor: true,
  },
  {
    id: 7,
    x: 14,
    y: 76,
    glideMs: 500,
    dwellMs: 350,
    shortLabelZh: '动词【注入】',
    shortLabelEn: 'Verb Inject',
    phaseZh: '纵向过渡',
    phaseEn: 'Step 2 Scan',
    labelZh: '视线跳回左侧，捕捉第二步动词【注入】',
    labelEn: 'Snapping back to Step 2 action verb Inject',
    isAnchor: true,
  },
  {
    id: 8,
    x: 38,
    y: 91,
    glideMs: 550,
    dwellMs: 450,
    shortLabelZh: '结果验证',
    shortLabelEn: 'Verification',
    phaseZh: '终点验证',
    phaseEn: 'Verification Check',
    labelZh: '视线落入底部验证框，核对状态指令与预期返回值',
    labelEn: 'Final check: reading verification command and expected output',
  },
]

export default function FPatternVisualizer({ locale = 'zh' }: FPatternVisualizerProps) {
  const [animating, setAnimating] = useState(false)
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1)
  const [isFixating, setIsFixating] = useState(false)
  const [gazePos, setGazePos] = useState({ x: 14, y: 8 })
  const [visitedPoints, setVisitedPoints] = useState<{ x: number, y: number }[]>([])

  const timerRef = useRef<number | null>(null)

  const isZh = locale === 'zh'
  const t = (zh: string, en: string) => (isZh ? zh : en)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    return () => clearTimer()
  }, [])

  const runStep = (idx: number) => {
    if (idx >= GAZE_STEPS.length) {
      timerRef.current = window.setTimeout(() => {
        setAnimating(false)
        setIsFixating(false)
      }, 1500)
      return
    }

    const step = GAZE_STEPS[idx]!
    setCurrentStepIdx(idx)

    // Smooth continuous glide to next coordinate
    setGazePos({ x: step.x, y: step.y })
    setIsFixating(false)

    // Arrive at fixation point after smooth glide duration
    timerRef.current = window.setTimeout(() => {
      setIsFixating(true)
      setVisitedPoints(prev => [...prev, { x: step.x, y: step.y }])

      // Fixation dwell duration (gentle breath & cognitive intake)
      timerRef.current = window.setTimeout(() => {
        runStep(idx + 1)
      }, step.dwellMs)
    }, step.glideMs)
  }

  const triggerAnimation = () => {
    clearTimer()
    setVisitedPoints([])
    setAnimating(true)
    runStep(0)
  }

  const stopAnimation = () => {
    clearTimer()
    setAnimating(false)
    setIsFixating(false)
  }

  const jumpToStep = (idx: number) => {
    clearTimer()
    const step = GAZE_STEPS[idx]!
    setCurrentStepIdx(idx)
    setGazePos({ x: step.x, y: step.y })
    setIsFixating(true)
    setAnimating(true)
    setVisitedPoints(GAZE_STEPS.slice(0, idx + 1).map(s => ({ x: s.x, y: s.y })))
  }

  const currentStep = currentStepIdx >= 0 ? GAZE_STEPS[currentStepIdx] : null

  return (
    <div
      className={styles.widgetContainer}
      role="region"
      aria-label={t('F 型扫视动线演示器', 'F-Pattern Eye Tracking Simulation')}
    >
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitleGroup}>
          <h4>{t('F 型视线扫视动线与视觉锚点演练', 'F-Pattern Eye Scanning Simulation')}</h4>
          <p>
            {t(
              '基于 NN/g 经典眼动追踪研究：读者如何跳过冗长段落，被强动词与代码块成功“视觉拦截”',
              'Based on Nielsen Norman Group eyetracking research: How bold verbs and code blocks halt scanning',
            )}
          </p>
        </div>
        <div
          className={`${styles.statusHeaderPill} ${animating ? styles.statusHeaderPillActive : ''}`}
        >
          <span>{animating ? '●' : '○'}</span>
          <span>
            {animating
              ? (isZh ? '正在演示扫视动线流...' : 'Simulating eye gaze flow...')
              : (isZh ? '单画布一体化呈现' : 'Unified Canvas View')}
          </span>
        </div>
      </div>

      <div className={styles.fPatternGrid}>
        {/* Document Wireframe Simulation Canvas */}
        <div className={styles.wireframeDoc}>
          {/* Authentic Gaussian-Blurred SVG Heatmap Layer */}
          <svg className={styles.heatSvgOverlay} viewBox="0 0 500 400" preserveAspectRatio="none">
            <defs>
              <filter id="heatGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="22" />
              </filter>
              <radialGradient id="gradHot">
                <stop offset="0%" stopColor="#ff2200" stopOpacity="0.75" />
                <stop offset="40%" stopColor="#ff7700" stopOpacity="0.55" />
                <stop offset="70%" stopColor="#ffcc00" stopOpacity="0.35" />
                <stop offset="90%" stopColor="#22cc55" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#0066ff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="gradWarm">
                <stop offset="0%" stopColor="#ff7700" stopOpacity="0.65" />
                <stop offset="45%" stopColor="#ffcc00" stopOpacity="0.4" />
                <stop offset="75%" stopColor="#33cc66" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0088ff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="gradCold">
                <stop offset="0%" stopColor="#ffcc00" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#33bb66" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#0088ff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 1. Top Horizontal Hotspot: Title & Shortdesc */}
            <ellipse cx="140" cy="45" rx="120" ry="40" fill="url(#gradHot)" filter="url(#heatGlow)" />
            <ellipse cx="280" cy="42" rx="90" ry="30" fill="url(#gradWarm)" filter="url(#heatGlow)" />
            <ellipse cx="150" cy="95" rx="110" ry="25" fill="url(#gradWarm)" filter="url(#heatGlow)" />

            {/* 2. Vertical Stem: Left Margin Scan */}
            <ellipse cx="70" cy="150" rx="45" ry="30" fill="url(#gradCold)" filter="url(#heatGlow)" />

            {/* 3. Second Horizontal Hotspot: Step 1 Verb & Code Block */}
            <ellipse cx="90" cy="225" rx="70" ry="32" fill="url(#gradHot)" filter="url(#heatGlow)" />
            <ellipse cx="240" cy="245" rx="130" ry="30" fill="url(#gradWarm)" filter="url(#heatGlow)" />

            {/* 4. Lower Stem & Terminal Check */}
            <ellipse cx="75" cy="305" rx="45" ry="25" fill="url(#gradCold)" filter="url(#heatGlow)" />
            <ellipse cx="120" cy="365" rx="75" ry="25" fill="url(#gradWarm)" filter="url(#heatGlow)" />
          </svg>

          {/* Full F-Pattern Trajectory Baseline + Dynamic Visited Path */}
          <svg className={styles.gazeTrailSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Subtle background guide path of the F-pattern */}
            <polyline
              points="14,8 70,8 14,22 14,38 14,55 58,64 14,76 38,91"
              fill="none"
              stroke="rgba(99, 102, 241, 0.22)"
              strokeWidth="1.2"
              strokeDasharray="2 2"
            />
            {/* Active visited flight trail */}
            {visitedPoints.length > 1 && (
              <polyline
                points={visitedPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="var(--ifm-color-primary)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.9"
              />
            )}
          </svg>

          {/* High-Precision Fluid Gaze Reticle */}
          {animating && (
            <div
              className={styles.gazeReticle}
              style={{
                left: `${gazePos.x}%`,
                top: `${gazePos.y}%`,
              }}
            >
              <div
                className={`${styles.gazeAperture} ${
                  isFixating ? styles.gazeApertureFixating : ''
                } ${currentStep?.isAnchor ? styles.gazeApertureAnchor : ''}`}
              />
              <div className={styles.gazeCenterDot} />
              {isFixating && (
                <div
                  key={`pulse-${currentStepIdx}`}
                  className={`${styles.gazePulseRipple} ${
                    currentStep?.isAnchor ? styles.gazePulseRippleAnchor : ''
                  }`}
                />
              )}
            </div>
          )}

          {/* Top Bar: Title & Shortdesc (Top Horizontal of F) */}
          <div
            className={`${styles.wfTitle} ${
              currentStepIdx === 0 || currentStepIdx === 1 ? styles.wfItemActive : ''
            }`}
          >
            <span>#</span>
            {t('配置 MySQL 异步复制拓扑', 'Configure MySQL Asynchronous Replication')}
            <span
              className={`${styles.fixationMarker} ${
                currentStepIdx === 0 ? styles.fixationMarkerActive : ''
              }`}
              onClick={() => jumpToStep(0)}
              title={t('点击跳转第 1 注视点（主标题首部）', 'Jump to point 1 (Title keyword)')}
            >
              1
            </span>
            <span
              className={`${styles.fixationMarker} ${
                currentStepIdx === 1 ? styles.fixationMarkerActive : ''
              }`}
              onClick={() => jumpToStep(1)}
              title={t('点击跳转第 2 注视点（标题右侧）', 'Jump to point 2 (Title rightward)')}
            >
              2
            </span>
          </div>

          <div
            className={`${styles.wfDesc} ${currentStepIdx === 2 ? styles.wfItemActive : ''}`}
          >
            {t(
              '本流程指导您配置主库 Binlog 传输并在从库建立复制信道，保障高并发只读分流与冷备容灾。',
              'This guide instructs how to configure master binary logs and establish replica channels to support read scaling.',
            )}
            <span
              className={`${styles.fixationMarker} ${
                currentStepIdx === 2 ? styles.fixationMarkerActive : ''
              }`}
              onClick={() => jumpToStep(2)}
              title={t('点击跳转第 3 注视点（前言导言）', 'Jump to point 3 (Lead sentence)')}
            >
              3
            </span>
          </div>

          {/* Prerequisites (Vertical Stem Glance) */}
          <div
            className={`${styles.wfBox} ${styles.wfPre} ${
              currentStepIdx === 3 ? styles.wfItemActive : ''
            }`}
          >
            <strong>{t('前置条件：', 'Prerequisites: ')}</strong>
            {t(
              '主从网络互通，具备 REPLICATION SLAVE 权限，端口 3306 开放。',
              'Hosts interconnected; REPLICATION SLAVE grant active; port 3306 open.',
            )}
            <span
              className={`${styles.fixationMarker} ${
                currentStepIdx === 3 ? styles.fixationMarkerActive : ''
              }`}
              onClick={() => jumpToStep(3)}
              title={t('点击跳转第 4 注视点（前置条件纵向滑过）', 'Jump to point 4 (Prereq glance)')}
            >
              4
            </span>
          </div>

          {/* Procedure Steps (Left vertical & 2nd horizontal) */}
          <div className={styles.wfStepList}>
            <div
              className={`${styles.wfStepItem} ${
                currentStepIdx === 4 || currentStepIdx === 5 ? styles.wfItemActive : ''
              }`}
            >
              <div>
                <span className={styles.wfVerb}>
                  {isZh ? '1. 锁定' : '1. Lock'}
                </span>
                {t('主库位点并获取 Binlog 文件偏移量：', 'master tables and record binary log coordinate:')}
                <span
                  className={`${styles.fixationMarker} ${
                    currentStepIdx === 4 ? styles.fixationMarkerActive : ''
                  }`}
                  style={{ background: '#e11d48' }}
                  onClick={() => jumpToStep(4)}
                  title={t('点击跳转第 5 注视点（动词刹车锚点）', 'Jump to point 5 (Action Verb Brake)')}
                >
                  5
                </span>
              </div>
              <div className={styles.wfCode}>
                FLUSH TABLES WITH READ LOCK; SHOW MASTER STATUS;
                <span
                  className={`${styles.fixationMarker} ${
                    currentStepIdx === 5 ? styles.fixationMarkerActive : ''
                  }`}
                  style={{ float: 'right' }}
                  onClick={() => jumpToStep(5)}
                  title={t('点击跳转第 6 注视点（精读核心命令）', 'Jump to point 6 (Code inspect)')}
                >
                  6
                </span>
              </div>
            </div>

            <div
              className={`${styles.wfStepItem} ${
                currentStepIdx === 6 ? styles.wfItemActive : ''
              }`}
            >
              <div>
                <span className={styles.wfVerb}>
                  {isZh ? '2. 注入' : '2. Inject'}
                </span>
                {t('主库坐标至从库并拉起 IO 复制线程：', 'connection coordinates into replica and start IO thread:')}
                <span
                  className={`${styles.fixationMarker} ${
                    currentStepIdx === 6 ? styles.fixationMarkerActive : ''
                  }`}
                  style={{ background: '#e11d48' }}
                  onClick={() => jumpToStep(6)}
                  title={t('点击跳转第 7 注视点（第二步动词锚点）', 'Jump to point 7 (Step 2 Action Verb)')}
                >
                  7
                </span>
              </div>
              <div className={styles.wfCode}>
                CHANGE REPLICATION SOURCE TO SOURCE_HOST='10.0.0.1'...; START REPLICA;
              </div>
            </div>
          </div>

          {/* Verification Box */}
          <div
            className={`${styles.wfBox} ${styles.wfVerify} ${
              currentStepIdx === 7 ? styles.wfItemActive : ''
            }`}
          >
            <strong>{t('结果验证：', 'Verification: ')}</strong>
            <code>SHOW REPLICA STATUS\G</code>
            {' '}
            {t('确认 Replica_IO_Running 为 Yes。', 'Confirm Replica_IO_Running equals Yes.')}
            <span
              className={`${styles.fixationMarker} ${
                currentStepIdx === 7 ? styles.fixationMarkerActive : ''
              }`}
              style={{ background: '#047857' }}
              onClick={() => jumpToStep(7)}
              title={t('点击跳转第 8 注视点（结果闭环验证）', 'Jump to point 8 (Verification check)')}
            >
              8
            </span>
          </div>
        </div>

        {/* Control and Insights Panel */}
        <div className={styles.actionPanel}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={styles.actionButton}
              onClick={animating ? stopAnimation : triggerAnimation}
              type="button"
              style={{ flex: 1 }}
            >
              {animating
                ? t('⏸ 暂停动线流', '⏸ Pause Simulation')
                : t('▶ 播放 F 型扫视流线回放', '▶ Play Fluid Gaze Simulation')}
            </button>
            <button
              className={styles.presetBtn}
              onClick={triggerAnimation}
              type="button"
              title={t('从头重新播放', 'Replay from start')}
            >
              ↺
            </button>
          </div>

          {/* Live Gaze Focus Status Bar */}
          <div className={styles.gazeLiveBar}>
            <div className={styles.gazeLiveHeader}>
              <span className={styles.gazeLivePhaseBadge}>
                {currentStep
                  ? (isZh ? currentStep.phaseZh : currentStep.phaseEn)
                  : t('动线演示就绪', 'Gaze Simulation Ready')}
              </span>
              <span className={styles.gazeLiveProgressText}>
                {currentStepIdx >= 0
                  ? `${currentStepIdx + 1} / ${GAZE_STEPS.length}`
                  : t('就绪', 'Ready')}
              </span>
            </div>
            <p className={styles.gazeLiveNote}>
              {currentStep
                ? (isZh ? currentStep.labelZh : currentStep.labelEn)
                : t(
                    '点击上方播放按钮，观察视线如何像流水般横向扫描、折返、沿左边缘垂直滑行，并在粗体动词与独立代码块处发生“视觉刹车”。',
                    'Play simulation to observe how engineers scan headings, code, and action verbs in an F-pattern flow.',
                  )}
            </p>
            <div className={styles.gazeProgressBarTrack}>
              <div
                className={styles.gazeProgressBarFill}
                style={{
                  width:
                    animating && currentStepIdx >= 0
                      ? `${((currentStepIdx + 1) / GAZE_STEPS.length) * 100}%`
                      : '0%',
                }}
              />
            </div>
            <div className={styles.gazePointStepNav}>
              {GAZE_STEPS.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  className={`${styles.gazeStepPill} ${
                    currentStepIdx === idx ? styles.gazeStepPillActive : ''
                  } ${step.isAnchor ? styles.gazeStepPillAnchor : ''}`}
                  onClick={() => jumpToStep(idx)}
                >
                  {`${idx + 1}. ${isZh ? step.shortLabelZh : step.shortLabelEn}`}
                </button>
              ))}
            </div>
          </div>

          {/* Retention Stats Bar */}
          <div className={styles.retentionBar}>
            <div className={styles.retentionItem}>
              {t('首屏横向注视', 'Top Bar Capture')}
              <strong style={{ color: 'var(--iw-red)' }}>98%</strong>
            </div>
            <div className={styles.retentionItem}>
              {t('动词与代码刹车', 'Code & Verb Brake')}
              <strong style={{ color: 'var(--iw-amber)' }}>84%</strong>
            </div>
            <div className={styles.retentionItem}>
              {t('段落中后部盲区', 'Mid-Paragraph Blind')}
              <strong style={{ color: 'var(--iw-blue)' }}>16%</strong>
            </div>
          </div>

          <ul className={styles.observationList}>
            <li>
              <strong>{t('第一横 (Top Horizontal Bar)', 'Top Horizontal Bar')}</strong>
              ：
              {t(
                '红区核心。读者用 2~3 秒扫视页面顶端。如果标题含糊或短描述空洞，读者将立刻迷失或离开。',
                'Highest heat. Readers scan the top in 2-3 seconds. Vague titles or filler lead paragraphs derail focus.',
              )}
            </li>
            <li>
              <strong>{t('纵向滑行 (Vertical Stem)', 'Vertical Margin Scan')}</strong>
              ：
              {t(
                '视线沿左侧垂直边缘快速滑行。步骤开头的动词（“锁定”、“注入”）充当关键“视觉刹车点”，成功拦截扫视。',
                'Gaze glides down the left edge. Strong imperative verbs act as visual braking anchors to halt scanning.',
              )}
            </li>
            <li>
              <strong>{t('第二横 (Second Horizontal Bar)', 'Second Horizontal Bar')}</strong>
              ：
              {t(
                '发现目标步骤后进行第二次横向阅读。代码块必须独立成行，若埋在段落正文中会面临 70% 的漏读率。',
                'Readers branch right into actionable code blocks. Inline commands suffer up to 70% miss rates.',
              )}
            </li>
            <li>
              <strong>{t('右下方盲区 (Cold Zone)', 'Cold Blind Zone')}</strong>
              ：
              {t(
                '热力图中未被覆盖的区域读者注意力极低，严禁在这些位置埋入生产关键警告。',
                'Uncovered areas receive almost zero reader attention. Never bury critical production warnings here.',
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
