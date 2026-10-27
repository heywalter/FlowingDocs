import { useEffect, useId, useState } from 'react'
import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { BlogSidebarItemList, useVisibleBlogSidebarItems } from '@docusaurus/plugin-content-blog/client'
import { ChevronDownIcon, ArrowLeftIcon } from '@radix-ui/react-icons'
import type { Props } from '@theme/BlogSidebar'
import type { Props as ContentProps } from '@theme/BlogSidebar/Content'
import BlogSidebarContent from '@theme/BlogSidebar/Content'
import styles from './styles.module.css'

const List: ContentProps['ListComponent'] = ({ items }) => <BlogSidebarItemList items={items} ulClassName={styles.list} liClassName={styles.item} linkClassName={styles.link} linkActiveClassName={styles.active} />

export default function BlogSidebar({ sidebar }: Props): React.JSX.Element | null {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  const prefix = en ? '/en/blog' : '/blog'
  const items = useVisibleBlogSidebarItems(sidebar?.items ?? [])
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const id = useId()
  useEffect(() => setOpen(false), [pathname])
  if (!items.length) return null
  return (
    <aside className={styles.sidebar} data-blog-sidebar>
      <button type="button" className={styles.toggle} aria-controls={id} aria-expanded={open} onClick={() => setOpen(!open)}>
        {en ? 'Browse other articles' : '浏览其他文章'}
        <ChevronDownIcon aria-hidden="true" />
      </button>
      <nav id={id} className={`${styles.content} ${open ? styles.open : ''}`} aria-label={en ? 'Article history' : '历史文章'}>
        <Link className={styles.back} to={`${prefix}/`}>
          <ArrowLeftIcon aria-hidden="true" />
          {en ? 'All articles' : '全部文章'}
        </Link>
        <h2 className={styles.title}>
          {en ? 'Article history' : '历史文章'}
          <span>{items.length}</span>
        </h2>
        <div className={styles.posts}><BlogSidebarContent items={items} ListComponent={List} yearGroupHeadingClassName={styles.year} /></div>
        <div className={styles.more}>
          <Link to={`${prefix}/tags/`}>{en ? 'Topics' : '按主题'}</Link>
          <Link to={`${prefix}/archive/`}>{en ? 'Archive' : '按时间'}</Link>
        </div>
      </nav>
    </aside>
  )
}
