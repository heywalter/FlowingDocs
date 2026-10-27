import React, { useState } from 'react'
import styles from './widgets.module.css'
import { Icon } from '../DocsIcon'

interface StageFlowDegradationProps {
  locale?: 'zh' | 'en'
}

type DurabilityStatus = 'volatile' | 'process' | 'safe' | 'consistent'

interface StageItem {
  id: string
  num: string
  nameZh: string
  nameEn: string
  tierZh: string
  tierEn: string
  hostZh: string
  hostEn: string
  syscallZh: string
  syscallEn: string
  latencyZh: string
  latencyEn: string
  knobZh: string
  knobEn: string
  knobNoteZh: string
  knobNoteEn: string
  status: DurabilityStatus
  statusZh: string
  statusEn: string
  rpoZh: string
  rpoEn: string
  connectorSyscall?: string
}

const STAGES: StageItem[] = [
  {
    id: 'user-buffer',
    num: '01',
    nameZh: 'InnoDB Log Buffer',
    nameEn: 'InnoDB Log Buffer',
    tierZh: '用户态内存',
    tierEn: 'User Space RAM',
    hostZh: 'mysqld 进程 RAM (虚拟地址空间)',
    hostEn: 'mysqld process virtual memory',
    syscallZh: '内存追加 (mutex 保护)',
    syscallEn: 'Memory append (mutex protected)',
    latencyZh: '< 1 µs',
    latencyEn: '< 1 µs',
    knobZh: 'innodb_log_buffer_size = 16M ~ 64M',
    knobEn: 'innodb_log_buffer_size = 16M ~ 64M',
    knobNoteZh: '预防高并发大事务写满导致同步刷盘',
    knobNoteEn: 'Prevents synchronous flush on large transactions',
    status: 'volatile',
    statusZh: '易失（Volatile）',
    statusEn: 'Volatile',
    rpoZh: '零丢失（事务未确认，异常直接丢弃）',
    rpoEn: 'Zero loss (Unconfirmed; discarded cleanly)',
    connectorSyscall: 'write()',
  },
  {
    id: 'kernel-cache',
    num: '02',
    nameZh: 'OS Page Cache',
    nameEn: 'OS Page Cache',
    tierZh: '内核态缓存',
    tierEn: 'Kernel Page Cache',
    hostZh: '宿主机操作系统文件系统缓存',
    hostEn: 'Host OS filesystem page cache',
    syscallZh: 'write() 系统调用',
    syscallEn: 'write() syscall',
    latencyZh: '~ 10 µs',
    latencyEn: '~ 10 µs',
    knobZh: 'innodb_flush_log_at_trx_commit = 2',
    knobEn: 'innodb_flush_log_at_trx_commit = 2',
    knobNoteZh: '由主线程每秒统一 fsync 刷盘',
    knobNoteEn: 'Master thread flushes pages once per second',
    status: 'process',
    statusZh: '进程安全 · 主机易失',
    statusEn: 'Process-Safe · Host-Volatile',
    rpoZh: '断电最多丢失过去 1 秒已提交事务 (RPO ≤ 1s)',
    rpoEn: 'Host power cut loses up to 1s data (RPO ≤ 1s)',
    connectorSyscall: 'fsync()',
  },
  {
    id: 'disk-storage',
    num: '03',
    nameZh: 'NVMe SSD (ib_logfile*)',
    nameEn: 'NVMe SSD (ib_logfile*)',
    tierZh: '物理存储介质',
    tierEn: 'Physical Storage',
    hostZh: 'PCIe NVMe 固态硬盘（非易失闪存颗粒）',
    hostEn: 'PCIe NVMe Solid State Drive',
    syscallZh: 'fsync() 强制刷盘',
    syscallEn: 'fsync() syscall',
    latencyZh: '0.2 ~ 1.5 ms',
    latencyEn: '0.2 ~ 1.5 ms',
    knobZh: 'innodb_flush_log_at_trx_commit = 1',
    knobEn: 'innodb_flush_log_at_trx_commit = 1',
    knobNoteZh: '金融级强一致基线（事务提交必须落盘）',
    knobNoteEn: 'Financial-grade ACID baseline (mandatory disk flush)',
    status: 'safe',
    statusZh: '强持久化（Full Durability）',
    statusEn: 'Crash-Safe Durability',
    rpoZh: 'RPO = 0，断电通过 LSN 前滚恢复自愈',
    rpoEn: 'RPO = 0; crash recovery self-heals via LSN replay',
    connectorSyscall: '2PC Commit',
  },
  {
    id: 'binlog-coordinator',
    num: '04',
    nameZh: 'Binlog 2PC Coordinator',
    nameEn: 'Binlog 2PC Coordinator',
    tierZh: '分布式协同层',
    tierEn: 'Distributed Coordinator',
    hostZh: '两阶段提交事务协调器 (Binlog 文件)',
    hostEn: 'Two-Phase Commit Coordinator (Binlog file)',
    syscallZh: 'Prepare ➔ Binlog fsync ➔ Commit',
    syscallEn: 'Prepare ➔ Binlog fsync ➔ Commit',
    latencyZh: '~ 0.5 ms',
    latencyEn: '~ 0.5 ms',
    knobZh: 'sync_binlog = 1',
    knobEn: 'sync_binlog = 1',
    knobNoteZh: '组提交协同 (group commit sync delay)',
    knobNoteEn: 'Group commit sync delay enabled',
    status: 'consistent',
    statusZh: '主从强一致',
    statusEn: 'Replica Strong Consistency',
    rpoZh: '零数据丢失，主从副本绝不错位裂脑',
    rpoEn: 'Zero data loss; replica replication consistency guaranteed',
    connectorSyscall: undefined,
  },
]

export default function StageFlowDegradation({ locale = 'zh' }: StageFlowDegradationProps) {
  const isZh = locale !== 'en'
  const [activeStageId, setActiveStageId] = useState<string>('user-buffer')
  const [viewMode, setViewMode] = useState<'dual' | 'visual' | 'table'>('dual')

  const getStatusClass = (status: DurabilityStatus) => {
    switch (status) {
      case 'volatile':
        return styles.statusBadgeVolatile
      case 'process':
        return styles.statusBadgeProcess
      case 'safe':
        return styles.statusBadgeSafe
      case 'consistent':
        return styles.statusBadgeConsistent
      default:
        return ''
    }
  }

  const getStatusDotColor = (status: DurabilityStatus) => {
    switch (status) {
      case 'volatile':
        return '#ef4444'
      case 'process':
        return '#f59e0b'
      case 'safe':
        return '#10b981'
      case 'consistent':
        return '#3b82f6'
      default:
        return '#64748b'
    }
  }

  return (
    <div className={styles.flowDegradeBox}>
      {/* Header */}
      <div className={styles.flowDegradeHeader}>
        <div className={styles.flowDegradeTitleGroup}>
          <h4>
            {isZh
              ? '多模态工程范式：视觉流向 ➔ 阶段契约表降级承接'
              : 'Multi-Modal Pattern: Visual Pipeline ➔ Contract Table Graceful Degradation'}
          </h4>
          <p>
            {isZh
              ? '视觉管道建立自顶向下的宏观直觉，契约表提供 100% 事实等价的无障碍降级'
              : 'Visual flow conveys top-down spatial intuition; contract table provides 100% factual accessibility parity'}
          </p>
        </div>

        <div className={styles.modeButtonGroup}>
          <button
            type="button"
            className={`${styles.modeBtn} ${viewMode === 'dual' ? styles.modeBtnActive : ''}`}
            onClick={() => setViewMode('dual')}
          >
            {isZh ? '双轨对照 (推荐)' : 'Dual-Track (Recommended)'}
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${viewMode === 'visual' ? styles.modeBtnActive : ''}`}
            onClick={() => setViewMode('visual')}
          >
            {isZh ? '仅看视觉图' : 'Visual Only'}
          </button>
          <button
            type="button"
            className={`${styles.modeBtn} ${viewMode === 'table' ? styles.modeBtnActive : ''}`}
            onClick={() => setViewMode('table')}
          >
            {isZh ? '纯表降级 (无障碍)' : 'Table Fallback (A11y)'}
          </button>
        </div>
      </div>

      {/* Track 1: Visual Pipeline */}
      {(viewMode === 'dual' || viewMode === 'visual') && (
        <div className={styles.pipelineTrack}>
          <div className={styles.pipelineCaption}>
            <span>
              {isZh
                ? '视觉多模态轨：存储层级与系统调用流向'
                : 'Visual Multi-Modal Track: Storage Tiers & Syscall Flow'}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--iw-muted)' }}>
              {isZh ? '点击卡片可联动定位下方契约' : 'Click card to highlight table contract below'}
            </span>
          </div>

          <div className={styles.pipelineGrid}>
            {STAGES.map((s) => {
              const isActive = s.id === activeStageId
              return (
                <div
                  key={s.id}
                  role="button"
                  tabIndex={0}
                  className={`${styles.stageStepCard} ${isActive ? styles.stageStepCardActive : ''}`}
                  onClick={() => setActiveStageId(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setActiveStageId(s.id)
                    }
                  }}
                >
                  <div className={styles.stageStepCardTop}>
                    <div className={styles.stageStepTopLeft}>
                      <span className={styles.stageStepIndex}>{s.num}</span>
                      <span className={styles.stageStepLatency}>
                        {isZh ? s.latencyZh : s.latencyEn}
                      </span>
                    </div>
                    {s.connectorSyscall
                      ? (
                          <span
                            className={styles.stageStepSyscallPill}
                            title={isZh ? `进入下一阶段系统调用：${s.connectorSyscall}` : `Next syscall: ${s.connectorSyscall}`}
                          >
                            <code>{s.connectorSyscall}</code>
                            {' '}
                            ➔
                          </span>
                        )
                      : (
                          <span className={styles.stageStepEndPill}>
                            {isZh ? 'ACID 闭环 ✓' : 'ACID Baseline ✓'}
                          </span>
                        )}
                  </div>

                  <div className={styles.stageStepName} title={isZh ? s.nameZh : s.nameEn}>
                    {isZh ? s.nameZh : s.nameEn}
                  </div>

                  <div className={styles.stageStepTier}>
                    {isZh ? s.tierZh : s.tierEn}
                  </div>

                  <div className={styles.stageStepDotRow}>
                    <span
                      className={styles.stageStepDot}
                      style={{
                        backgroundColor: getStatusDotColor(s.status),
                      }}
                    />
                    <span className={styles.stageStepStatusText}>
                      {isZh ? s.statusZh.split('·')[0]?.trim() : s.statusEn.split('·')[0]?.trim()}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Track 2: Graceful Degradation Contract Matrix Table */}
      {(viewMode === 'dual' || viewMode === 'table') && (
        <div className={styles.matrixTableWrap}>
          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th style={{ width: '25%' }}>{isZh ? '阶段与物理宿主' : 'Tier & Host Medium'}</th>
                <th style={{ width: '21%' }}>{isZh ? '关键调用与典型延迟' : 'Invocation & Latency'}</th>
                <th style={{ width: '28%' }}>{isZh ? '核心配置与生产基线' : 'Configuration Baseline'}</th>
                <th style={{ width: '26%' }}>{isZh ? '持久化安全契约 (RPO)' : 'Durability & RPO Contract'}</th>
              </tr>
            </thead>
            <tbody>
              {STAGES.map((s) => {
                const isActive = s.id === activeStageId
                return (
                  <tr
                    key={s.id}
                    className={isActive ? styles.matrixRowActive : undefined}
                    onClick={() => setActiveStageId(s.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div className={styles.cellStageCol}>
                        <div className={styles.cellStageName}>
                          <span className={styles.cellStageNum}>
                            {s.num}
                            .
                          </span>
                          {isZh ? s.nameZh : s.nameEn}
                        </div>
                        <div className={styles.cellStageHost}>
                          {isZh ? s.hostZh : s.hostEn}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className={styles.cellStackCol}>
                        <code className={styles.cellCodePill}>
                          {isZh ? s.syscallZh : s.syscallEn}
                        </code>
                        <span className={styles.cellLatencyText}>
                          {isZh ? `延迟：${s.latencyZh}` : `Latency: ${s.latencyEn}`}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.cellStackCol}>
                        <code className={styles.cellCodePill}>
                          {isZh ? s.knobZh : s.knobEn}
                        </code>
                        <span className={styles.cellNoteText}>
                          {isZh ? s.knobNoteZh : s.knobNoteEn}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className={styles.cellStackCol}>
                        <div>
                          <span className={`${styles.statusBadge} ${getStatusClass(s.status)}`}>
                            <span
                              className={styles.statusBadgeDot}
                              style={{
                                backgroundColor: getStatusDotColor(s.status),
                              }}
                            />
                            {isZh ? s.statusZh : s.statusEn}
                          </span>
                        </div>
                        <span className={styles.cellRpoText}>
                          {isZh ? s.rpoZh : s.rpoEn}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Design Insight */}
      <div className={styles.matrixFooterTip}>
        <span><Icon name="bulb" /></span>
        <span>
          {isZh
            ? '无障碍降级验证：即便切换到“纯表降级”模式，读者依然能完整获取物理宿主、系统调用、配置基线与 RPO 容灾全部核心事实，绝不让视觉图成为信息的单点瓶颈。'
            : 'Accessibility Parity Verified: In "Table Fallback" mode, readers extract 100% of physical host, syscall, configuration baseline, and RPO facts without reliance on images.'}
        </span>
      </div>
    </div>
  )
}
