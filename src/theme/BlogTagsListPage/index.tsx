import { useRef, useState } from 'react'
import Link from '@docusaurus/Link'
import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { ArrowRightIcon, DesktopIcon, LayersIcon, MagicWandIcon, ReaderIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import BlogBrowseNav from '@site/src/components/BlogBrowseNav'
import type { Props } from '@theme/BlogTagsListPage'
import SearchMetadata from '@theme/SearchMetadata'
import MyLayout from '../MyLayout'
import styles from './styles.module.css'

export default function BlogTagsListPage({ tags }: Props) {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  const [query, setQuery] = useState('')
  const searchInput = useRef<HTMLInputElement>(null)
  const title = en ? 'Topics' : '主题'
  const featured = [
    { label: 'AI', icon: MagicWandIcon, tone: 'violet', description: en ? 'Models, coding tools, and what happens when I use them at work.' : '模型、编程工具，以及把它们用到工作中的尝试。' },
    { label: en ? 'Technical Writing' : '技术文档', icon: ReaderIcon, tone: 'blue', description: en ? 'Writing, reviewing, and maintaining documentation.' : '文档编写、审校与维护中遇到的问题和做法。' },
    { label: en ? 'Self-Hosted' : '私有云', icon: DesktopIcon, tone: 'green', description: en ? 'Running services at home, from storage to a personal knowledge base.' : '在家搭建服务，从文件存储到个人知识库。' },
    { label: en ? 'Information Design' : '信息设计', icon: LayersIcon, tone: 'amber', description: en ? 'How words, layout, and interactions shape everyday experiences.' : '从日常体验看文字、布局和交互如何影响理解。' },
  ]
  const visible = tags.filter(tag => tag.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, en ? 'en' : 'zh-CN'))
  return (
    <HtmlClassNameProvider className={`${ThemeClassNames.wrapper.blogPages} ${ThemeClassNames.page.blogTagsListPage}`}>
      <PageMetadata title={title} description={en ? 'Browse articles by topic.' : '按主题查找文章。'} />
      <SearchMetadata tag="blog_tags_list" />
      <MyLayout>
        <header className="site-page-heading">
          <h1>{title}</h1>
          <p>{en ? 'Browse the subjects I’ve written about.' : '从感兴趣的话题开始读。'}</p>
          <BlogBrowseNav active="topics" />
        </header>
        <section aria-label={en ? 'Featured topics' : '主要主题'} className={styles.featured}>
          {featured.map(({ label, icon: Icon, tone, description }) => {
            const tag = tags.find(item => item.label === label)
            return tag && (
              <Link key={tag.permalink} to={tag.permalink} className={styles.card} data-tone={tone}>
                <div className={styles.cardTop}>
                  <Icon aria-hidden="true" />
                  <span>{en ? `${tag.count} ${tag.count === 1 ? 'article' : 'articles'}` : `${tag.count} 篇文章`}</span>
                </div>
                <h2>{tag.label}</h2>
                <p>{description}</p>
                <span className={styles.read}>
                  {en ? 'Browse articles' : '浏览文章'}
                  <ArrowRightIcon aria-hidden="true" />
                </span>
              </Link>
            )
          })}
        </section>
        <section aria-labelledby="all-topics-title" className={styles.all}>
          <div className={styles.toolbar}>
            <div>
              <h2 id="all-topics-title">{en ? 'All topics' : '全部话题'}</h2>
              <p>{en ? 'Numbers show how many articles use each tag.' : '数字表示该话题下的文章数，一篇文章可以属于多个话题。'}</p>
            </div>
            <label className={styles.search}>
              <span>{en ? 'Find a topic' : '查找话题'}</span>
              <div>
                <MagnifyingGlassIcon aria-hidden="true" />
                <input ref={searchInput} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={en ? 'Topic name' : '输入话题名称'} />
              </div>
            </label>
          </div>
          <p className={styles.result} role="status">{en ? `${visible.length} topics` : `${visible.length} 个话题`}</p>
          <ul className={styles.tags} data-blog-topic-list>
            {visible.map(tag => (
              <li key={tag.permalink}>
                <Link to={tag.permalink}>
                  {tag.label}
                  <span>{tag.count}</span>
                </Link>
              </li>
            ))}
          </ul>
          {visible.length === 0 && (
            <div className={styles.empty}>
              <p>{en ? 'No matching topics. Try another word.' : '没有找到匹配的话题，换个词试试。'}</p>
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  searchInput.current?.focus()
                }}
              >
                {en ? 'Show all topics' : '显示全部话题'}
              </button>
            </div>
          )}
        </section>
      </MyLayout>
    </HtmlClassNameProvider>
  )
}
