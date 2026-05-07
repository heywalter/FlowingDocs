export type LocalizedSeoText = {
  'zh-Hans': string
  'en': string
}

export type LocalizedSeoKeywords = {
  'zh-Hans': string[]
  'en': string[]
}

export const BLOG_KEYWORDS: LocalizedSeoKeywords = {
  'zh-Hans': ['Flowing Docs', '知流小记', '技术写作', '技术传播', '文档工程', '用户体验', 'Docusaurus', 'AI 审校'],
  'en': [
    'Flowing Docs',
    'technical writing',
    'technical communication',
    'documentation engineering',
    'user experience',
    'Docusaurus',
    'AI review',
  ],
}

export const BLOG_ARCHIVE_DESCRIPTION: LocalizedSeoText = {
  'zh-Hans': 'Flowing Docs 博客归档，按年份整理技术写作、文档工程、Docusaurus、AI 工具和个人实践文章。',
  'en': 'Flowing Docs blog archive, organized by year across technical writing, documentation engineering, Docusaurus, AI tools, and personal practice notes.',
}

export const BLOG_TAGS_DESCRIPTION: LocalizedSeoText = {
  'zh-Hans': 'Flowing Docs 博客标签索引，用于浏览技术写作、文档工程、Docusaurus、AI 工具和用户体验等主题。',
  'en': 'Flowing Docs blog tag index for browsing topics such as technical writing, documentation engineering, Docusaurus, AI tools, and user experience.',
}

export const BLOG_AUTHORS_DESCRIPTION: LocalizedSeoText = {
  'zh-Hans': 'Flowing Docs 作者列表，查看作者资料和他们发布的技术写作、文档工程与实践文章。',
  'en': 'Flowing Docs author list with author profiles and posts about technical writing, documentation engineering, and practical workflows.',
}

export const BLOG_AUTHOR_KEYWORDS: LocalizedSeoKeywords = {
  'zh-Hans': ['Flowing Docs', '知流小记', '作者', '博客作者', '技术写作', '文档工程', '技术传播'],
  'en': ['Flowing Docs', 'author', 'blog author', 'technical writing', 'documentation engineering', 'technical communication'],
}

export const ABOUT_KEYWORDS: LocalizedSeoKeywords = {
  'zh-Hans': ['Walter Gui', 'Flowing Docs', '知流小记', '技术文档工程师', '技术写作', '技术传播', '内容设计', '开发者体验', '文档工程'],
  'en': [
    'Walter Gui',
    'Flowing Docs',
    'technical documentation engineer',
    'technical writing',
    'technical communication',
    'content design',
    'developer experience',
    'documentation engineering',
  ],
}

export const SHOWCASE_KEYWORDS: LocalizedSeoKeywords = {
  'zh-Hans': ['Flowing Docs', '项目案例', '文档工程', '技术写作', '开发者体验', 'AI 工具', 'Docusaurus', '内容设计'],
  'en': ['Flowing Docs', 'project showcase', 'documentation engineering', 'technical writing', 'developer experience', 'AI tools', 'Docusaurus', 'content design'],
}

export const FRIENDS_KEYWORDS: LocalizedSeoKeywords = {
  'zh-Hans': ['Flowing Docs', '友链', '技术文档社区', '技术写作', '技术传播', 'Docusaurus', '文档工程'],
  'en': ['Flowing Docs', 'friends', 'technical documentation community', 'technical writing', 'technical communication', 'Docusaurus', 'documentation engineering'],
}

export const SEARCH_KEYWORDS: LocalizedSeoKeywords = {
  'zh-Hans': ['Flowing Docs', '站内搜索', '文档搜索', '博客搜索', '技术写作', '文档工程'],
  'en': ['Flowing Docs', 'site search', 'documentation search', 'blog search', 'technical writing', 'documentation engineering'],
}

export const SEARCH_DESCRIPTION: LocalizedSeoText = {
  'zh-Hans': '在 Flowing Docs 中搜索博客文章、技术文档和项目实践内容。',
  'en': 'Search Flowing Docs blog posts, technical docs, and project notes.',
}

export function getLocalizedText(locale: string, text: LocalizedSeoText): string {
  return locale === 'en' ? text.en : text['zh-Hans']
}

export function getLocalizedKeywords(locale: string, keywords: LocalizedSeoKeywords): string[] {
  return locale === 'en' ? keywords.en : keywords['zh-Hans']
}

export function uniqueKeywords(keywords: string[]): string[] {
  const seen = new Set<string>()

  return keywords.filter((keyword) => {
    const normalizedKeyword = keyword.toLocaleLowerCase()

    if (seen.has(normalizedKeyword)) {
      return false
    }

    seen.add(normalizedKeyword)
    return true
  })
}

export function getBlogTagDescription(locale: string, tagName: string): string {
  if (locale === 'en') {
    return `Flowing Docs posts tagged with "${tagName}", collecting related notes on technical writing, documentation engineering, and practical workflows.`
  }

  return `Flowing Docs 中关于「${tagName}」的博客文章合集，聚合相关技术写作、文档工程和实践记录。`
}

export function getBlogAuthorDescription(locale: string, authorName: string): string {
  if (locale === 'en') {
    return `${authorName}'s Flowing Docs posts about technical writing, documentation engineering, AI tools, and practical workflows.`
  }

  return `${authorName} 在 Flowing Docs 发布的文章合集，记录技术写作、文档工程、AI 工具与实践经验。`
}
