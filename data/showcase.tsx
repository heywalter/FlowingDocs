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

export type TagType =
  | 'favorite'
  | 'personal_site'
  | 'open_source'
  | 'docusaurus'
  | 'dx'
  | 'ai'

const Showcase = [
  {
    title: translate({
      message: 'DocSifter - 技术文档本地审校工具',
      id: 'showcase.ai-review.title',
    }),
    description: (
      <>
        {translate({
          message: '面向中文技术文档的本地审校工具：先隔离代码、SQL 与标记语法，再由规则和本地小模型筛出文字问题；疑难项可按需交给大模型复核，误报记录可复用和导出。',
          id: 'showcase.ai-review.description',
        })}
      </>
    ),
    preview: translate({
      message: 'https://img.flowingdocs.com/images/docsifter-zh-poster.jpg',
      id: 'showcase.ai-review.preview',
    }),
    url: translate({
      message: '/demos/docsifter/index.html',
      id: 'showcase.ai-review.demoUrl',
    }),
    article: translate({
      message: '/blog/docsifter-open-source',
      id: 'showcase.ai-review.articleUrl',
    }),
    source: 'https://github.com/heywalter/docsifter',
    tags: ['favorite', 'open_source', 'ai', 'dx'],
  },
  {
    title: translate({
      message: 'DSH Domain Proxy - 域名分流与耗时观测',
      id: 'showcase.dsh-proxy.title',
    }),
    description: (
      <>
        {translate({
          message: '为 DeepSeek Harness 打造的域名分流插件：让指定 API 域名精准走本地代理（免改 Provider 与 Key），并实时记录请求路径、首字延迟（TTFT）与流式吐字速率。',
          id: 'showcase.dsh-proxy.description',
        })}
      </>
    ),
    preview: translate({
      message: 'https://cdn.jsdelivr.net/npm/dsh-domain-proxy@0.1.1/docs/images/config.jpg',
      id: 'showcase.dsh-proxy.preview',
    }),
    url: translate({
      message: '/blog/dsh-domain-proxy-open-source',
      id: 'showcase.dsh-proxy.url',
    }),
    article: translate({
      message: '/blog/dsh-domain-proxy-open-source',
      id: 'showcase.dsh-proxy.articleUrl',
    }),
    source: 'https://github.com/heywalter/dsh-domain-proxy',
    tags: ['favorite', 'open_source', 'ai', 'dx'],
  },
  {
    title: translate({
      message: 'Flowing Docs 博客实践',
      id: 'showcase.flowingdocs.title',
    }),
    description: (
      <>
        {translate({
          message: '基于 Docusaurus 搭建的个人网站，记录工作、工具与生活。这里也整理网站的中英文内容、交互组件和维护过程。',
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
  description: React.ReactNode
  preview: string | null
  url: string
  article?: string | null
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
  ai: {
    label: translate({
      message: 'AI 实践',
      id: 'showcase.tag.ai.label',
    }),
    description: translate({
      message: '结合 AI / LLM 的工程化实践与工具',
      id: 'showcase.tag.ai.description',
    }),
    color: '#14b8a6',
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

export const sortedShowcase = Showcase
export const showcase = Showcase
