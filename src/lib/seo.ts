export type LocalizedSeoText = {
  'zh-Hans': string
  'en': string
}

export type LocalizedSeoKeywords = {
  'zh-Hans': string[]
  'en': string[]
}

export const BLOG_KEYWORDS: LocalizedSeoKeywords = {
  'zh-Hans': ['Flowing Docs', '知流小记', '个人博客', 'AI 工具', '自托管', '技术写作', '个人项目', '生活记录'],
  'en': ['Flowing Docs', 'personal blog', 'AI tools', 'self-hosting', 'technical writing', 'personal projects', 'everyday life'],
}

export const BLOG_ARCHIVE_DESCRIPTION: LocalizedSeoText = {
  'zh-Hans': 'Flowing Docs 博客归档，按年份整理 AI 工具、自托管、技术写作、个人项目与生活记录。',
  'en': 'Flowing Docs posts by year, covering AI tools, self-hosting, technical writing, personal projects, and everyday life.',
}

export const BLOG_TAGS_DESCRIPTION: LocalizedSeoText = {
  'zh-Hans': 'Flowing Docs 博客标签索引，按主题浏览工作经验、工具使用、个人项目和生活记录。',
  'en': 'Browse Flowing Docs posts by topic: work experience, tools, personal projects, and everyday life.',
}

export const BLOG_AUTHORS_DESCRIPTION: LocalizedSeoText = {
  'zh-Hans': 'Flowing Docs 作者列表，查看作者资料与发表的文章。',
  'en': 'Flowing Docs authors, their profiles, and published posts.',
}

export const BLOG_AUTHOR_KEYWORDS: LocalizedSeoKeywords = {
  'zh-Hans': ['Flowing Docs', '知流小记', '作者', '个人博客', 'AI 工具', '个人项目', '技术写作'],
  'en': ['Flowing Docs', 'author', 'personal blog', 'AI tools', 'personal projects', 'technical writing'],
}

export const ABOUT_KEYWORDS: LocalizedSeoKeywords = {
  'zh-Hans': ['Walter Gui', 'Flowing Docs', '知流小记', '个人博客', 'AI 工具', '个人项目', '自托管', '技术写作'],
  'en': ['Walter Gui', 'Flowing Docs', 'personal blog', 'AI tools', 'personal projects', 'self-hosting', 'technical writing'],
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
    return `Flowing Docs posts tagged with "${tagName}", collecting related articles and practical notes.`
  }

  return `Flowing Docs 中关于「${tagName}」的博客文章合集，聚合相关主题的文章与实践记录。`
}

export function getBlogAuthorDescription(locale: string, authorName: string): string {
  if (locale === 'en') {
    return `${authorName}'s articles and practical notes on Flowing Docs.`
  }

  return `${authorName} 在 Flowing Docs 发布的文章与实践记录。`
}
