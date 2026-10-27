import { syntaxReference } from './syntaxData'
import React from 'react'
import type { Locale } from './course'
import type { Format } from './workbook'
import styles from './styles.module.css'

export default function SyntaxReference({ locale, format, lesson, detail }: {
  locale: Locale
  format: Format
  lesson: string
  detail?: string
}) {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en
  const reference = syntaxReference(locale, format, lesson)
  if (!reference) return null
  const { source } = reference
  return (
    <section className={styles.syntaxReference} aria-label={t('语法速查', 'Syntax quick reference')}>
      <h3>{lesson === 'oxygen' ? t('项目速查', 'Project quick reference') : lesson === 'table-spans' && format === 'markdown' ? t('语法速查 · 内嵌 HTML', 'Syntax quick reference · Embedded HTML') : t('语法速查', 'Syntax quick reference')}</h3>
      {lesson === 'table-spans' && (
        <p className={styles.syntaxBoundary}>
          {format === 'markdown'
            ? t('Markdown 的管道表格没有合并单元格语法。这里改用 HTML，需要发布平台允许内嵌 HTML。', 'Markdown pipe tables cannot merge cells. This example uses HTML, which the publishing platform must allow.')
            : t('AsciiDoc 表格原生支持跨行和跨列，无需改写成 HTML。', 'AsciiDoc tables support row and column spans without switching to HTML.')}
        </p>
      )}
      <dl className={styles.syntaxRows}>
        {reference.rows.map(([code, meaning]) => (
          <div key={code}>
            <dt><code>{code}</code></dt>
            <dd>{meaning}</dd>
          </div>
        ))}
      </dl>
      <details key={format + lesson} className={styles.syntaxMore}>
        <summary>{t('易错点与更多语法', 'Pitfalls and more syntax')}</summary>
        <p className={styles.syntaxPitfall}>
          <strong>{t('容易漏掉：', 'Watch for: ')}</strong>
          {reference.pitfall}
        </p>
        {detail && <p>{detail}</p>}
        {reference.more && <p>{reference.more}</p>}
        {reference.example && <pre><code>{reference.example}</code></pre>}
        <a href={source} target="_blank" rel="noopener noreferrer">{t('查看官方参考', 'Official reference')}</a>
      </details>
    </section>
  )
}
