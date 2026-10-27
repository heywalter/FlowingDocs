import React, { useState } from 'react'
import styles from './widgets.module.css'
import { renderWithIcons } from '../DocsIcon'

interface ClickStreamCompareProps {
  locale?: 'zh' | 'en'
}

function renderFormatted(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i}>
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i}>
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}

export default function ClickStreamCompare({ locale = 'zh' }: ClickStreamCompareProps) {
  const [scenario, setScenario] = useState<'ui' | 'cli'>('ui')
  const [compareMode, setCompareMode] = useState<'both' | 'anti' | 'good'>('both')
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

  const isZh = locale === 'zh'
  const ts = (zh: string, en: string) => isZh ? zh : en
  const t = (zh: string, en: string) => renderWithIcons(isZh ? zh : en)

  const scenarios = {
    ui: {
      title: t('场景 A：云控制台参数调优 (Web Console GUI Task)', 'Scenario A: Cloud Console Parameter Tuning (GUI Task)'),
      antiTitle: t('❌ 机械动作流水账（反模式）', '❌ Mechanical Action-by-Action Stream (Anti-Pattern)'),
      antiSteps: [
        ts('移动鼠标至页面左侧导航树，展开“关系型数据库”并单击“实例列表”。', 'Hover over the left-hand navigation tree, expand "Relational Database", and click "Instance List".'),
        ts('在展示的数据表格中找到目标主库实例，单击蓝色实例名称文本。', 'Find the primary database in the table and click the blue instance name link.'),
        ts('页面跳转后，在左侧第四个菜单项找到“参数设置”并单击鼠标左键。', 'After navigation, find the fourth sub-menu on the left titled "Parameter Settings" and left-click.'),
        ts('鼠标移至右上角参数搜索框单击，键入 long_query_time 并敲击键盘回车。', 'Click the top-right search box, type long_query_time, and press Enter on your keyboard.'),
        ts('双击参数值单元格清除原有内容，使用键盘键入数字 1。', 'Double-click the parameter value cell to clear content, and type the number 1.'),
        ts('滚动至页面最底部，单击右下角蓝色的“保存并提交修改”按钮。', 'Scroll to the bottom of the viewport and click the blue "Save and Submit" button.'),
        ts('在弹出的白色模态确认对话框中，单击右侧的“确认”按钮。', 'In the white modal confirmation dialog, click the "Confirm" button on the right.'),
      ],
      goodTitle: t('✅ 语义化目标导向规范（推荐最佳实践）', '✅ Goal-Oriented GUI Specification (Best Practice)'),
      goodSteps: [
        ts('在**实例列表**中，单击目标实例进入管理详情页。', 'In the **Instance List**, select the target primary instance.'),
        ts('在左侧导航选择**参数设置**，将 `long_query_time` 修改为目标值（推荐 `1` 秒）。', 'Navigate to **Parameter Settings**, locate `long_query_time`, and set to `1`.'),
        ts('单击**保存修改**并在提示框中确认。', 'Click **Save Changes** and confirm the prompt.'),
      ],
      goodTable: {
        param: 'long_query_time',
        defaultVal: '10s',
        recommended: '1s',
        reboot: t('无需重启（即时生效）', 'Dynamic (No reboot required)'),
      },
      antiMetrics: {
        steps: t('7 步（碎片化）', '7 Steps (Fragmented)'),
        focus: t('微观鼠标点击', 'Micro Mouse Clicks'),
        resilience: t('UI 按钮微调即失效', 'Fragile on UI Changes'),
      },
      goodMetrics: {
        steps: t('3 步 + 参数表', '3 Steps + Spec Table'),
        focus: t('目标动词 + 视觉锚点', 'Target Verbs + Anchors'),
        resilience: t('语义稳定、抗变更', 'Resilient to UI Redesign'),
      },
      antiCritique: t(
        '将读者视角局限于界面像素与鼠标点击流水，缺乏对核心参数与业务意图的交代。前端调整按钮文案或次序时，文档极易失效。',
        'Limits reader focus to pixel clicks rather than business intent. Minor UI menu changes immediately break the procedure.',
      ),
      goodCritique: t(
        '加粗核心界面视觉锚点（如【参数设置】），聚合操作动线，并配套参数决策事实表，便于工程师在不同系统间快速对齐。',
        'Bolds visual UI anchors, consolidates pedestrian micro-steps, and pairs steps with an explicit parameter decision table.',
      ),
    },
    cli: {
      title: t('场景 B：Linux 终端配置 GTID 复制 (CLI Terminal Task)', 'Scenario B: Enabling GTID Replication in Linux (CLI Task)'),
      antiTitle: t('❌ 按键教学流水账（反模式）', '❌ Pedestrian Keystroke Tutorial (Anti-Pattern)'),
      antiSteps: [
        ts('打开 SSH 终端软件，输入 ssh 命令连接到主库物理节点。', 'Open your SSH client and connect to the primary server node.'),
        ts('在命令行终端键入 cd /etc/mysql/mysql.conf.d/ 并敲击回车。', 'Type cd /etc/mysql/mysql.conf.d/ in the shell and press Enter.'),
        ts('键入 sudo vim mysqld.cnf 回车启动文本编辑器。', 'Type sudo vim mysqld.cnf and press Enter to launch vim.'),
        ts('按下键盘上的字母 i 键切换进入文本插入模式。', 'Press the letter i key on your keyboard to enter insert mode.'),
        ts('移动光标至文件末尾按回车换行，逐字键入 gtid_mode=ON。', 'Move cursor to the end of the file, hit enter, and type gtid_mode=ON.'),
        ts('再次按回车换行，逐字键入 enforce_gtid_consistency=ON。', 'Hit enter again and type enforce_gtid_consistency=ON.'),
        ts('按键盘左上角 Esc 键退出编辑模式，连续键入 :wq 并回车保存。', 'Press Esc, type :wq, and press Enter to save and exit.'),
      ],
      goodTitle: t('✅ 声明式配置块规范（推荐最佳实践）', '✅ Declarative Configuration Block (Best Practice)'),
      goodSteps: [
        ts('在配置文件 `/etc/mysql/my.cnf` 的 `[mysqld]` 节点注入 GTID 一致性参数：', 'Append GTID consistency parameters under `[mysqld]` in `/etc/mysql/my.cnf`:'),
      ],
      goodCodeSnippet: '[mysqld]\ngtid_mode = ON\nenforce_gtid_consistency = ON',
      goodFollowUp: ts('保存后执行 `systemctl restart mysqld` 重启数据库服务生效。', 'Execute `systemctl restart mysqld` to apply changes.'),
      antiMetrics: {
        steps: t('7 步（工具按键）', '7 Steps (Tool Keystrokes)'),
        focus: t('Vim 编辑器指令', 'Editor Keystrokes'),
        resilience: t('强依赖人工终端交互', 'Requires Manual Terminal Steps'),
      },
      goodMetrics: {
        steps: t('1 块声明式配置', '1 Declarative Block'),
        focus: t('期望目标状态', 'Desired Target State'),
        resilience: t('幂等可脚本化 (IaC 友好)', 'Idempotent & Scriptable (IaC)'),
      },
      antiCritique: t(
        '将文本编辑器的微观按键过程写入文档，混淆了通用工具操作与系统核心配置目标。',
        'Stuffs generic text editor keystrokes into documentation, cluttering the actual operational intent.',
      ),
      goodCritique: t(
        '直接给出目标状态的声明式配置片段（Declarative Block）。读者可直接复制、一键追加或通过 Ansible/Terraform 自动化纳管。',
        'Provides declarative configuration blocks directly. Readers can copy-paste, script via sed/echo, or integrate into Terraform/Ansible.',
      ),
    },
  }

  const current = scenarios[scenario]

  return (
    <div className={styles.widgetContainer} role="region" aria-label={ts('反模式对照看板', 'Anti-Pattern vs. Best Practice Board')}>
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitleGroup}>
          <h4>{t('机械动作流水账 vs. 目标导向正例对照看板', 'Mechanical Action-Stream vs. Goal-Oriented Practice')}</h4>
          <p>{t('同一业务场景下，对比“机械记录微观动作”与“聚焦业务目标与硬性事实”的巨大差异', 'Compare mechanical micro-action logging against goal-oriented structural clarity under the same user task')}</p>
        </div>
        <div className={styles.tabControls} role="tablist" aria-label={ts('测试对比场景', 'Scenario Selection')}>
          <button
            role="tab"
            aria-selected={scenario === 'ui'}
            className={`${styles.tabBtn} ${scenario === 'ui' ? styles.tabBtnActive : ''}`}
            onClick={() => setScenario('ui')}
            type="button"
          >
            {t('🖥️ 云控制台 GUI 场景', '🖥️ Web Console GUI Task')}
          </button>
          <button
            role="tab"
            aria-selected={scenario === 'cli'}
            className={`${styles.tabBtn} ${scenario === 'cli' ? styles.tabBtnActive : ''}`}
            onClick={() => setScenario('cli')}
            type="button"
          >
            {t('⌨️ Linux 命令行 CLI 场景', '⌨️ Terminal CLI Task')}
          </button>
        </div>
      </div>

      {/* Mobile-Friendly Comparison Mode Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem' }}>
        <div className={styles.tabControls} role="tablist" aria-label={ts('对比显示模式', 'Comparison View Mode')}>
          <button
            role="tab"
            aria-selected={compareMode === 'both'}
            className={`${styles.tabBtn} ${compareMode === 'both' ? styles.tabBtnActive : ''}`}
            onClick={() => setCompareMode('both')}
            type="button"
          >
            {t('⚔️ 双栏并排对照', '⚔️ Side-by-Side')}
          </button>
          <button
            role="tab"
            aria-selected={compareMode === 'anti'}
            className={`${styles.tabBtn} ${compareMode === 'anti' ? styles.tabBtnActive : ''}`}
            onClick={() => setCompareMode('anti')}
            type="button"
          >
            {t('❌ 仅看机械反例', '❌ Anti-Pattern Only')}
          </button>
          <button
            role="tab"
            aria-selected={compareMode === 'good'}
            className={`${styles.tabBtn} ${compareMode === 'good' ? styles.tabBtnActive : ''}`}
            onClick={() => setCompareMode('good')}
            type="button"
          >
            {t('✅ 仅看目标正例', '✅ Best Practice Only')}
          </button>
        </div>
      </div>

      <div className={styles.compareGrid}>
        {/* Anti Pattern Card */}
        {(compareMode === 'both' || compareMode === 'anti') && (
          <div className={styles.cardAnti} style={{ gridColumn: compareMode !== 'both' ? '1 / -1' : undefined }}>
            <div className={styles.cardHeader}>
              <span>{current.antiTitle}</span>
              <span className={styles.badgeNegative}>{t('认知负荷高 · 易失效', 'High Friction')}</span>
            </div>

            <div className={styles.metricRow}>
              <div className={styles.metricItem}>
                {t('步骤形态', 'Structure')}
                <strong>{current.antiMetrics.steps}</strong>
              </div>
              <div className={styles.metricItem}>
                {t('关注焦点', 'Abstraction')}
                <strong>{current.antiMetrics.focus}</strong>
              </div>
              <div className={styles.metricItem}>
                {t('适应性与维护', 'Adaptability')}
                <strong style={{ color: 'var(--iw-red)' }}>{current.antiMetrics.resilience}</strong>
              </div>
            </div>

            {/* Clean Ordered List without double numbering */}
            <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.6 }}>
              {current.antiSteps.map((stepText, idx) => (
                <li key={idx} style={{ marginBottom: '0.35rem' }}>
                  {renderFormatted(stepText)}
                </li>
              ))}
            </ol>

            <p style={{ margin: 'auto 0 0', fontSize: '0.8rem', color: 'var(--iw-red)', background: 'rgba(220, 38, 38, 0.08)', padding: '0.5rem 0.7rem', borderRadius: '5px' }}>
              <strong>{t('问题诊断：', 'Flaw Diagnosis: ')}</strong>
              {current.antiCritique}
            </p>
          </div>
        )}

        {/* Best Practice Card */}
        {(compareMode === 'both' || compareMode === 'good') && (
          <div className={styles.cardGood} style={{ gridColumn: compareMode !== 'both' ? '1 / -1' : undefined }}>
            <div className={styles.cardHeader}>
              <span>{current.goodTitle}</span>
              <span className={styles.badgePositive}>{t('工程规范 · 长效稳定', 'Production Grade')}</span>
            </div>

            <div className={styles.metricRow}>
              <div className={styles.metricItem}>
                {t('步骤形态', 'Structure')}
                <strong>{current.goodMetrics.steps}</strong>
              </div>
              <div className={styles.metricItem}>
                {t('关注焦点', 'Abstraction')}
                <strong>{current.goodMetrics.focus}</strong>
              </div>
              <div className={styles.metricItem}>
                {t('适应性与维护', 'Adaptability')}
                <strong style={{ color: 'var(--iw-green)' }}>{current.goodMetrics.resilience}</strong>
              </div>
            </div>

            {/* GUI Best Practice View */}
            {scenario === 'ui' && (
              <div>
                <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.6 }}>
                  {current.goodSteps.map((stepText, idx) => {
                    const isParamStep = idx === 1
                    const isHighlighted = isParamStep && hoveredStep === 1
                    return (
                      <li
                        key={idx}
                        style={{
                          marginBottom: '0.35rem',
                          cursor: isParamStep ? 'pointer' : 'default',
                          background: isHighlighted ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                          borderRadius: '4px',
                          padding: isParamStep ? '2px 4px' : 0,
                          transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={() => isParamStep && setHoveredStep(1)}
                        onMouseLeave={() => isParamStep && setHoveredStep(null)}
                        onClick={() => isParamStep && setHoveredStep(hoveredStep === 1 ? null : 1)}
                      >
                        {renderFormatted(stepText)}
                        {isParamStep && (
                          <span style={{ fontSize: '0.75rem', marginLeft: '6px', color: 'var(--iw-green)', border: '1px solid #10b981', padding: '0 4px', borderRadius: '3px', fontWeight: 600 }}>
                            {t('🔗 联动事实表', '🔗 Linked to Fact Table')}
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ol>

                {'goodTable' in current && current.goodTable && (
                  <div
                    style={{
                      marginTop: '0.6rem',
                      border: hoveredStep === 1 ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)',
                      boxShadow: hoveredStep === 1 ? '0 0 12px rgba(16, 185, 129, 0.25)' : 'none',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      fontSize: '0.78rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '4px 8px', fontWeight: 700, color: 'var(--iw-green)' }}>
                      {t('参数决策硬性事实表 (附注)', 'Parameter Decision Table (Fact Sheet)')}
                    </div>
                    <div style={{ padding: '6px 8px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', background: 'var(--ifm-background-color)' }}>
                      <div>
                        <strong>{t('参数：', 'Key: ')}</strong>
                        <code>{current.goodTable.param}</code>
                      </div>
                      <div>
                        <strong>{t('默认值：', 'Default: ')}</strong>
                        {current.goodTable.defaultVal}
                      </div>
                      <div>
                        <strong>{t('推荐值：', 'Recommended: ')}</strong>
                        {current.goodTable.recommended}
                      </div>
                      <div>
                        <strong>{t('重启要求：', 'Impact: ')}</strong>
                        {current.goodTable.reboot}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CLI Best Practice View */}
            {scenario === 'cli' && (
              <div>
                <ol style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: 1.6 }}>
                  {current.goodSteps.map((stepText, idx) => (
                    <li key={idx} style={{ marginBottom: '0.35rem' }}>
                      {renderFormatted(stepText)}
                    </li>
                  ))}
                </ol>

                {'goodCodeSnippet' in current && current.goodCodeSnippet && (
                  <pre style={{ margin: '0.5rem 0', padding: '0.6rem', background: '#181920', color: '#79c0ff', borderRadius: '5px', fontSize: '0.76rem', fontFamily: 'ui-monospace, monospace' }}>
                    <code>{current.goodCodeSnippet}</code>
                  </pre>
                )}

                {'goodFollowUp' in current && current.goodFollowUp && (
                  <p style={{ margin: '0.4rem 0 0', fontSize: '0.82rem', lineHeight: 1.5 }}>
                    {renderFormatted(current.goodFollowUp)}
                  </p>
                )}
              </div>
            )}

            <p style={{ margin: 'auto 0 0', fontSize: '0.8rem', color: 'var(--iw-green)', background: 'rgba(16, 185, 129, 0.08)', padding: '0.5rem 0.7rem', borderRadius: '5px' }}>
              <strong>{t('工程收益：', 'Engineering Benefit: ')}</strong>
              {current.goodCritique}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
