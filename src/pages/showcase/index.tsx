/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import Translate, { translate } from '@docusaurus/Translate'
import Link from '@docusaurus/Link'
import Layout from '@theme/Layout'
import Heading from '@theme/Heading'

import ShowcaseSearchBar from '@site/src/pages/showcase/_components/ShowcaseSearchBar'
import ShowcaseCards from './_components/ShowcaseCards'
import ShowcaseFilters from './_components/ShowcaseFilters'

const TITLE = translate({
  message: '项目与工具展示',
  id: 'showcase.title',
})
const DESCRIPTION = translate({
  message:
    '这里是我从事技术传播工作过程中，沉淀的一些项目案例、开发工具与文档工程化的实践。涵盖技术写作、DX 优化、AI 工具集成等方向，持续更新中，欢迎一起聊天吹水',
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
  return (
    <Layout title={TITLE} description={DESCRIPTION}>
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
