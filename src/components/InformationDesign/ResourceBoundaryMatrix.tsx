import React, { useState } from 'react'
import styles from './widgets.module.css'
import { Icon, renderWithIcons } from '../DocsIcon'
import type { IconName } from '../DocsIcon'

interface ResourceBoundaryMatrixProps {
  locale?: 'zh' | 'en'
}

type Filter = 'all' | 'compute' | 'storage' | 'network'

export default function ResourceBoundaryMatrix({ locale = 'zh' }: ResourceBoundaryMatrixProps) {
  const [filter, setFilter] = useState<Filter>('all')

  const isZh = locale === 'zh'
  const ts = (zh: string, en: string) => isZh ? zh : en
  const t = (zh: string, en: string) => renderWithIcons(isZh ? zh : en)

  const items = [
    {
      category: 'compute',
      icon: 'zap' as IconName,
      title: t('算力受限 (Compute / CPU Bound)', 'Compute Intensive (CPU Bound)'),
      color: 'var(--iw-amber)',
      triggers: [
        t('Using filesort 内存外排', 'Using filesort Disk Spill'),
        t('无索引全表扫描 (type=ALL)', 'Full Table Scan (type=ALL)'),
        t('深分页 LIMIT 1000000, 20', 'Deep Offset Pagination'),
        t('低效多表 Cartesian JOIN', 'Cartesian Product JOIN'),
      ],
      impact: t(
        '单查询长时间占满 CPU 单核；工作线程池排队积压耗尽连接数，触发 Too many connections；实例心跳丢包触发集群非预期误倒换。',
        'Saturates CPU cores. Work queues exhaust max_connections, throwing "Too many connections"; missed heartbeats cause erroneous cluster failovers.',
      ),
      mitigation: t(
        '慢查询阈值设为 <= 1s；强制通过联合索引消除 filesort；禁用物理大深分页，改用游标寻址（WHERE id > last_id LIMIT 20）；CI 流水线设 EXPLAIN 门禁。',
        'Set slow query threshold to <= 1s; build composite indexes to eliminate filesort; ban deep offsets using seek pagination; enforce CI EXPLAIN gates.',
      ),
    },
    {
      category: 'storage',
      icon: 'database' as IconName,
      title: t('内存与撤销日志受限 (Memory / Undo Bound)', 'Memory & Undo Intensive (RAM Bound)'),
      color: 'var(--iw-blue)',
      triggers: [
        t('未提交长事务 (长达数小时)', 'Long-Running Uncommitted Trx'),
        t('隐式临时表溢出 (Using temporary)', 'Implicit Disk Temp Tables'),
        t('千万级版本链 Undo Log 堆积', 'Massive Undo MVCC Version Chains'),
        t('Buffer Pool 脏页严重积压', 'Buffer Pool Dirty Page Backlog'),
      ],
      impact: t(
        'Undo 表空间暴涨撑爆物理磁盘；历史版本链（ReadView）过长导致全局所有事务一致性读性能断崖式下跌；Buffer Pool 频繁换页引发磁盘 Thrashing 抖动。',
        'Undo tablespace inflates, filling physical disks; bloated MVCC version chains degrade global read performance; memory thrashing freezes I/O.',
      ),
      mitigation: t(
        '监控 information_schema.innodb_trx，告警并强制 kill 存活超 60 秒的未提交事务；调优 tmp_table_size；规划 Buffer Pool 为宿主机内存的 60%~75%。',
        'Audit information_schema.innodb_trx to terminate uncommitted transactions >60s; tune tmp_table_size; size Buffer Pool to 60-75% of host RAM.',
      ),
    },
    {
      category: 'network',
      icon: 'globe' as IconName,
      title: t('磁盘 I/O 与传输受限 (Disk I/O & Network)', 'Disk I/O & Network Bandwidth (I/O Bound)'),
      color: 'var(--iw-red)',
      triggers: [
        t('双 1 强刷盘策略高并发写', 'Double 1 fsync Under Heavy Writes'),
        t('单表存百兆 TEXT/BLOB 宽字段', 'Oversized TEXT/BLOB In-Table'),
        t('从库单线程复制积压延时', 'Single-Threaded Replica Lag'),
        t('无限制 SELECT * 全库倾泻', 'Unbounded SELECT * Dumps'),
      ],
      impact: t(
        '磁盘写 IOPS 打满导致 fsync 延迟从 0.2ms 飙升至 50ms 以上；写事务大量处于锁等待状态；从库复制延迟拉大危及读写分离业务数据一致性。',
        'IOPS saturation drives fsync latency from 0.2ms to >50ms; writes block in lock wait queues; replication lag breaks read-replica consistency.',
      ),
      mitigation: t(
        '开启 Binlog 组提交（Group Commit）；开启从库多线程并行复制（MTS，replica_parallel_workers）；大文件存入对象存储，MySQL 仅存元数据 URI。',
        'Enable Binlog Group Commit; activate Multi-Threaded Slaves (MTS, replica_parallel_workers); offload binary payloads to S3/OSS, storing only URIs.',
      ),
    },
  ]

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)

  return (
    <div className={styles.widgetContainer} role="region" aria-label={ts('三维性能边界矩阵', '3D Performance Boundary Matrix')}>
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitleGroup}>
          <h4>{t('MySQL 生产性能边界与资源瓶颈矩阵', 'MySQL Production Performance & Resource Boundaries')}</h4>
          <p>{t('将抽象的泛化提醒解构为算力、内存/撤销日志、磁盘 I/O 三维物理风险与工程规约', 'Deconstruct abstract warnings into actionable compute, memory/undo, and disk I/O guardrails')}</p>
        </div>
        <div className={styles.tabControls} role="tablist" aria-label={ts('资源维度筛选', 'Resource Vector Filters')}>
          <button
            role="tab"
            aria-selected={filter === 'all'}
            className={`${styles.tabBtn} ${filter === 'all' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('all')}
            type="button"
          >
            {t('全部维度', 'All Vectors')}
          </button>
          <button
            role="tab"
            aria-selected={filter === 'compute'}
            className={`${styles.tabBtn} ${filter === 'compute' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('compute')}
            type="button"
          >
            {t('⚡ 算力瓶颈', '⚡ Compute')}
          </button>
          <button
            role="tab"
            aria-selected={filter === 'storage'}
            className={`${styles.tabBtn} ${filter === 'storage' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('storage')}
            type="button"
          >
            {t('💾 内存与 Undo', '💾 Memory & Undo')}
          </button>
          <button
            role="tab"
            aria-selected={filter === 'network'}
            className={`${styles.tabBtn} ${filter === 'network' ? styles.tabBtnActive : ''}`}
            onClick={() => setFilter('network')}
            type="button"
          >
            {t('🌐 磁盘 I/O 与传输', '🌐 Disk I/O & Network')}
          </button>
        </div>
      </div>

      <div className={styles.matrixGrid}>
        {filtered.map(item => (
          <div key={item.category} className={styles.matrixCard} style={{ borderTop: `3px solid ${item.color}` }}>
            <div className={styles.matrixCardHeader}>
              <span><Icon name={item.icon} /></span>
              <span>{item.title}</span>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--iw-muted)', display: 'block', marginBottom: '0.3rem' }}>
                {t('典型触发高危场景：', 'High-Risk Trigger Scenarios:')}
              </span>
              <div className={styles.tagGroup}>
                {item.triggers.map((tag, idx) => (
                  <span key={idx} className={styles.riskTag}>{tag}</span>
                ))}
              </div>
            </div>

            <p style={{ margin: '0.3rem 0', lineHeight: 1.55, color: 'var(--ifm-color-emphasis-800)' }}>
              <strong>{t('生产影响：', 'Production Impact: ')}</strong>
              {item.impact}
            </p>

            <div className={styles.mitigationBox}>
              <strong style={{ color: 'var(--iw-primary)', display: 'block', marginBottom: '0.2rem' }}>
                {t('架构设计与规约对策：', 'Architecture Mitigation:')}
              </strong>
              {item.mitigation}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
