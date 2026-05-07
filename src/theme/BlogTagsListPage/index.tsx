import { HtmlClassNameProvider, PageMetadata, ThemeClassNames, translateTagsPageTitle } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { Icon } from '@iconify/react'
import { BLOG_KEYWORDS, BLOG_TAGS_DESCRIPTION, getLocalizedKeywords, getLocalizedText } from '@site/src/lib/seo'
import { cn } from '@site/src/lib/utils'
import type { Props } from '@theme/BlogTagsListPage'
import SearchMetadata from '@theme/SearchMetadata'
import TagsListByLetter from '@theme/TagsListByLetter'
import { useState } from 'react'
import { TagsListByFlat } from '../TagsListByLetter'

import MyLayout from '../MyLayout'

export default function BlogTagsListPage({ tags, sidebar }: Props): JSX.Element {
  const title = translateTagsPageTitle()
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext()
  const description = getLocalizedText(currentLocale, BLOG_TAGS_DESCRIPTION)

  const [type, setType] = useState<'list' | 'grid'>('list')

  return (
    <HtmlClassNameProvider className={cn(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogTagsListPage)}>
      <PageMetadata title={title} description={description} keywords={getLocalizedKeywords(currentLocale, BLOG_KEYWORDS)} />
      <SearchMetadata tag="blog_tags_list" />
      <MyLayout>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1>{title}</h1>
          <span className="flex">
            <Icon
              icon="ph:list"
              width="24"
              height="24"
              onClick={() => setType('list')}
              color={type === 'list' ? 'var(--ifm-color-primary)' : '#ccc'}
            />
            <Icon
              icon="ph:grid-four"
              width="24"
              height="24"
              onClick={() => setType('grid')}
              color={type === 'grid' ? 'var(--ifm-color-primary)' : '#ccc'}
            />
          </span>
        </div>
        {type === 'list' && <TagsListByLetter tags={tags} />}
        {type === 'grid' && <TagsListByFlat tags={tags} />}
      </MyLayout>
    </HtmlClassNameProvider>
  )
}
