import Layout from '@theme/Layout'
import BlogSidebar from '@theme/BlogSidebar'
import type { Props } from '@theme/BlogLayout'

export default function BlogLayout({ sidebar, toc, children, ...layoutProps }: Props) {
  return (
    <Layout {...layoutProps}>
      <div className={`site-reading ${sidebar?.items.length ? 'site-reading-with-history' : ''}`}>
        {sidebar?.items.length ? <BlogSidebar sidebar={sidebar} /> : null}
        <main itemScope itemType="http://schema.org/Blog">{children}</main>
        {toc && <aside className="site-reading-toc">{toc}</aside>}
      </div>
    </Layout>
  )
}
