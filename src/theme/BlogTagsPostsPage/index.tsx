import { translate } from '@docusaurus/Translate'
import { HtmlClassNameProvider, PageMetadata, ThemeClassNames, usePluralForm } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { BLOG_KEYWORDS, getBlogTagDescription, getLocalizedKeywords, uniqueKeywords } from '@site/src/lib/seo'
import { cn } from '@site/src/lib/utils'
import BackToTopButton from '@theme/BackToTopButton'
import BlogListPaginator from '@theme/BlogListPaginator'
import BlogPostGridItems from '../BlogPostGridItems'
import type { Props } from '@theme/BlogTagsPostsPage'
import Heading from '@theme/Heading'
import SearchMetadata from '@theme/SearchMetadata'

import MyLayout from '../MyLayout'
import BlogBrowseNav from '@site/src/components/BlogBrowseNav'

// Very simple pluralization: probably good enough for now
function useBlogPostsPlural() {
  const { selectMessage } = usePluralForm()
  return (count: number) =>
    selectMessage(
      count,
      translate(
        {
          id: 'theme.blog.post.plurals',
          description:
            'Pluralized label for "{count} posts". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',
          message: 'One post|{count} posts',
        },
        { count },
      ),
    )
}

function useBlogTagsPostsPageTitle(tag: Props['tag']): string {
  const blogPostsPlural = useBlogPostsPlural()
  return translate(
    {
      id: 'theme.blog.tagTitle',
      description: 'The title of the page for a blog tag',
      message: '{nPosts} tagged with "{tagName}"',
    },
    { nPosts: blogPostsPlural(tag.count), tagName: tag.label },
  )
}

function BlogTagsPostsPageMetadata({ tag }: Props): React.JSX.Element {
  const title = useBlogTagsPostsPageTitle(tag)
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext()
  const keywords = uniqueKeywords([tag.label, ...getLocalizedKeywords(currentLocale, BLOG_KEYWORDS)])

  return (
    <>
      <PageMetadata title={title} description={getBlogTagDescription(currentLocale, tag.label)} keywords={keywords} />
      <SearchMetadata tag="blog_tags_posts" />
    </>
  )
}

function BlogTagsPostsPageContent({ tag, items, sidebar, listMetadata }: Props): React.JSX.Element {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  return (
    <MyLayout>
      <header className="site-page-heading">
        <Heading as="h1">{tag.label}</Heading>
        <p>{en ? `${tag.count} ${tag.count === 1 ? 'article' : 'articles'} on this topic.` : `这个话题下有 ${tag.count} 篇文章。`}</p>
        <BlogBrowseNav />
      </header>
      <BlogPostGridItems items={items} />
      <BlogListPaginator metadata={listMetadata} />
      <BackToTopButton />
    </MyLayout>
  )
}
export default function BlogTagsPostsPage(props: Props): React.JSX.Element {
  return (
    <HtmlClassNameProvider className={cn(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogTagPostListPage)}>
      <BlogTagsPostsPageMetadata {...props} />
      <BlogTagsPostsPageContent {...props} />
    </HtmlClassNameProvider>
  )
}
