import { type ComponentProps } from 'react'
import { PageMetadata } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import {
  BLOG_AUTHOR_KEYWORDS,
  BLOG_AUTHORS_DESCRIPTION,
  getLocalizedKeywords,
  getLocalizedText,
} from '@site/src/lib/seo'
import BlogAuthorsListPageOriginal from '@theme-original/Blog/Pages/BlogAuthorsListPage'

type Props = ComponentProps<typeof BlogAuthorsListPageOriginal>

export default function BlogAuthorsListPageWrapper(props: Props): JSX.Element {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext()

  return (
    <>
      <PageMetadata
        description={getLocalizedText(currentLocale, BLOG_AUTHORS_DESCRIPTION)}
        keywords={getLocalizedKeywords(currentLocale, BLOG_AUTHOR_KEYWORDS)}
      />
      <BlogAuthorsListPageOriginal {...props} />
    </>
  )
}
