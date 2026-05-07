import { type ComponentProps } from 'react'
import { PageMetadata } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import {
  BLOG_AUTHOR_KEYWORDS,
  getBlogAuthorDescription,
  getLocalizedKeywords,
} from '@site/src/lib/seo'
import BlogAuthorsPostsPageOriginal from '@theme-original/Blog/Pages/BlogAuthorsPostsPage'

type Props = ComponentProps<typeof BlogAuthorsPostsPageOriginal>

function getAuthorPageDescription(author: Props['author'], locale: string): string {
  if (typeof author.description === 'string') {
    return author.description
  }

  return getBlogAuthorDescription(locale, author.name)
}

export default function BlogAuthorsPostsPageWrapper(props: Props): JSX.Element {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext()
  const { author } = props
  const authorDescription = getAuthorPageDescription(author, currentLocale)
  const keywords = [author.name, ...getLocalizedKeywords(currentLocale, BLOG_AUTHOR_KEYWORDS)]

  return (
    <>
      <PageMetadata description={authorDescription} keywords={keywords} />
      <BlogAuthorsPostsPageOriginal {...props} />
    </>
  )
}
