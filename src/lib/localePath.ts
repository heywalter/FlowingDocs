// Keep published tag URLs stable while mapping their translated labels.
export const tagPairs: [string, string][] = [
  ['技术写作', 'technical-writing'], ['技术文档', 'technical-writing'],
  ['ai-审校', 'ai-review'], ['中文纠错', 'chinese-text-correction'],
  ['中文纠错', 'technical-docs-correction'], ['本地模型', 'local-models'],
  ['文档工程', 'documentation-workflow'], ['文档治理', 'documentation-workflow'],
  ['文档工程化', 'documentation-engineering'], ['开源', 'open-source'],
  ['doc-as-code', 'docs-as-code'], ['ai-agent', 'ai-agents'],
  ['自动化验证', 'automated-validation'], ['私有云', 'self-hosted'],
  ['自建服务器', 'home-server'], ['个人知识库', 'knowledge-base'], ['家庭实验室', 'home-lab'],
  ['博客搭建', 'blog-setup'], ['建站经验', 'developer-tools'],
  ['博客起步', 'getting-started'], ['个人记录', 'personal-notes'],
  ['ai-工具', 'ai-tools'], ['模型路由', 'model-routing'],
  ['用户体验', 'user-experience'], ['信息设计', 'information-design'],
  ['案例分析', 'case-studies'], ['视觉层级', 'visual-hierarchy'], ['交互设计', 'interaction-design'],
]
export const sharedTags = new Set(['ai', 'algolia', 'asciidoc', 'codex', 'deep-seek', 'docker', 'docusaurus', 'giscus', 'mac-os', 'netlify', 'nextcloud', 'opencodex', 'rag'])

export function alternateLocalePath(pathname: string, english: boolean): string {
  const path = pathname.replace(/^\/en(?=\/|$)/, '') || '/'
  const prefix = english ? '/en' : ''
  if (/^\/404(?:\.html|\/|$)/.test(path)) return prefix + '/'
  const match = path.match(/^\/blog\/tags\/([^/]+)(?:\/(.*))?$/)
  if (match) {
    let slug: string
    try {
      slug = decodeURIComponent(match[1]!)
    }
    catch { return `${prefix}/blog/tags/` }
    const pair = tagPairs.find(([zh, en]) => (english ? zh : en) === slug)
    const target = pair?.[english ? 1 : 0] ?? (sharedTags.has(slug) ? slug : undefined)
    // A translated tag can have a different number of pages. Start at its first page.
    return target ? `${prefix}/blog/tags/${target}/` : `${prefix}/blog/tags/`
  }
  return prefix + path
}
