import Link from '@docusaurus/Link'
import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import BlogBrowseNav from '@site/src/components/BlogBrowseNav'
import type { Props } from '@theme/BlogArchivePage'
import MyLayout from '../MyLayout'
import styles from './styles.module.css'

export default function BlogArchive({ archive }: Props) {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  const title = en ? 'Archive' : '文章归档'
  const posts = [...archive.blogPosts].sort((a, b) => b.metadata.date.localeCompare(a.metadata.date))
  // Array.from is intentional: this build treats spread operands as arrays.
  const years = Array.from(new Set(posts.map(post => post.metadata.date.slice(0, 4))))
  return (
    <HtmlClassNameProvider className={ThemeClassNames.wrapper.blogPages}>
      <PageMetadata title={title} description={en ? 'Articles in chronological order.' : '按时间查找写过的文章。'} />
      <MyLayout>
        <header className="site-page-heading">
          <h1>{title}</h1>
          <p>{en ? `${posts.length} articles, arranged by year.` : `共 ${posts.length} 篇文章，按年份整理。`}</p>
          <BlogBrowseNav active="archive" />
        </header>
        {years.map(year => (
          <section className={styles.year} key={year} aria-labelledby={`year-${year}`}>
            <div className={styles.yearLabel}>
              <h2 id={`year-${year}`}>{year}</h2>
              <span>
                {posts.filter(post => post.metadata.date.startsWith(year)).length}
                {' '}
                {en ? 'articles' : '篇文章'}
              </span>
            </div>
            <ul data-blog-archive-year={year}>
              {posts.filter(post => post.metadata.date.startsWith(year)).map(({ metadata }) => (
                <li key={metadata.permalink}>
                  <time dateTime={metadata.date}>{metadata.date.slice(5, 10)}</time>
                  <Link className="site-link" to={metadata.permalink}>{metadata.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </MyLayout>
    </HtmlClassNameProvider>
  )
}
