import { HtmlClassNameProvider, PageMetadata, ThemeClassNames } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import BlogBrowseNav from '@site/src/components/BlogBrowseNav'
import { BLOG_KEYWORDS, getLocalizedKeywords } from '@site/src/lib/seo'
import type { Props } from '@theme/BlogListPage'
import BlogListPaginator from '@theme/BlogListPaginator'
import SearchMetadata from '@theme/SearchMetadata'
import BlogPostGridItems from '../BlogPostGridItems'
import MyLayout from '../MyLayout'

export default function BlogListPage({ metadata, items }: Props) {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  const title = en ? 'Articles' : '文章'
  return (
    <HtmlClassNameProvider className={`${ThemeClassNames.wrapper.blogPages} ${ThemeClassNames.page.blogListPage}`}>
      <PageMetadata title={title} description={metadata.blogDescription} keywords={getLocalizedKeywords(currentLocale, BLOG_KEYWORDS)} />
      <SearchMetadata tag="blog_posts_list" />
      <MyLayout>
        <header className="site-page-heading">
          <h1>{title}</h1>
          <p>{en ? 'Work experience, tools I’ve tried, personal projects, and everyday notes.' : '工作中的经验，试过的工具，做过的项目，也有一些日常记录。'}</p>
          <BlogBrowseNav active="articles" />
        </header>
        <BlogPostGridItems items={items} />
        <BlogListPaginator metadata={metadata} />
      </MyLayout>
    </HtmlClassNameProvider>
  )
}
