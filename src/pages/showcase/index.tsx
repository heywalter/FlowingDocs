/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import Translate, { translate } from '@docusaurus/Translate'
import Link from '@docusaurus/Link'
import { PageMetadata } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'

import { getLocalizedKeywords, SHOWCASE_KEYWORDS } from '@site/src/lib/seo'
import ShowcaseSearchBar from '@site/src/pages/showcase/_components/ShowcaseSearchBar'
import ShowcaseCards from './_components/ShowcaseCards'
import ShowcaseFilters from './_components/ShowcaseFilters'

const TITLE = translate({
  message: '项目与工具展示',
  id: 'showcase.title',
})
const DESCRIPTION = translate({
  message:
    'Flowing Docs 项目与工具展示，整理技术写作、开发者体验、AI 工具集成和文档工程化实践案例，欢迎交流与反馈。',
  id: 'showcase.description',
})

const SUBMIT_URL = 'https://github.com/heywalter/flowingdocs/discussions'

function ShowcaseHeader() {
  return (
    <section className="margin-top--lg margin-bottom--lg text--center">
      <Heading as="h1">{TITLE}</Heading>
      <p>{DESCRIPTION}</p>
      <Link className="button button--primary" to={SUBMIT_URL}>
        <Translate id="showcase.header.button">💬 提交建议 / 留言交流</Translate>
      </Link>
    </section>
  )
}

export default function Showcase(): JSX.Element {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext()

  return (
    <Layout title={TITLE} description={DESCRIPTION}>
      <PageMetadata keywords={getLocalizedKeywords(currentLocale, SHOWCASE_KEYWORDS)} />
      <main className="margin-vert--lg">
        <ShowcaseHeader />
        <ShowcaseFilters />
        <div
          style={{ display: 'flex', marginLeft: 'auto' }}
          className="container"
        >
          <ShowcaseSearchBar />
        </div>
        <ShowcaseCards />
      </main>
    </Layout>
  )
}
