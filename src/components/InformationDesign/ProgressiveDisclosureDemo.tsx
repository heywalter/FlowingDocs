import React, { useState } from 'react'
import styles from './ReviewChecklist.module.css'

export default function ProgressiveDisclosureDemo({ locale = 'zh' }: { locale?: 'zh' | 'en' }) {
  const tr = (zh: string, en: string) => locale === 'zh' ? zh : en
  const [level, setLevel] = useState(0)
  const levels = [
    [tr('一句话', 'One sentence'), tr('InnoDB 使用重做日志保存恢复所需的信息，数据页可以随后写回。', 'InnoDB uses redo logging to record information needed for recovery; data pages can be written later.')],
    [tr('主要过程', 'Main process'), tr('修改会产生重做日志记录。日志的写入与刷盘、数据页的写回是不同动作；事务提交时执行哪些动作，取决于持久化配置。', 'Changes produce redo records. Writing and flushing the log are distinct from writing data pages. Durability settings determine what happens at commit.')],
    [tr('条件和限制', 'Conditions'), tr('每次提交刷盘需要对应配置，也依赖存储系统正确执行刷盘请求。不要将本地持久化等同于复制完成；不同故障场景需要分别说明。', 'Flushing at every commit requires the appropriate settings and a storage stack that honors flush requests. Local durability does not establish replica synchronization; describe failure cases separately.')],
    [tr('继续核实', 'Verify further'), tr('真实说明还应注明 MySQL 版本、日志配置、存储环境，以及采用哪种故障测试验证结论。这里不提供固定延迟、性能百分比或生产配置推荐。', 'A real guide should identify the MySQL version, logging settings, storage environment and failure tests used to verify its claims. This example provides no fixed latency, performance percentage or production tuning recommendation.')],
  ]
  return (
    <section className={styles.panel} aria-label={tr('分层解释示例', 'Layered explanation example')}>
      <div className={styles.heading}>
        <div>
          <h3>{tr('同一件事，逐步补充细节', 'Add detail to the same explanation')}</h3>
          <p>{tr('选择阅读深度，前面的解释会保留。', 'Choose the depth. Earlier explanations stay visible.')}</p>
        </div>
      </div>
      <div className={styles.choices}>{levels.map(([label], index) => <button key={label} type="button" aria-pressed={level === index} onClick={() => setLevel(index)}>{label}</button>)}</div>
      <ol className={styles.levels}>
        {levels.slice(0, level + 1).map(([label, text]) => (
          <li key={label}>
            <strong>{label}</strong>
            <p>{text}</p>
          </li>
        ))}
      </ol>
      <p className={styles.note}>{tr('写作示例，非完整的数据库恢复说明。', 'A writing example, not a complete recovery guide.')}</p>
    </section>
  )
}
