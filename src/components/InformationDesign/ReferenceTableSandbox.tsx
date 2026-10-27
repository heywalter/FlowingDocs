import React, { useState } from 'react'
import styles from './ReviewChecklist.module.css'

export default function ReferenceTableSandbox({ locale = 'zh' }: { locale?: 'zh' | 'en' }) {
  const tr = (zh: string, en: string) => locale === 'zh' ? zh : en
  const [selected, setSelected] = useState(0)
  const [clear, setClear] = useState(false)
  const params = [
    { name: 'query_timeout', vague: tr('超时时间，默认 30，立即生效。', 'Timeout, default 30, effective immediately.'), description: tr('限制单次查询的执行时间，从执行开始计时。', 'Limits one query’s execution time, starting when execution begins.'), rows: [
      [tr('类型 / 单位', 'Type / unit'), tr('整数 / 秒', 'Integer / seconds')],
      [tr('默认 / 范围', 'Default / range'), '30 / 0–3600'],
      [tr('特殊值', 'Special value'), tr('0 表示不设置时限', '0 means no time limit')],
      [tr('作用域 / 生效', 'Scope / timing'), tr('当前会话；只影响修改后发起的查询', 'Current session; queries started after the change')],
      [tr('超时结果', 'Timeout result'), tr('当前查询终止，返回 QUERY_TIMEOUT', 'The query stops and returns QUERY_TIMEOUT')],
      [tr('仍需核实', 'Still to verify'), tr('事务、连接状态，以及查询当前值的方法', 'Transaction and connection state, and how to query the active value')],
    ] },
    { name: 'retry_limit', vague: tr('失败时自动重试，次数可调整。', 'Automatically retry failures; the count is adjustable.'), description: tr('限制一次请求在首次失败后的额外尝试次数。', 'Limits additional attempts after a request’s first failure.'), rows: [
      [tr('类型 / 单位', 'Type / unit'), tr('整数 / 次', 'Integer / attempts')],
      [tr('默认 / 范围', 'Default / range'), '2 / 0–5'],
      [tr('特殊值', 'Special value'), tr('0 表示不重试；2 表示最多共尝试 3 次', '0 disables retries; 2 allows up to 3 total attempts')],
      [tr('作用域 / 生效', 'Scope / timing'), tr('服务级；只影响新请求', 'Service-wide; new requests only')],
      [tr('仍需核实', 'Still to verify'), tr('哪些错误可重试、间隔、幂等要求和最终错误', 'Eligible errors, delays, idempotency and final error handling')],
    ] },
    { name: 'cache_capacity', vague: tr('缓存大小，建议设大一些。', 'Cache size; a larger value is recommended.'), description: tr('限制本示例服务为缓存数据分配的容量。', 'Limits the capacity allocated to cached data in this fictional service.'), rows: [
      [tr('类型 / 单位', 'Type / unit'), tr('整数 / MiB', 'Integer / MiB')],
      [tr('默认 / 范围', 'Default / range'), '128 / 16–1024'],
      [tr('作用域 / 生效', 'Scope / timing'), tr('单个服务进程；修改配置后需要重启', 'One service process; requires a restart after configuration changes')],
      [tr('建议的依据', 'Recommendation basis'), tr('根据可用内存和实际负载测试；没有通用推荐值', 'Available memory and workload testing; no universal recommendation')],
      [tr('仍需核实', 'Still to verify'), tr('是否包含元数据、越界行为，以及重启的影响', 'Whether metadata is included, invalid values and restart impact')],
    ] },
  ]
  const param = params[selected]!
  return (
    <section className={styles.panel} aria-label={tr('参数说明写法对照', 'Compare parameter descriptions')}>
      <div className={styles.heading}>
        <div>
          <h3>{tr('缺了哪些事实？', 'Which facts are missing?')}</h3>
          <p>{tr('虚构参数，仅用于写作练习；不是 MySQL 参数表。', 'Fictional parameters for writing practice, not a MySQL parameter table.')}</p>
        </div>
      </div>
      <div className={styles.choices}>
        <button type="button" aria-pressed={!clear} onClick={() => setClear(false)}>{tr('原说明', 'Original')}</button>
        <button type="button" aria-pressed={clear} onClick={() => setClear(true)}>{tr('补齐后', 'More specific')}</button>
      </div>
      <div className={styles.columns}>
        <div className={`${styles.choices} ${styles.paramList}`} aria-label={tr('选择示例参数', 'Choose an example parameter')}>{params.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)}>{item.name}</button>)}</div>
        <div>
          <code>{param.name}</code>
          <p>{clear ? param.description : param.vague}</p>
          {clear
            ? (
                <div className={styles.tableWrap} role="region" tabIndex={0} aria-label={tr('参数属性对照表，可左右滑动浏览完整内容', 'Parameter comparison table; scroll horizontally to view full content')}>
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">{tr('需要交代的内容', 'Information')}</th>
                        <th scope="col">{tr('教学设定与待确认项', 'Example assumptions and open questions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {param.rows.map(([key, value]) => (
                        <tr key={key}>
                          <th scope="row">{key}</th>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            : <p className={styles.note}>{tr('先想一想：这句话是否足以支持读者操作？再切换到“补齐后”。', 'Could a reader act on this description? Consider the gaps, then choose “More specific”.')}</p>}
        </div>
      </div>
    </section>
  )
}
