/**
 * Showcase Projects Configuration
 *
 * Defines the list of projects displayed on the Flowing Docs showcase page.
 *
 * To add a new project:
 * - Fill in `title`, `description`, `preview`, and `url`
 * - Optional: include `source` link and `tags`
 */

import { translate } from '@docusaurus/Translate'
import { sortBy } from '@site/src/utils/jsUtils'

export type TagType =
  | 'favorite'
  | 'personal_site'
  | 'open_source'
  | 'docusaurus'
  | 'dx'

const Showcase = [
  {
    title: translate({
      message: 'Flowing Docs 博客实践',
      id: 'showcase.flowingdocs.title',
    }),
    description: (
      <>
        {translate({
          message: '基于 Docusaurus 构建的个人博客，聚焦技术写作、开发者体验与内容可维护性，支持暗黑模式、PWA、Giscus 评论、SEO 优化等功能。',
          id: 'showcase.flowingdocs.description',
        })}
      </>
    ),
    preview: 'https://images.pexels.com/photos/265667/pexels-photo-265667.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    url: '/blog/why-i-started-this-blog',
    source: 'https://github.com/heywalter/flowingdocs',
    tags: ['personal_site', 'docusaurus', 'open_source', 'dx'],
  },
]

export type ProjectShowcase = {
  title: string
  description: JSX.Element
  preview: string | null
  url: string
  source: string | null
  tags: TagType[]
}

export type Tag = {
  label: string
  description: string
  color: string
}

export const Tags: { [type in TagType]: Tag } = {
  favorite: {
    label: translate({
      message: '精选项目',
      id: 'showcase.tag.favorite.label',
    }),
    description: translate({
      message: '特别推荐的优质项目',
      id: 'showcase.tag.favorite.description',
    }),
    color: '#ffb300',
  },
  personal_site: {
    label: translate({
      message: '个人博客/主页',
      id: 'showcase.tag.personalSite.label',
    }),
    description: translate({
      message: '个人站点、博客、自我展示类项目',
      id: 'showcase.tag.personalSite.description',
    }),
    color: '#e9669e',
  },
  open_source: {
    label: translate({
      message: '开源项目',
      id: 'showcase.tag.openSource.label',
    }),
    description: translate({
      message: '可访问源码的项目或工具',
      id: 'showcase.tag.openSource.description',
    }),
    color: '#39ca30',
  },
  docusaurus: {
    label: translate({
      message: 'Docusaurus 实践',
      id: 'showcase.tag.docusaurus.label',
    }),
    description: translate({
      message: '基于 Docusaurus 的定制化、组件开发、性能优化等',
      id: 'showcase.tag.docusaurus.description',
    }),
    color: '#343fc3',
  },
  dx: {
    label: translate({
      message: '开发者体验',
      id: 'showcase.tag.dx.label',
    }),
    description: translate({
      message: '聚焦 DX 优化、文档结构与交互设计',
      id: 'showcase.tag.dx.description',
    }),
    color: '#a44fb7',
  },
}

export const TagList = Object.keys(Tags) as TagType[]

function sortShowcase() {
  let result = Showcase
  result = sortBy(result, project => project.title.toLowerCase())
  return result
}

export const sortedShowcase = sortShowcase()
export const showcase = Showcase
