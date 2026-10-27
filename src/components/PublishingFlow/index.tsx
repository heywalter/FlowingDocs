import React from 'react'
import styles from './styles.module.css'

export default function PublishingFlow({ locale = 'zh' }: { locale?: 'zh' | 'en' }) {
  const steps = locale === 'zh'
    ? [
        ['维护源文件', '正文、图片与内容结构', 'Markdown / AsciiDoc 等'],
        ['生成网站', '解析内容，组织目录，套用主题', 'Docusaurus / Antora 等'],
        ['发布给读者', '托管生成的文件，提供访问地址', 'Netlify / GitHub Pages 等'],
      ]
    : [
        ['Maintain the source', 'Text, images, and content structure', 'Markdown / AsciiDoc, etc.'],
        ['Generate the site', 'Process content, navigation, and theme', 'Docusaurus / Antora, etc.'],
        ['Publish for readers', 'Host the output at a web address', 'Netlify / GitHub Pages, etc.'],
      ]
  return (
    <figure className={styles.flow}>
      <ol aria-label={locale === 'zh' ? '从源文件到读者的三个环节' : 'Three stages from source to readers'}>
        {steps.map(([title, detail, example], index) => (
          <li key={title}>
            <span className={styles.number} aria-hidden="true">
              0
              {index + 1}
            </span>
            <strong>{title}</strong>
            <span>{detail}</span>
            <small>{example}</small>
          </li>
        ))}
      </ol>
      <figcaption>{locale === 'zh' ? '内容格式、生成器和托管平台，分别解决不同的问题。工具组合需要与源文件匹配。' : 'Content formats, generators, and hosts serve different purposes. The toolchain must match the source format.'}</figcaption>
    </figure>
  )
}
