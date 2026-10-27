import type { Locale } from './course'
import { referenceIntro, referenceSections } from './reference'
import styles from './ReadingReference.module.css'

export default function ReadingReference({ locale }: { locale: Locale }) {
  const en = locale === 'en'
  return (
    <details id="markup-reference" className={styles.reference}>
      <summary>{en ? 'Full text reference · Markdown, AsciiDoc and DITA' : '完整文字参考 · Markdown、AsciiDoc 与 DITA'}</summary>
      {referenceIntro(locale).map(text => <p key={text}>{text}</p>)}
      <p><a href={`/llms/${en ? 'en' : 'zh'}/docs/markup.md`} download>{en ? 'Download the Markdown reference' : '下载 Markdown 参考'}</a></p>
      <nav aria-label={en ? 'Reference sections' : '文字参考目录'}>
        {referenceSections(locale).map(section => <a key={section.id} href={`#markup-reference-${section.id}`}>{section.title}</a>)}
      </nav>
      {referenceSections(locale).map(section => (
        <section key={section.id} id={`markup-reference-${section.id}`}>
          <h2>{section.title}</h2>
          {section.paragraphs.map(text => <p key={text}>{text}</p>)}
          {section.examples.map(example => (
            <div key={example.title}>
              <h3>{example.title}</h3>
              {example.paragraphs.map(text => <p key={text}>{text}</p>)}
              <pre><code>{example.code}</code></pre>
            </div>
          ))}
          <p>{section.links.map(link => <a key={link.url} href={link.url}>{link.label}</a>)}</p>
        </section>
      ))}
    </details>
  )
}
