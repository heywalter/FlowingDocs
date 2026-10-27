import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl'
import type { Props } from '@theme/BlogPostItems'
import { resolveThumbnail } from '@site/src/lib/thumbnails'
import styles from './styles.module.css'

export default function BlogPostGridItems({ items }: Props) {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const { withBaseUrl } = useBaseUrlUtils()
  const en = currentLocale === 'en'
  return (
    <div className={styles.list}>
      {items.map(({ content }) => {
        const { metadata, frontMatter, assets } = content
        const image = assets?.image ?? frontMatter.image
        const date = new Date(metadata.date)
        const format = new Intl.DateTimeFormat(en ? 'en-GB' : 'zh-CN', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
        return (
          <article key={metadata.permalink} className={styles.article}>
            {image && (
              <Link to={metadata.permalink} className={styles.cover} tabIndex={-1} aria-hidden="true">
                <img
                  src={withBaseUrl(resolveThumbnail(image))}
                  alt=""
                  width="640"
                  height="360"
                  loading="lazy"
                  onError={(event) => {
                    const fallback = withBaseUrl(image)
                    if (event.currentTarget.getAttribute('src') !== fallback) event.currentTarget.src = fallback
                  }}
                />
              </Link>
            )}
            <div className={styles.body}>
              <div className={styles.meta}>
                <time dateTime={date.toISOString()}>{format.format(date)}</time>
                {Boolean((frontMatter as { sticky?: number }).sticky) && <span>{en ? 'Pinned' : '置顶'}</span>}
              </div>
              <h2><Link className="site-link" to={metadata.permalink}>{metadata.title}</Link></h2>
              <p>{metadata.description}</p>
              <nav className={styles.tags} aria-label={en ? 'Article topics' : '文章主题'}>{metadata.tags.slice(0, 3).map(tag => <Link key={tag.permalink} to={tag.permalink}>{tag.label}</Link>)}</nav>
            </div>
          </article>
        )
      })}
    </div>
  )
}
