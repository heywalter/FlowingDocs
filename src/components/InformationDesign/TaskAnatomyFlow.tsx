import React from 'react'
import styles from './widgets.module.css'

interface TaskAnatomyFlowProps {
  locale?: 'zh' | 'en'
}

interface AnatomyItem {
  num: string
  anchor: string
  phase: 'readiness' | 'execution' | 'safety'
  phaseZh: string
  phaseEn: string
  requirement: 'mandatory' | 'conditional'
  titleZh: string
  titleEn: string
  descZh: string
  descEn: string
}

const ANATOMY_ITEMS: AnatomyItem[] = [
  {
    num: '01',
    anchor: '#anatomy-title',
    phase: 'readiness',
    phaseZh: '准入准备',
    phaseEn: 'Readiness',
    requirement: 'mandatory',
    titleZh: '1. 动词标题',
    titleEn: '1. Action Title',
    descZh: '以祈使动宾短语开头，专注真实任务，坚决去除“如何/轻松”等虚词修饰。',
    descEn: 'Lead with imperative action verbs; focus on user goals without filler words.',
  },
  {
    num: '02',
    anchor: '#anatomy-desc',
    phase: 'readiness',
    phaseZh: '准入准备',
    phaseEn: 'Readiness',
    requirement: 'mandatory',
    titleZh: '2. 精炼短描述',
    titleEn: '2. Short Description',
    descZh: '2~3 句话讲清“是什么、适用场景与核心业务收益”，紧随主标题无需另设 H2。',
    descEn: '2-3 sentences explaining capability, operational scenario, and value proposition.',
  },
  {
    num: '03',
    anchor: '#anatomy-prerequisites',
    phase: 'readiness',
    phaseZh: '准入准备',
    phaseEn: 'Readiness',
    requirement: 'conditional',
    titleZh: '3. 强前置条件',
    titleEn: '3. Prerequisites',
    descZh: '显式列出环境版本、角色权限与上游依赖链接，避免读者中途操作卡死。',
    descEn: 'Explicitly state required versions, permissions, and upstream links before starting.',
  },
  {
    num: '04',
    anchor: '#anatomy-limits',
    phase: 'readiness',
    phaseZh: '准入准备',
    phaseEn: 'Readiness',
    requirement: 'conditional',
    titleZh: '4. 限制与预警',
    titleEn: '4. Limits & Precautions',
    descZh: '交代硬性规格配额（Limits）与整机闪断/重载副作用（Precautions）。',
    descEn: 'Declare hard quota boundaries (Limits) and runtime side effects (Precautions).',
  },
  {
    num: '05',
    anchor: '#rule-of-seven',
    phase: 'execution',
    phaseZh: '执行主线',
    phaseEn: 'Execution',
    requirement: 'mandatory',
    titleZh: '5. 步骤流 (7±2)',
    titleEn: '5. Procedure (7±2)',
    descZh: '米勒定律控幅 5~9 步；每步严格落实“动宾指令 + 复制载体 + 预期结果”。',
    descEn: 'Miller\'s 7±2 rule; each step delivers action command, carrier, and expected output.',
  },
  {
    num: '06',
    anchor: '#anatomy-verification',
    phase: 'execution',
    phaseZh: '执行主线',
    phaseEn: 'Execution',
    requirement: 'mandatory',
    titleZh: '6. 结果验证',
    titleEn: '6. Verification',
    descZh: '提供确切的验证命令与预期控制台回显，让读者百分之百确认操作已成功。',
    descEn: 'Provide concrete diagnostic commands and expected terminal output for certainty.',
  },
  {
    num: '07',
    anchor: '#anatomy-rollback',
    phase: 'safety',
    phaseZh: '闭环容灾',
    phaseEn: 'Safety',
    requirement: 'conditional',
    titleZh: '7. 异常与回退',
    titleEn: '7. Rollback',
    descZh: '高频报错排查速查与安全逆向回滚指南，杜绝生产环境留下半成品脏数据。',
    descEn: 'Actionable error troubleshooting and safe reverse rollback instructions.',
  },
  {
    num: '08',
    anchor: '#anatomy-next',
    phase: 'safety',
    phaseZh: '闭环容灾',
    phaseEn: 'Safety',
    requirement: 'conditional',
    titleZh: '8. 后续任务',
    titleEn: '8. Next Steps',
    descZh: '承接下游业务关联任务，形成连贯操作动线，杜绝孤岛式文档断层。',
    descEn: 'Guide reader into logical downstream tasks, building a continuous workflow journey.',
  },
]

export default function TaskAnatomyFlow({ locale = 'zh' }: TaskAnatomyFlowProps) {
  const isZh = locale !== 'en'

  const getPhaseClass = (phase: 'readiness' | 'execution' | 'safety') => {
    switch (phase) {
      case 'readiness':
        return styles.phaseReadiness
      case 'execution':
        return styles.phaseExecution
      case 'safety':
        return styles.phaseSafety
      default:
        return ''
    }
  }

  return (
    <div className={styles.anatomyContainer}>
      <div className={styles.anatomyHeader}>
        <div className={styles.anatomyHeaderTitle}>
          {isZh
            ? '操作类文档 8 大标准解构骨架（Task Anatomy Architecture）'
            : 'Standard Anatomy of a Production-Grade Task Topic (8 Modules)'}
        </div>
        <div className={styles.anatomyHeaderHint}>
          {isZh ? '点击卡片可平滑定位对应规范' : 'Click any card to jump to its specification below'}
        </div>
      </div>

      <div className={styles.anatomyGrid}>
        {ANATOMY_ITEMS.map(item => (
          <a
            key={item.num}
            href={item.anchor}
            className={styles.anatomyCard}
            title={isZh ? `跳转至 ${item.titleZh}` : `Jump to ${item.titleEn}`}
          >
            <div className={styles.anatomyCardTop}>
              <span className={styles.anatomyCardNum}>{item.num}</span>
              <div className={styles.anatomyBadgeGroup}>
                <span className={`${styles.anatomyCardPhase} ${getPhaseClass(item.phase)}`}>
                  {isZh ? item.phaseZh : item.phaseEn}
                </span>
                <span
                  className={`${styles.anatomyCardReq} ${
                    item.requirement === 'mandatory' ? styles.reqMandatory : styles.reqConditional
                  }`}
                >
                  {isZh
                    ? item.requirement === 'mandatory'
                      ? '核心必选'
                      : '按需可选'
                    : item.requirement === 'mandatory'
                      ? 'Core'
                      : 'Conditional'}
                </span>
              </div>
            </div>

            <div className={styles.anatomyCardTitle}>
              {isZh ? item.titleZh : item.titleEn}
            </div>

            <p className={styles.anatomyCardDesc}>
              {isZh ? item.descZh : item.descEn}
            </p>
          </a>
        ))}
      </div>

      <div className={styles.anatomyFooterBox}>
        <div className={styles.anatomyPhaseBar}>
          <span style={{ fontWeight: 700, color: 'var(--ifm-heading-color)' }}>
            {isZh ? '生命周期三段推进：' : 'Lifecycle Flow: '}
          </span>
          <span className={styles.anatomyPhaseTag}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#6366f1' }} />
            {isZh ? '准入准备 (01-04)' : 'Readiness (01-04)'}
          </span>
          <span>➔</span>
          <span className={styles.anatomyPhaseTag}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10b981' }} />
            {isZh ? '执行主线 (05-06)' : 'Execution (05-06)'}
          </span>
          <span>➔</span>
          <span className={styles.anatomyPhaseTag}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#f59e0b' }} />
            {isZh ? '闭环容灾 (07-08)' : 'Safety (07-08)'}
          </span>
        </div>

        <div className={styles.anatomyRuleBar}>
          <span style={{ fontWeight: 700, color: 'var(--ifm-heading-color)' }}>
            {isZh ? '4+4 极简落地法则：' : '4+4 Practical Rules: '}
          </span>
          <span className={styles.anatomyRuleItem}>
            <span className={`${styles.anatomyCardReq} ${styles.reqMandatory}`}>
              {isZh ? '4 项核心必选' : '4 Core Mandatory'}
            </span>
            <span className={styles.anatomyRuleText}>
              {isZh
                ? '01 标题、02 短描述、05 步骤流、06 结果验证（构成任务可执行的最小闭环 MVP）'
                : '01 Title, 02 Short Desc, 05 Procedure, 06 Verification (Core MVP Loop)'}
            </span>
          </span>
          <span className={styles.anatomyRuleItem}>
            <span className={`${styles.anatomyCardReq} ${styles.reqConditional}`}>
              {isZh ? '4 项按需可选' : '4 Conditional'}
            </span>
            <span className={styles.anatomyRuleText}>
              {isZh
                ? '03 前置门禁、04 限制预警、07 异常回退、08 后续任务（视环境门槛、破坏风险与流程阶段按需配置）'
                : '03 Prereqs, 04 Limits, 07 Rollback, 08 Next Steps (Activated based on risk and dependencies)'}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}
