import { PRESETS, reuseExamples } from './reuseData'
import type { Preset } from './reuseData'
import React, { useState } from 'react'
import CodeBlock from '@theme/CodeBlock'
import type { Locale } from './course'
import type { Format } from './workbook'
import styles from './ContentReuse.module.css'
import { Icon, renderWithIcons } from '../DocsIcon'

export default function ContentReuse({ locale, format }: { locale: Locale, format: Format }) {
  const trs = (zh: string, en: string) => locale === 'zh' ? zh : en
  const tr = (zh: string, en: string) => renderWithIcons(locale === 'zh' ? zh : en)

  const defaultPreset = PRESETS[1]!
  const [activePreset, setActivePreset] = useState<string>('polaris')
  const [productName, setProductName] = useState<string>(
    locale === 'zh' ? defaultPreset.productNameZh : defaultPreset.productNameEn,
  )
  const [clusterPort, setClusterPort] = useState<string>(defaultPreset.port)
  const [sharedWarning, setSharedWarning] = useState<string>(
    locale === 'zh' ? defaultPreset.warningZh : defaultPreset.warningEn,
  )
  const [separateStaging, setSeparateStaging] = useState<boolean>(false)
  const [pulseKey, setPulseKey] = useState<number>(0)

  const stagingWaiver = trs(
    '本手册适用于演练环境。使用测试数据，结束后恢复初始配置。',
    'This guide covers a practice environment. Use test data and restore the initial configuration afterwards.',
  )

  function applyPreset(preset: Preset) {
    setActivePreset(preset.id)
    setProductName(locale === 'zh' ? preset.productNameZh : preset.productNameEn)
    setClusterPort(preset.port)
    setSharedWarning(locale === 'zh' ? preset.warningZh : preset.warningEn)
    setPulseKey(k => k + 1)
  }

  function handleNameChange(val: string) {
    setProductName(val)
    setActivePreset('custom')
    setPulseKey(k => k + 1)
  }

  function handlePortChange(val: string) {
    setClusterPort(val)
    setActivePreset('custom')
    setPulseKey(k => k + 1)
  }

  function handleWarningChange(val: string) {
    setSharedWarning(val)
    setActivePreset('custom')
    setPulseKey(k => k + 1)
  }

  const examples = reuseExamples(locale, format, { productName, clusterPort, sharedWarning, separateStaging })

  return (
    <section className={styles.container} aria-labelledby="reuse-workbench-title">
      <span className={styles.eyebrow}>{tr('内容复用 · 交互示意', 'Content reuse · Interactive illustration')}</span>
      <h2 id="reuse-workbench-title" className={styles.title}>
        {tr('一处修改，多份文档更新', 'Change once, update multiple guides')}
      </h2>
      <p className={styles.lead}>
        {tr(
          '同一个产品名、端口或提醒，可能出现在多份说明里。改一改下面的共享内容，观察两份手册怎样变化，再试试让手册 B 保留自己的提醒。',
          'A product name, port, or notice may appear in several guides. Edit the shared content below and compare both guides. Then try giving Manual B its own notice.',
        )}
      </p>

      <p className={styles.scopeNote}>{tr('这是虚构产品的浏览器示意，不会运行 AsciiDoc、Markdown 或 DITA 发布工具，也不会修改你的练习草稿。下方代码用于对照机制，正式使用前需要在所选工具链中验证。', 'This browser illustration uses a fictional product. It does not run an AsciiDoc, Markdown, or DITA publishing tool or change your lesson drafts. The code below illustrates the mechanisms; verify it in your chosen toolchain before use.')}</p>

      {/* Interactive Workbench */}
      <div className={styles.workbench}>
        {/* Central Source of Truth Control Center */}
        <div className={styles.controlCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>
              <span><Icon name="gear" /></span>
              <span>{tr('编辑共享内容', 'Edit shared content')}</span>
            </div>
            <span className={styles.cardBadge}>
              {activePreset === 'custom'
                ? tr('自定义编辑中', 'Custom Editing')
                : PRESETS.find(p => p.id === activePreset)?.[locale === 'zh' ? 'badgeZh' : 'badgeEn']}
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className={styles.presetBar} role="group" aria-label={trs('示例内容预设', 'Example presets')}>
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                className={styles.presetBtn}
                data-active={activePreset === preset.id}
                aria-pressed={activePreset === preset.id}
                onClick={() => applyPreset(preset)}
              >
                <span>{renderWithIcons(locale === 'zh' ? preset.labelZh : preset.labelEn)}</span>
              </button>
            ))}
          </div>

          {/* Editable Attributes */}
          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <label className={styles.fieldLabel} htmlFor="prop-product-name">
                <span>{tr('产品名称', 'Product name')}</span>
                <span className={styles.tokenLabel}>{tr('共享值', 'Shared value')}</span>
              </label>
              <input
                id="prop-product-name"
                type="text"
                className={styles.input}
                maxLength={100}
                value={productName}
                onChange={e => handleNameChange(e.target.value)}
                placeholder={trs('输入产品名称或代号...', 'Enter product name or codename...')}
              />
            </div>

            <div className={styles.formField}>
              <label className={styles.fieldLabel} htmlFor="prop-cluster-port">
                <span>{tr('服务端口', 'Service port')}</span>
                <span className={styles.tokenLabel}>{tr('共享值', 'Shared value')}</span>
              </label>
              <input
                id="prop-cluster-port"
                type="text"
                className={styles.input}
                maxLength={100}
                value={clusterPort}
                onChange={e => handlePortChange(e.target.value)}
                placeholder="5432"
              />
            </div>
          </div>

          <div className={styles.formField} style={{ marginTop: 14 }}>
            <label className={styles.fieldLabel} htmlFor="shared-warning-snippet">
              <span>{tr('共享提醒', 'Shared notice')}</span>
              <span className={styles.tokenLabel}>{tr('共享片段', 'Shared fragment')}</span>
            </label>
            <textarea
              id="shared-warning-snippet"
              className={styles.textarea}
              rows={3}
              maxLength={1200}
              value={sharedWarning}
              onChange={e => handleWarningChange(e.target.value)}
              placeholder={trs('输入共享提醒...', 'Enter a shared notice...')}
            />
          </div>

          {/* Conditional Override Toggle */}
          <div className={styles.toggleRow}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={separateStaging}
                onChange={(e) => {
                  setSeparateStaging(e.target.checked)
                  setPulseKey(k => k + 1)
                }}
              />
              <span>{tr('手册 B 使用自己的提醒', 'Use a separate notice in Manual B')}</span>
            </label>
            <span style={{ fontSize: 12, color: 'var(--lab-muted)' }}>
              {separateStaging
                ? tr('手册 B 的提醒不再随共享内容变化', 'Manual B keeps its own notice')
                : tr('两份手册使用同一条提醒', 'Both guides share the same notice')}
            </span>
          </div>
        </div>

        {/* Live Multi-Manual Viewports */}
        <div className={styles.manualsGrid}>
          {/* Manual A: Production */}
          <article className={styles.manualCard} aria-label={trs('手册 A 渲染结果', 'Manual A Preview')}>
            <div className={styles.manualHeader}>
              <div className={styles.manualTitleGroup}>
                <h3 className={styles.manualDocTitle}>
                  {tr('手册 A：运维说明', 'Manual A: Operations')}
                </h3>
                <span className={styles.manualSubtitle}>
                  guide-production.
                  {format === 'dita' ? 'dita' : format === 'markdown' ? 'mdx' : 'adoc'}
                </span>
              </div>
              <span className={`${styles.envPill} ${styles.envProd}`}>{tr('运维示例', 'Production')}</span>
            </div>

            <div className={styles.manualBody}>
              <p>
                {tr('欢迎查阅 ', 'Welcome to the ')}
                <span key={`prod-name-${pulseKey}`} className={`${styles.tokenHighlight} ${styles.tokenPulse}`}>
                  {productName || tr('(未命名产品)', '(Unnamed)')}
                </span>
                {tr(
                  ' 运维说明。本示例的服务端口为 ',
                  ' operations guide. This example uses service port ',
                )}
                <span key={`prod-port-${pulseKey}`} className={`${styles.tokenHighlight} ${styles.tokenPulse}`}>
                  :
                  {clusterPort || '---'}
                </span>
                {tr('。操作前请阅读以下提醒：', '. Read the following notice before continuing:')}
              </p>

              {/* Shared Warning Callout */}
              <div className={`${styles.calloutBlock} ${styles.calloutShared}`}>
                <div className={styles.calloutHeader}>
                  <span className={styles.calloutTitle}>
                    <span><Icon name="alert" /></span>
                    <span>{tr('共享提醒', 'Shared notice')}</span>
                  </span>
                  <span className={styles.snippetTag}>{tr('随共享内容更新', 'Follows shared content')}</span>
                </div>
                <p className={styles.calloutText}>{sharedWarning || tr('(告警内容为空)', '(Empty notice)')}</p>
              </div>

              <p style={{ fontSize: 12, color: 'var(--lab-muted)' }}>
                {tr(
                  '名称、端口和提醒使用上方的共享内容。',
                  'The name, port, and notice use the shared values above.',
                )}
              </p>
            </div>
          </article>

          {/* Manual B: Staging / Sandbox */}
          <article className={styles.manualCard} aria-label={trs('手册 B 渲染结果', 'Manual B Preview')}>
            <div className={styles.manualHeader}>
              <div className={styles.manualTitleGroup}>
                <h3 className={styles.manualDocTitle}>
                  {tr('手册 B：演练说明', 'Manual B: Practice')}
                </h3>
                <span className={styles.manualSubtitle}>
                  guide-staging.
                  {format === 'dita' ? 'dita' : format === 'markdown' ? 'mdx' : 'adoc'}
                </span>
              </div>
              <span className={`${styles.envPill} ${styles.envStaging}`}>{tr('测试沙箱', 'Staging / QA')}</span>
            </div>

            <div className={styles.manualBody}>
              <p>
                {tr('本手册用于演练 ', 'This guide covers practice with ')}
                <span key={`stage-name-${pulseKey}`} className={`${styles.tokenHighlight} ${styles.tokenPulse}`}>
                  {productName || tr('(未命名产品)', '(Unnamed)')}
                </span>
                {tr('，本示例的服务端口为 ', '. This example uses service port ')}
                <span key={`stage-port-${pulseKey}`} className={`${styles.tokenHighlight} ${styles.tokenPulse}`}>
                  :
                  {clusterPort || '---'}
                </span>
                {tr('。本手册采用以下提醒：', '. This guide uses the following notice:')}
              </p>

              {/* Callout: Shared or Override */}
              <div
                className={`${styles.calloutBlock} ${
                  separateStaging ? styles.calloutOverride : styles.calloutShared
                }`}
              >
                <div className={styles.calloutHeader}>
                  <span className={styles.calloutTitle}>
                    <span>{separateStaging ? <Icon name="zap" /> : <Icon name="alert" />}</span>
                    <span>
                      {separateStaging
                        ? tr('独立提醒', 'Separate notice')
                        : tr('共享提醒', 'Shared notice')}
                    </span>
                  </span>
                  <span className={styles.snippetTag}>
                    {separateStaging ? trs('独立内容', 'Separate content') : trs('随共享内容更新', 'Follows shared content')}
                  </span>
                </div>
                <p className={styles.calloutText}>
                  {separateStaging ? stagingWaiver : sharedWarning || tr('(告警内容为空)', '(Empty notice)')}
                </p>
              </div>

              <p style={{ fontSize: 12, color: 'var(--lab-muted)' }}>
                {separateStaging
                  ? tr(
                      '手册 B 保留自己的提醒，产品名称和端口仍使用共享值。',
                      'Manual B keeps its own notice while continuing to share the product name and port.',
                    )
                  : tr(
                      '两份手册的提醒来自同一个片段。',
                      'Both guides use the same notice fragment.',
                    )}
              </p>
            </div>
          </article>
        </div>
      </div>

      {/* Real-world Implementation By Markup Format */}
      <h3>{tr('当前格式怎样实现', 'How this format handles reuse')}</h3>
      <p>
        {tr(
          '在实际工程项目中，不同标记语言对“属性变量”、“片段引入”与“条件编译”有着不同的语法支持：',
          'In real documentation systems, markup languages handle tokens, inclusions, and conditionals through distinct syntax primitives:',
        )}
      </p>

      <h4>{examples.title}</h4>
      <p>{examples.description}</p>
      {examples.files.map(file => <CodeBlock key={file.name} language={file.language} title={file.name}>{file.code}</CodeBlock>)}
      {examples.after && <p>{examples.after}</p>}
      {examples.links.map(link => <p key={link.url}><a href={link.url}>{link.label}</a></p>)}

      {/* Architect Guidance Cards */}
      <div className={styles.archGrid}>
        <div className={styles.archCard}>
          <h4>
            <span><Icon name="tag" /></span>
            <span>{tr('行内变量 (Inline Token)', 'Inline Tokens')}</span>
          </h4>
          <p>
            {tr(
              '适用于产品代号、品牌名、默认端口、最新版本号。集中维护可以减少重复修改，但仍需检查各处的适用版本。',
              'For codenames, brand names, ports, and version numbers. Centralize these values to reduce repeated edits, and check which versions each use applies to.',
            )}
          </p>
          <span className={styles.archTag}>{tr('粒度：短词 / 键值', 'Scope: Words / Key-values')}</span>
        </div>

        <div className={styles.archCard}>
          <h4>
            <span><Icon name="file" /></span>
            <span>{tr('块级片段 (Block Snippet)', 'Block Snippets')}</span>
          </h4>
          <p>
            {tr(
              '适用于跨手册共用的数据安全警示、操作前置准备条件、合规声明。作为独立子文件维护，但需确保在各个嵌入上下文中的语法自洽。',
              'For shared safety warnings, prerequisites, and legal disclaimers. Maintain as standalone snippets, ensuring syntactic coherence in context.',
            )}
          </p>
          <span className={styles.archTag}>{tr('粒度：段落 / 步骤块', 'Scope: Paragraphs / Steps')}</span>
        </div>

        <div className={styles.archCard}>
          <h4>
            <span><Icon name="archive" /></span>
            <span>{tr('主题编排 (Topic Map)', 'Topic Maps')}</span>
          </h4>
          <p>
            {tr(
              '适用于整篇完整的“快速上手”、“架构原理解析”或“API 参考”。通过导航目录（Map / Sidebar）按需编排，无需重复拷贝任何正文内容。',
              'For entire topics like "Quickstart" or "Architecture". Compose via navigation maps without duplicating article sources.',
            )}
          </p>
          <span className={styles.archTag}>{tr('粒度：整篇页面 / 模块', 'Scope: Full Pages / Modules')}</span>
        </div>
      </div>
    </section>
  )
}
