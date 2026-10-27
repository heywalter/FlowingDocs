import React, { useState } from 'react'
import styles from './widgets.module.css'

interface AudienceDetailCurveProps {
  locale?: 'zh' | 'en'
}

type Mode = 'novice' | 'experienced' | 'both'

export default function AudienceDetailCurve({ locale = 'zh' }: AudienceDetailCurveProps) {
  const [mode, setMode] = useState<Mode>('both')
  const [selectedPoint, setSelectedPoint] = useState<number>(0)

  const isZh = locale === 'zh'
  const t = (zh: string, en: string) => (isZh ? zh : en)

  const points = [
    {
      id: 0,
      title: t('基础环境预检与依赖安装', 'Basic Pre-flight Checks & Setup'),
      type: t('基础日常任务 (Basic)', 'Basic Routine Task'),
      noviceText: t('【新手读者】依赖高。需交代操作系统环境、端口 3306 占用检查命令与预期返回值，缺少前置说明易导致流程阻塞。', '[Novice] High detail needed. Explicitly list OS requirements, port check commands, and expected console returns. Omissions stall progress.'),
      experiencedText: t('【资深工程师】依赖低。交代目标版本或提供一键验证脚本即可，过于琐碎的基础步骤会降低检索效率。', '[Experienced] Low detail needed. State the target version or provide a validation script. Pedestrian instructions reduce scanning efficiency.'),
      noviceY: 230,
      expY: 80,
    },
    {
      id: 1,
      title: t('单节点服务拉起与配置微调', 'Single Node Launch & Config Tuning'),
      type: t('核心业务链路 (Intermediate)', 'Core Routine Task'),
      noviceText: t('【新手读者】依赖中等。需给出配置文件路径、基础服务管理命令与初次连接密码设定步骤。', '[Novice] Medium detail needed. Provide exact configuration file paths, systemctl commands, and root password setup.'),
      experiencedText: t('【资深工程师】依赖极简。直接给出配置文件路径与核心参数键值，无需展开常规文件操作。', '[Experienced] Minimal detail needed. Provide the config path and key-value changes. Muscle memory handles execution.'),
      noviceY: 170,
      expY: 120,
    },
    {
      id: 2,
      title: t('跨机房主从半同步复制搭建', 'Cross-DC Semi-sync Replication Setup'),
      type: t('高级复杂架构 (Advanced)', 'Advanced Architecture Task'),
      noviceText: t('【新手读者】需拆解为清晰阶段（证书准备、GTID 校验、从库启动），并醒目标注网络抖动风险。', '[Novice] Decompose into clear phases (certs, GTID, replica start) with prominent network jitter warnings.'),
      experiencedText: t('【资深工程师】依赖提升。重点关注复制线程并发度、半同步超时阈值（rpl_semi_sync_master_timeout）与网络分区时的行为。', '[Experienced] High detail demand. Focus on binlog formats, worker threads, timeout thresholds, and network partition behavior.'),
      noviceY: 120,
      expY: 220,
    },
    {
      id: 3,
      title: t('生产集群秒级故障倒换与数据回溯', 'Production Failover & Zero-Downtime Rollback'),
      type: t('高危生产救灾 (High Risk)', 'High-Risk Incident Recovery'),
      noviceText: t('【新手读者】高危操作。需设置权限门禁提示与双人复核前置确认清单。', '[Novice] High risk. Require senior oversight, explicit verification gates, and permission guardrails.'),
      experiencedText: t('【资深工程师】详尽度要求最高。必须提供确定性的回滚指令、数据校验 SQL 与脑裂防范机制。', '[Experienced] Maximum detail. Demand zero-downtime rollback runbooks, checksum validation SQL, and split-brain safeguards.'),
      noviceY: 90,
      expY: 270,
    },
  ]

  const active = points[selectedPoint]!

  return (
    <div className={styles.widgetContainer} role="region" aria-label={t('受众经验与详尽度模型', 'Audience Experience vs. Detail Curve')}>
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitleGroup}>
          <h4>{t('受众经验 vs. 步骤详尽度对照模型', 'Audience Experience vs. Detail Curve Model')}</h4>
          <p>{t('切换读者角色，观察不同任务复杂度下对文档详尽程度的需求分化', 'Switch persona to observe how detail requirements diverge as task complexity scales')}</p>
        </div>
        <div className={styles.tabControls} role="tablist" aria-label={t('读者群体对比', 'Audience Personas')}>
          <button
            role="tab"
            aria-selected={mode === 'both'}
            className={`${styles.tabBtn} ${mode === 'both' ? styles.tabBtnActive : ''}`}
            onClick={() => setMode('both')}
            type="button"
          >
            {t('双曲线对比', 'Compare Both')}
          </button>
          <button
            role="tab"
            aria-selected={mode === 'novice'}
            className={`${styles.tabBtn} ${mode === 'novice' ? styles.tabBtnActive : ''}`}
            onClick={() => setMode('novice')}
            type="button"
          >
            {t('新手用户 (Novice)', 'Novice Users')}
          </button>
          <button
            role="tab"
            aria-selected={mode === 'experienced'}
            className={`${styles.tabBtn} ${mode === 'experienced' ? styles.tabBtnActive : ''}`}
            onClick={() => setMode('experienced')}
            type="button"
          >
            {t('资深专家 (Experienced)', 'Experienced SRE')}
          </button>
        </div>
      </div>

      <div className={styles.chartArea}>
        <svg viewBox="0 0 600 320" className={styles.svgCurve} aria-hidden="true">
          {/* Grid lines */}
          <line x1="70" y1="280" x2="570" y2="280" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
          <line x1="70" y1="210" x2="570" y2="210" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
          <line x1="70" y1="140" x2="570" y2="140" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
          <line x1="70" y1="70" x2="570" y2="70" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="4 4" />
          <line x1="70" y1="30" x2="70" y2="280" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />

          {/* Axes labels */}
          <text x="25" y="260" fill="currentColor" opacity="0.8" fontSize="13" transform="rotate(-90 25,260)">
            {t('详尽度需求 (Level of Detail) ▲', 'Detail Demand (Level of Detail) ▲')}
          </text>
          <text x="560" y="305" fill="currentColor" opacity="0.8" fontSize="13" textAnchor="end">
            {t('任务复杂度 (Task Complexity) ▶', 'Task Complexity ▶')}
          </text>

          {/* X-axis tick labels */}
          <text x="110" y="298" fill="currentColor" opacity="0.8" fontSize="13" textAnchor="middle">{t('基础环境预检', 'Basic Setup')}</text>
          <text x="240" y="298" fill="currentColor" opacity="0.8" fontSize="13" textAnchor="middle">{t('单节点配置', 'Single Node')}</text>
          <text x="380" y="298" fill="currentColor" opacity="0.8" fontSize="13" textAnchor="middle">{t('半同步复制', 'Replication')}</text>
          <text x="510" y="298" fill="currentColor" opacity="0.8" fontSize="13" textAnchor="middle">{t('秒级故障回退', 'Failover/Rollback')}</text>

          {/* Novice Curve: High on left, slowly decreases, then levels */}
          {(mode === 'novice' || mode === 'both') && (
            <g>
              <path
                d="M 110,90 Q 220,130 380,180 T 510,210"
                fill="none"
                stroke="#6541ed"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 110,90 Q 220,130 380,180 T 510,210 L 510,280 L 110,280 Z"
                fill="url(#noviceGrad)"
                opacity="0.15"
              />
            </g>
          )}

          {/* Experienced Curve: Low on left, skyrockets on right */}
          {(mode === 'experienced' || mode === 'both') && (
            <g>
              <path
                d="M 110,240 Q 240,220 380,130 T 510,50"
                fill="none"
                stroke="#21865a"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 110,240 Q 240,220 380,130 T 510,50 L 510,280 L 110,280 Z"
                fill="url(#expGrad)"
                opacity="0.15"
              />
            </g>
          )}

          {/* Interactive Inspection Points */}
          {points.map((p, idx) => {
            const coords = [
              { x: 110, novY: 90, expY: 240 },
              { x: 240, novY: 135, expY: 215 },
              { x: 380, novY: 180, expY: 130 },
              { x: 510, novY: 210, expY: 50 },
            ]
            const pt = coords[idx]!
            const isSelected = selectedPoint === idx
            return (
              <g
                key={p.id}
                className={styles.pointTarget}
                onClick={() => setSelectedPoint(idx)}
                role="button"
                tabIndex={0}
                aria-label={p.title}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedPoint(idx)
                }}
              >
                {/* Axis tick point */}
                <circle
                  cx={pt.x}
                  cy="280"
                  r={isSelected ? '6' : '4'}
                  fill="currentColor"
                  opacity={isSelected ? 0.9 : 0.3}
                />
                <line
                  x1={pt.x}
                  y1="35"
                  x2={pt.x}
                  y2="280"
                  stroke="currentColor"
                  strokeOpacity={isSelected ? 0.35 : 0.08}
                  strokeDasharray="2 2"
                />

                {/* On-curve marker dots when selected */}
                {isSelected && (mode === 'novice' || mode === 'both') && (
                  <g>
                    <circle cx={pt.x} cy={pt.novY} r="9" fill="#6541ed" opacity="0.25" />
                    <circle cx={pt.x} cy={pt.novY} r="5" fill="#6541ed" stroke="#fff" strokeWidth="2" />
                  </g>
                )}
                {isSelected && (mode === 'experienced' || mode === 'both') && (
                  <g>
                    <circle cx={pt.x} cy={pt.expY} r="9" fill="#21865a" opacity="0.25" />
                    <circle cx={pt.x} cy={pt.expY} r="5" fill="#21865a" stroke="#fff" strokeWidth="2" />
                  </g>
                )}
              </g>
            )
          })}

          <defs>
            <linearGradient id="noviceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6541ed" />
              <stop offset="100%" stopColor="#6541ed" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="expGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#21865a" />
              <stop offset="100%" stopColor="#21865a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        <div className={styles.curveLegend}>
          {(mode === 'novice' || mode === 'both') && (
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#6541ed' }} />
              <strong>{t('新手用户曲线 (Novice)', 'Novice Users')}</strong>
              {isZh ? '：' : ': '}
              {t('基础操作需详尽，复杂任务需分步引导', 'High detail early; gentle progression')}
            </span>
          )}
          {(mode === 'experienced' || mode === 'both') && (
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: '#21865a' }} />
              <strong>{t('资深专家曲线 (Experienced)', 'Experienced SRE')}</strong>
              {isZh ? '：' : ': '}
              {t('日常任务拒绝废话，高危操作顶格精确', 'Minimal on basics; exhaustive on recovery')}
            </span>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <strong>
          {t('选中阶段：', 'Selected Stage: ')}
          {active.title}
          {' '}
          (
          {active.type}
          )
        </strong>
        {(mode === 'novice' || mode === 'both') && (
          <p style={{ margin: '0 0 6px', color: 'var(--iw-violet)' }}>{active.noviceText}</p>
        )}
        {(mode === 'experienced' || mode === 'both') && (
          <p style={{ margin: 0, color: 'var(--iw-green)' }}>{active.experiencedText}</p>
        )}
      </div>
    </div>
  )
}
