import React from 'react'
import Link from '@docusaurus/Link'
import type { Locale } from './course'
import type { Format } from './workbook'
import styles from './styles.module.css'

export default function CourseHandoff({ locale, format }: { locale: Locale, format: Format }) {
  const tr = (zh: string, en: string) => locale === 'zh' ? zh : en
  const hub = locale === 'en' ? '/en/docs/' : '/docs/'
  return (
    <section id="where-next" className={styles.courseHandoff} aria-labelledby="markup-handoff-title">
      <span className={styles.eyebrow}>{tr('相关实践 · 按问题查阅', 'Related practice · Browse by problem')}</span>
      <h2 id="markup-handoff-title">{tr('这些文件，交给什么工具发布？', 'Which tool should publish these files?')}</h2>
      <p>{tr('已有内容能否直接使用，目录怎样组织，交互功能由谁维护？选择发布工具时，这些问题比主题外观更值得先看。', 'Can you use existing content directly? How will navigation work, and who will maintain interactions? Consider these questions before choosing a theme.')}</p>
      <p>
        {format === 'dita'
          ? tr('DITA 先看主题、map 和复用关系怎样处理，再选择输出方式。发布工具选择页也会说明它与 Markdown、AsciiDoc 发布路线的区别。', 'For DITA, start with how topics, maps, and reuse are processed, then choose the output. The linked article also distinguishes this from Markdown and AsciiDoc publishing.')
          : tr('用本站的博客、双语和交互示例，看看生成器提供了什么，以及采用后需要承担哪些维护工作。', 'Use this site’s blog, languages, and interactive examples to see what a generator provides and what maintenance it leaves to you.')}
      </p>
      <Link to={hub + 'publishing/'}>{tr('静态站点生成器：怎样选择 →', 'Static site generators: how to choose →')}</Link>
    </section>
  )
}
