import React, { useState } from 'react'
import styles from './styles.module.css'

export default function TableWidthDemo({ locale = 'zh' }: { locale?: 'zh' | 'en' }) {
  const [layout, setLayout] = useState('content')
  const tr = (zh: string, en: string) => locale === 'zh' ? zh : en
  const widths = layout === 'equal' ? ['33.33%', '33.33%', '33.34%'] : ['27%', '14%', '59%']
  const colLabels = [tr('参数', 'Parameter'), tr('默认值', 'Default'), tr('说明', 'Description')]
  const segColors = ['var(--iw-violet, #5b34e0)', 'var(--iw-blue, #1d4ed8)', 'var(--iw-green, #047857)']
  const rows = [
    ['query_timeout', '30', tr('单位为秒。限制单次查询的执行时间；0 表示不设置时限。修改只影响当前会话之后发起的查询。', 'Seconds. Limits one query’s execution time; 0 means no time limit. A change affects only queries started later in the current session.')],
    ['max_result_rows', '1000', tr('限制一次返回的结果行数。结果达到上限时，需要缩小查询范围，不能据此判断源表只有这些行。', 'Limits rows returned in one result. At the limit, narrow the query; do not assume the source table contains only those rows.')],
    ['trace_query_execution', 'false', tr('记录当前会话的查询执行信息。记录可在当前会话的诊断页查看，会话关闭后清除。', 'Records query execution details for the current session. Records appear on its diagnostics page and are cleared when the session ends.')],
  ]
  return (
    <div className={styles.demo}>
      <fieldset className={styles.options}>
        <legend>{tr('试着切换列宽，内容保持不变', 'Change the column widths; the content stays the same')}</legend>
        {[
          ['equal', tr('三列等宽', 'Equal columns')],
          ['content', tr('给说明列更多空间', 'More room for descriptions')],
        ].map(([value, label]) => (
          <label key={value}>
            <input type="radio" name={'table-width-' + locale} value={value} checked={layout === value} onChange={() => value && setLayout(value)} />
            {label}
          </label>
        ))}
      </fieldset>
      <div className={styles.ratioBar} aria-hidden="true">
        {widths.map((width, i) => (
          <span key={colLabels[i]} className={styles.ratioSeg} style={{ width, background: `color-mix(in srgb, ${segColors[i]} 16%, transparent)`, borderTop: `3px solid ${segColors[i]}` }}>
            <span className={styles.ratioName}>{colLabels[i]}</span>
            <span className={styles.ratioPct}>{`${Math.round(parseFloat(width))}%`}</span>
          </span>
        ))}
      </div>
      <p className={styles.scrollHint}>{tr('左右滑动表格，查看完整三列。', 'Scroll the table sideways to see all three columns.')}</p>
      <div className={styles.tableScroll} role="region" aria-label={tr('参数表，可横向滚动', 'Parameter table; scroll horizontally if needed')} tabIndex={0}>
        <table className={styles.exampleTable}>
          <caption>{tr('虚构参数，用于比较列宽', 'Fictional parameters for comparing column widths')}</caption>
          <colgroup>{widths.map((width, i) => <col key={i} style={{ width }} />)}</colgroup>
          <thead>
            <tr>
              <th scope="col">{tr('参数', 'Parameter')}</th>
              <th scope="col">{tr('默认值', 'Default')}</th>
              <th scope="col">{tr('说明', 'Description')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, value, description]) => (
              <tr key={name}>
                <th scope="row"><code>{name}</code></th>
                <td><code>{value}</code></td>
                <td>{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.caption}>{tr('这里使用 27% / 14% / 59% 作为对照，并不是通用比例。窄屏下保留横向滚动，不截掉说明。', 'The 27% / 14% / 59% split is an example, not a universal ratio. Narrow screens keep horizontal scrolling instead of truncating descriptions.')}</p>
    </div>
  )
}
