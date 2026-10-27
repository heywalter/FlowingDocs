import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import styles from './widgets.module.css'
import { Icon, renderWithIcons } from '../DocsIcon'

interface DocsLifecycleJourneyProps {
  locale?: 'zh' | 'en'
}

type StageKey = 'markup' | 'architecture' | 'publishing'

export default function DocsLifecycleJourney({ locale = 'zh' }: DocsLifecycleJourneyProps) {
  const isZh = locale === 'zh'
  const ts = (zh: string, en: string) => isZh ? zh : en
  const t = (zh: string, en: string) => renderWithIcons(isZh ? zh : en)

  const [activeStage, setActiveStage] = useState<StageKey>('architecture')
  const [markupTab, setMarkupTab] = useState<'source' | 'output'>('source')
  const [archTab, setArchTab] = useState<'concept' | 'task' | 'reference'>('concept')

  // CI Simulation state
  const [ciStatus, setCiStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [ciStep, setCiStep] = useState<number>(0)

  const runCiSimulation = () => {
    setCiStatus('running')
    setCiStep(1)
    setTimeout(() => {
      setCiStep(2)
      setTimeout(() => {
        setCiStep(3)
        setTimeout(() => {
          setCiStep(4)
          setTimeout(() => {
            setCiStatus('done')
          }, 400)
        }, 500)
      }, 500)
    }, 500)
  }

  return (
    <div className={styles.journeyContainer}>
      {/* Widget Header */}
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitleGroup}>
          <h4>
            {t(
              '🔄 企业级技术资产全景流转故事线 (End-to-End Asset Journey)',
              '🔄 Enterprise Asset Lifecycle Journey: From Markup to Publishing',
            )}
          </h4>
          <p>
            {t(
              '追踪核心技术资产（以 MySQL 崩溃恢复与双 1 刷盘保障为例），看一份高价值知识如何穿透标记工程、信息架构与自动化发布。',
              'Trace how a critical technical asset (MySQL Crash Recovery & Dual-1 Flush) flows across Markup, Information Design, and Publishing.',
            )}
          </p>
        </div>
      </div>

      {/* 3-Stage Pipeline Navigation Track */}
      <div className={styles.pipelineNav}>
        <button
          type="button"
          className={`${styles.pipelineStepBtn} ${activeStage === 'markup' ? styles.pipelineStepActive : ''}`}
          onClick={() => setActiveStage('markup')}
        >
          <div className={styles.pipelineStepIcon}>1</div>
          <div className={styles.pipelineStepTexts}>
            <span className={styles.pipelineStepPhase}>
              {t('阶段一 · 结构工程', 'Phase 1 · Markup')}
            </span>
            <span className={styles.pipelineStepTitle}>
              {t('标记与复用组织', 'Markup & Single-Sourcing')}
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`${styles.pipelineStepBtn} ${activeStage === 'architecture' ? styles.pipelineStepActive : ''}`}
          onClick={() => setActiveStage('architecture')}
        >
          <div className={styles.pipelineStepIcon}>2</div>
          <div className={styles.pipelineStepTexts}>
            <span className={styles.pipelineStepPhase}>
              {t('阶段二 · 认知设计', 'Phase 2 · Info Design')}
            </span>
            <span className={styles.pipelineStepTitle}>
              {t('心智重塑与类型解耦', 'Cognitive Typing & Contracts')}
            </span>
          </div>
        </button>

        <button
          type="button"
          className={`${styles.pipelineStepBtn} ${activeStage === 'publishing' ? styles.pipelineStepActive : ''}`}
          onClick={() => setActiveStage('publishing')}
        >
          <div className={styles.pipelineStepIcon}>3</div>
          <div className={styles.pipelineStepTexts}>
            <span className={styles.pipelineStepPhase}>
              {t('阶段三 · 交付门禁', 'Phase 3 · Publishing')}
            </span>
            <span className={styles.pipelineStepTitle}>
              {t('静态发布与 CI 门禁', 'SSG Build & CI Linting')}
            </span>
          </div>
        </button>
      </div>

      {/* Stage Detail Card */}
      <div className={styles.journeyStageCard}>
        {/* Stage 1: Markup */}
        {activeStage === 'markup' && (
          <>
            <div className={styles.journeyStageBanner}>
              <h5 className={styles.journeyStageBannerTitle}>
                {t('阶段 1：单一事实源与跨版本复用工程', 'Phase 1: Single Source of Truth & Modular Reuse')}
              </h5>
              <span className={styles.journeyStageAssetTag}>
                Asset: innodb_flush_log_at_trx_commit.adoc
              </span>
            </div>

            <p className={styles.journeyNarrative}>
              {t(
                '在云数据库多形态（金融级专区、通用 RDS、边缘计算实例）场景下，同一组核心参数与告警不能在各个文档库中手工复制。通过 AsciiDoc 的属性条件（Conditional Attributes）与模块化包含（Include），将核心刷盘机制沉淀为单一可维护单元。',
                'Across diverse cloud DB editions (Financial Zone, General RDS, Edge Nodes), identical parameters must not drift across manual copy-pastes. Modular AsciiDoc includes and conditional attributes maintain a single source of truth.',
              )}
            </p>

            <div className={styles.journeySubGrid}>
              <div className={`${styles.journeyBox} ${styles.journeyBoxBad}`}>
                <div className={styles.journeyBoxHeader}>
                  <span>
                    <Icon name="x" />
                    {' '}
                    传统维护痛点 (Manual Copy Drift)
                  </span>
                </div>
                <div className={styles.journeyBoxContent}>
                  {t(
                    '每个产品手册都有一份独立的复制文本：金融专区要求双 1、边缘版允许设 2。某次内核升级修改了默认刷盘行为，维护人员仅更新了通用版，遗漏了金融版，导致生产配置与文档不一致。',
                    'Each manual maintains independent copies. When engine defaults update, writers refresh General RDS but forget Financial editions, causing severe documentation drift.',
                  )}
                </div>
              </div>

              <div className={`${styles.journeyBox} ${styles.journeyBoxGood}`}>
                <div className={styles.journeyBoxHeader}>
                  <span>
                    <Icon name="check" />
                    {' '}
                    FlowingDocs 工程化方案 (Include & Attributes)
                  </span>
                </div>
                <div className={styles.journeyBoxContent}>
                  {t(
                    '统一抽象为 redo-log-policy.adoc 模块，通过 {edition} 属性注入各环境专属约束与容灾基线，编译时自动生成多端一致文档。',
                    'Centralized into redo-log-policy.adoc. Uses {edition} attributes to inject environment-specific RPO baselines during compilation.',
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Code Preview */}
            <div className={styles.tabControls}>
              <button
                type="button"
                className={`${styles.tabBtn} ${markupTab === 'source' ? styles.tabBtnActive : ''}`}
                onClick={() => setMarkupTab('source')}
              >
                {t('AsciiDoc 模块源码 (Source)', 'AsciiDoc Modular Source')}
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${markupTab === 'output' ? styles.tabBtnActive : ''}`}
                onClick={() => setMarkupTab('output')}
              >
                {t('多版本动态编译输出 (Compiled)', 'Multi-Edition Compiled Output')}
              </button>
            </div>

            {markupTab === 'source'
              ? (
                  <div className={styles.snippetContainer}>
                    <div className={styles.commentSnippet}>// modules/mysql-innodb-flush.adoc</div>
                    <div>
                      <span className={styles.keywordSnippet}>ifeval::</span>
                      [&quot;
                      {'{edition}'}
                      &quot; == &quot;financial&quot;]
                    </div>
                    <div><span className={styles.stringSnippet}>[WARNING]</span></div>
                    <div>====</div>
                    <div>{t('金融级实例强制要求 innodb_flush_log_at_trx_commit = 1，严禁降级为 0 或 2，保障 RPO = 0。', 'Financial editions strictly require innodb_flush_log_at_trx_commit = 1 for RPO = 0.')}</div>
                    <div>====</div>
                    <div>
                      <span className={styles.keywordSnippet}>endif::</span>
                      []
                    </div>
                    <br />
                    <div>
                      <span className={styles.highlightSnippet}>include::</span>
                      partial$parameter-contract-table.adoc[tag=flush-log]
                    </div>
                  </div>
                )
              : (
                  <div className={styles.snippetContainer}>
                    <div className={styles.commentSnippet}># Financial Manual Output (Generated from Single Source)</div>
                    <div style={{ color: 'var(--iw-amber)' }}>
                      <strong>WARNING:</strong>
                      {' '}
                      {t('金融级实例强制要求 innodb_flush_log_at_trx_commit = 1，严禁降级为 0 或 2，保障 RPO = 0。', 'Financial editions strictly require innodb_flush_log_at_trx_commit = 1 for RPO = 0.')}
                    </div>
                    <br />
                    <div>{t('✅ 已自动嵌入标准参数契约表（动态作用域：Global；生效时机：即时生效）。', '✅ Standard parameter contract table automatically injected with Global scope.')}</div>
                  </div>
                )}

            <div className={styles.journeyActionFooter}>
              <span className={styles.journeyNarrative}>
                {t('深入阅读对应标记语言实践：', 'Explore corresponding markup techniques:')}
              </span>
              <Link
                to="/docs/markup?syntax=asciidoc&view=reuse"
                className={styles.journeyModuleLink}
              >
                {t('进入标记语言工作坊：AsciiDoc 内容复用与表格 ↗', 'Go to Markup Workshop: AsciiDoc Reuse & Tables ↗')}
              </Link>
            </div>
          </>
        )}

        {/* Stage 2: Architecture */}
        {activeStage === 'architecture' && (
          <>
            <div className={styles.journeyStageBanner}>
              <h5 className={styles.journeyStageBannerTitle}>
                {t('阶段 2：信息架构与认知解耦（从原始数据到高阶资产）', 'Phase 2: Information Typing & Cognitive Decoupling')}
              </h5>
              <span className={styles.journeyStageAssetTag}>
                Architecture: Concept / Task / Reference
              </span>
            </div>

            <p className={styles.journeyNarrative}>
              {t(
                '即使标记语法再完备，若把 WAL 物理原理、容灾切换命令与参数字典揉进同一页文档，读者依然会面临认知过载。FlowingDocs 严格采用类型化解耦（Information Typing）：',
                'Even with perfect markup, cramming WAL physics, failover commands, and parameter tables into a single page overwhelms readers. FlowingDocs strictly decouples content into three distinct cognitive models:',
              )}
            </p>

            <div className={styles.tabControls}>
              <button
                type="button"
                className={`${styles.tabBtn} ${archTab === 'concept' ? styles.tabBtnActive : ''}`}
                onClick={() => setArchTab('concept')}
              >
                {t('1. Concept 原理解析', '1. Concept Model')}
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${archTab === 'task' ? styles.tabBtnActive : ''}`}
                onClick={() => setArchTab('task')}
              >
                {t('2. Task 操作闭环', '2. Task Procedure')}
              </button>
              <button
                type="button"
                className={`${styles.tabBtn} ${archTab === 'reference' ? styles.tabBtnActive : ''}`}
                onClick={() => setArchTab('reference')}
              >
                {t('3. Reference 零二义契约', '3. Reference Contract')}
              </button>
            </div>

            {archTab === 'concept' && (
              <div className={`${styles.journeyBox} ${styles.journeyBoxGood}`}>
                <div className={styles.journeyBoxHeader}>
                  <span>
                    <Icon name="bulb" />
                    {' '}
                    概念心智模型 (Concept Topic)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--iw-sky)' }}>WAL Progressive Disclosure</span>
                </div>
                <div className={styles.journeyBoxContent}>
                  <strong>{t('回答读者的本质疑问：系统为什么需要 Write-Ahead Logging？', 'Answers reader mental question: Why does the system need Write-Ahead Logging?')}</strong>
                  <p style={{ margin: '6px 0' }}>
                    {t(
                      '通过四层渐进式呈现：第一层讲清“随机写变顺序写”的一句话本质；第二层给出事务提交到磁盘的全局总览；第三层剖析 User Thread -> Log Buffer -> OS Page Cache -> Redo Log 物理链路；第四层定义 IOPS 与 fsync 三维性能边界。',
                      'Four-tier progressive disclosure: Tier 1 captures random-to-sequential write essence; Tier 2 shows global overview; Tier 3 dissects the physical OS cache to NVMe pipeline; Tier 4 details IOPS boundary matrices.',
                    )}
                  </p>
                  <Link to="/docs/information-design/concept#wal-demo" className={styles.journeyModuleLink}>
                    →
                    {' '}
                    {t('查看概念文档 WAL 动态心智模型', 'View Concept Doc WAL Interactive Demo')}
                  </Link>
                </div>
              </div>
            )}

            {archTab === 'task' && (
              <div className={`${styles.journeyBox} ${styles.journeyBoxGood}`}>
                <div className={styles.journeyBoxHeader}>
                  <span>
                    <Icon name="target" />
                    {' '}
                    任务规程闭环 (Task Topic)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--iw-green)' }}>7±2 Deterministic SOP</span>
                </div>
                <div className={styles.journeyBoxContent}>
                  <strong>{t('目标导向规程：高危数据库故障灾备切换 SOP', 'Goal-oriented procedure: High-stakes database disaster recovery SOP')}</strong>
                  <p style={{ margin: '6px 0' }}>
                    {t(
                      '剔除“鼠标移到右上角”等机械点击流水账。严格控制在 4 个关键闭环步骤：1. 前置验证主从复制延迟；2. 在线调优 innodb_flush_log_at_trx_commit；3. 强制刷盘刷新脏页；4. 校验 Seconds_Behind_Master 回归 0。环境约束与高危告警顺应 F 型眼动扫视置于首屏左侧。',
                      'Replaces mechanical clickstreams with 4 deterministic closed-loop steps: 1. Validate replication lag; 2. Dynamically adjust parameter; 3. Force dirty page flush; 4. Verify latency returns to 0.',
                    )}
                  </p>
                  <Link to="/docs/information-design/task#gui-cli-antipatterns" className={styles.journeyModuleLink}>
                    →
                    {' '}
                    {t('查看任务文档反模式对照与 7±2 规范', 'View Task Anti-pattern Matrix & 7±2 Standard')}
                  </Link>
                </div>
              </div>
            )}

            {archTab === 'reference' && (
              <div className={`${styles.journeyBox} ${styles.journeyBoxGood}`}>
                <div className={styles.journeyBoxHeader}>
                  <span>
                    <Icon name="clipboard" />
                    {' '}
                    参考规格契约 (Reference Topic)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--iw-amber)' }}>Zero-Ambiguity Contract</span>
                </div>
                <div className={styles.journeyBoxContent}>
                  <strong>{t('消除 7 大二义性陷阱：外科手术式参数字典', 'Surgical parameter dictionary eliminating 7 fatal ambiguities')}</strong>
                  <p style={{ margin: '6px 0' }}>
                    {t(
                      '拒绝“立即生效”等模糊措辞。提供 8 维严密契约：参数名、数据类型、物理单位（秒/毫秒）、合法取值区间、默认值、特殊值含义（0/1/2 物理差异）、作用域（Global/Session）、动态修改权限，并配套监控告警公式。',
                      'Strict 8-dimension contract: Name, Data Type, Unit, Range, Default, Special Values (0/1/2), Scope, and Dynamic Status, paired with metric alert formulas.',
                    )}
                  </p>
                  <Link to="/docs/information-design/reference#zero-ambiguity" className={styles.journeyModuleLink}>
                    →
                    {' '}
                    {t('查看参考文档二义性陷阱与决策沙箱', 'View Reference Ambiguity Traps & Sandbox')}
                  </Link>
                </div>
              </div>
            )}

            <div className={styles.journeyActionFooter}>
              <span className={styles.journeyNarrative}>
                {t('深入阅读对应信息表达原则：', 'Explore corresponding information design rules:')}
              </span>
              <Link to="/docs/information-design/concept" className={styles.journeyModuleLink}>
                {t('进入概念文档设计规范 ↗', 'Go to Concept Topic Standards ↗')}
              </Link>
            </div>
          </>
        )}

        {/* Stage 3: Publishing & CI */}
        {activeStage === 'publishing' && (
          <>
            <div className={styles.journeyStageBanner}>
              <h5 className={styles.journeyStageBannerTitle}>
                {t('阶段 3：自动化发布与 Docs-as-Code CI 门禁', 'Phase 3: Automated Publishing & CI Quality Gates')}
              </h5>
              <span className={styles.journeyStageAssetTag}>
                Pipeline: Vale + Broken Link + Docusaurus Build
              </span>
            </div>

            <p className={styles.journeyNarrative}>
              {t(
                '资产写成后，不依赖人工口头保证质量。CI 流水线运行 Vale 语义语法检查，自动拦截“立即生效”等二义性用词，验证双语路由一致性与坏链，确保每次文档合并均具备生产可用性。',
                'Quality is guarded automatically rather than by word-of-mouth. CI pipelines run Vale semantic linters to block ambiguous words like "immediately effective", check bilingual routes, and verify zero broken links.',
              )}
            </p>

            {/* Interactive Simulated CI Terminal */}
            <div className={styles.ciTerminalBox}>
              <div className={styles.ciTerminalHeader}>
                <div className={styles.ciTerminalDots}>
                  <span className={`${styles.ciDot} ${styles.ciDotRed}`} />
                  <span className={`${styles.ciDot} ${styles.ciDotYellow}`} />
                  <span className={`${styles.ciDot} ${styles.ciDotGreen}`} />
                </div>
                <span className={styles.ciTerminalTitle}>
                  GitHub Actions Runner — flowingdocs-quality-gate.yml
                </span>
                <button
                  type="button"
                  className={styles.ciTriggerBtn}
                  onClick={runCiSimulation}
                  disabled={ciStatus === 'running'}
                >
                  {ciStatus === 'running'
                    ? t('⏳ 门禁运行中...', '⏳ Running Checks...')
                    : t('▶ 运行 CI 质量门禁', '▶ Run CI Quality Gate')}
                </button>
              </div>

              <div className={styles.ciTerminalBody}>
                <div className={styles.ciInfoLine}>
                  <span className={styles.ciPrompt}>$</span>
                  git log -1 --oneline : &quot;feat(mysql): add innodb_flush_log crash recovery SOP&quot;
                </div>

                {ciStep >= 1 && (
                  <div className={styles.ciPassLine}>
                    ✓ [1/4] Vale Semantic Linter: FlowingDocs.NoVagueImmediateEffect Passed (0 errors, 0 warnings)
                  </div>
                )}

                {ciStep >= 2 && (
                  <div className={styles.ciPassLine}>
                    ✓ [2/4] Asciidoctor &amp; Markdown Syntax: Checked 4 modules, 0 heading hierarchy errors
                  </div>
                )}

                {ciStep >= 3 && (
                  <div className={styles.ciPassLine}>
                    ✓ [3/4] Broken Link Checker: Scanned 120 internal cross-refs, 0 broken links
                  </div>
                )}

                {ciStep >= 4 && (
                  <div className={styles.ciPassLine}>
                    ✓ [4/4] Docusaurus SSG: Compiled zh (default) and en (i18n) static targets in 2.4s
                  </div>
                )}

                {ciStatus === 'done' && (
                  <div style={{ color: 'var(--iw-sky)', marginTop: '0.4rem', fontWeight: 700 }}>
                    {renderWithIcons('🚀 All Quality Gates Passed! Pull Request is ready to merge into production.')}
                  </div>
                )}

                {ciStatus === 'idle' && (
                  <div className={styles.ciInfoLine}>
                    {t(
                      '👉 单击右上角“运行 CI 质量门禁”按钮，模拟真实 Docs-as-Code 校验流水线。',
                      '👉 Click "Run CI Quality Gate" above to simulate the automated Docs-as-Code pipeline.',
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.journeyActionFooter}>
              <span className={styles.journeyNarrative}>
                {t('深入阅读对应发布架构与选型：', 'Explore publishing tools & tradeoffs:')}
              </span>
              <Link to="/docs/publishing" className={styles.journeyModuleLink}>
                {t('进入文档发布体系与静态站点生成器选型 ↗', 'Go to Publishing Architecture & SSG Evaluation ↗')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
