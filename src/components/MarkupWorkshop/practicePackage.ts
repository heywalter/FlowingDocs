import type { Locale, Syntax } from './course'

// Rewrite only the bundled course asset; preserve the learner's other content.
export function practiceFiles(source: string, syntax: Syntax, locale: Locale, panel: string): Record<string, string> {
  const filename = 'mysql-operations-guide.' + (syntax === 'markdown' ? 'md' : 'adoc')
  return {
    [filename]: source.replaceAll('/img/markup/mysql-architecture.svg', './images/mysql-architecture.svg'),
    'images/mysql-architecture.svg': panel,
    'README.txt': locale === 'zh'
      ? 'MySQL 数据库运维说明练习包\n\n源文件包含你的当前草稿，可能还有未完成的练习。\n请将 images 文件夹和源文件放在一起，保留相对位置。只打包本课提供的架构图，自行添加的图片需要另行准备。\n\n发布工具选择与 Markdown 模板：https://flowingdocs.com/docs/publishing/\nAsciiDoc 请使用兼容的 Asciidoctor 或 Antora 工具链，不能只改成 .md 后缀。\n示例数据库场景，仅用于技术文档练习。\n'
      : 'MySQL operations practice package\n\nThe source contains your current draft, including unfinished exercises.\nKeep the images folder beside the source file. Only the supplied architecture diagram is bundled; add custom images separately.\n\nPublishing tool choices and Markdown template: https://flowingdocs.com/en/docs/publishing/\nFor AsciiDoc, use compatible Asciidoctor or Antora tooling; renaming the file to .md does not convert it.\nSample database scenario, for documentation practice only.\n',
  }
}
