import { type ComponentProps } from 'react'
import { PageMetadata } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { getLocalizedKeywords, getLocalizedText, SEARCH_DESCRIPTION, SEARCH_KEYWORDS } from '@site/src/lib/seo'
import SearchPageOriginal from '@theme-original/SearchPage'

type Props = ComponentProps<typeof SearchPageOriginal>

export default function SearchPageWrapper(props: Props): JSX.Element {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext()

  return (
    <>
      <PageMetadata
        description={getLocalizedText(currentLocale, SEARCH_DESCRIPTION)}
        keywords={getLocalizedKeywords(currentLocale, SEARCH_KEYWORDS)}
      />
      <SearchPageOriginal {...props} />
    </>
  )
}
