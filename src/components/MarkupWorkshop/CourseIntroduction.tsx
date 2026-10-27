import React from 'react'
import Link from '@docusaurus/Link'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { panelImage } from './course'
import type { Locale } from './course'
import type { Format } from './workbook'
import styles from './styles.module.css'

export default function CourseIntroduction({ locale, format, ready, onStart, resumeLabel, onResume }: { locale: Locale, format: Format, ready: boolean, onStart: () => void, resumeLabel?: string, onResume: () => void }) {
  const tr = (zh: string, en: string) => locale === 'zh' ? zh : en
  const rows = [
    [tr('怎样写', 'How you write'), tr('用 #、* 等少量符号写一篇文章。', 'Use a few symbols, such as # and *, to write a document.'), tr('同样是纯文本，内置更多技术文档语法。', 'Plain text with more built-in features for technical documentation.'), tr('用 XML 元素描述内容，按主题组织，再用 map 组装。', 'Describe content with XML elements, organize it into topics, and assemble them with a map.')],
    [tr('常见用途', 'Typical uses'), tr('笔记、博客、README 和一般产品文档。', 'Notes, blogs, READMEs, and product documentation.'), tr('较长的技术手册，需要交叉引用、提示和复杂表格的文档。', 'Longer technical guides with cross-references, admonitions, and complex tables.'), tr('多个产品或版本共用内容，需统一结构和管理发布的文档。', 'Documentation that shares content across products or versions and needs consistent structure and managed publishing.')],
    [tr('表格与合并', 'Tables and spans'), tr('常见的管道表格属于 GFM 等扩展，没有原生合并语法；可嵌入 HTML，但平台需允许。', 'Pipe tables are extensions, such as GFM, with no native spans. Embedded HTML can add spans where the platform allows it.'), tr('原生表格语法支持跨行、跨列。', 'Table syntax supports row and column spans.'), tr('table 使用 CALS 表格模型，可合并单元格；simpletable 适合简单表格。', 'The table element uses the CALS model and supports spans; simpletable covers simpler tables.')],
    [tr('内容复用', 'Content reuse'), tr('通常依靠站点工具或扩展。', 'Usually handled by site tooling or extensions.'), tr('通过 include 引入文件，用属性替换重复值。', 'Use includes for files and attributes for repeated values.'), tr('通过 map 复用主题，通过 conref 等机制复用内容片段。', 'Reuse topics in maps and content fragments through mechanisms such as conref.')],
    [tr('工具与投入', 'Tools and effort'), tr('文本编辑器就能起步；不同平台的扩展写法有差别。', 'Start in a text editor; extensions vary between platforms.'), tr('文本编辑器配合 Asciidoctor 等处理器；需要多学一些语法。', 'Use a text editor and a processor such as Asciidoctor; there is more syntax to learn.'), tr('常搭配 Oxygen 等编辑器做结构化编辑和校验，通过 DITA-OT 等工具发布；需要先理解主题与地图。', 'Often authored and validated in tools such as Oxygen, then published with tools such as DITA-OT. Learn topics and maps first.')],
  ]
  const startLabel = format === 'dita' ? tr('从 DITA 主题开始', 'Start with DITA topics') : tr('开始第一项练习', 'Start the first lesson')
  return (
    <section className={styles.introduction} aria-labelledby="markup-intro-title">
      <div className={styles.coursePosition}>
        <strong>{tr('技术文档实践 · 标记语言', 'Documentation practice · Markup')}</strong>
        <p>{tr('用同一份说明对照不同写法：表格怎样合并，内容怎样复用，哪些能力依赖工具。可以按问题查看，不必完成全部练习。', 'Compare notation using the same guide: table spans, content reuse, and capabilities that depend on tools. Browse by problem; completing every exercise is optional.')}</p>
        <Link to={locale === 'en' ? '/en/docs/' : '/docs/'}>{tr('查看文档实践主题', 'Browse documentation topics')}</Link>
      </div>
      <span className={styles.eyebrow}>{tr('开始之前 · 约 3 分钟', 'Before you begin · About 3 minutes')}</span>
      <h2 id="markup-intro-title">{tr('什么是文档标记语言？', 'What is document markup?')}</h2>
      <p>{tr('文档标记语言是一套用符号或标签表示标题、列表等内容的写法，方便工具把文本生成网页或 PDF。', 'A document markup language uses symbols or tags to identify headings, lists, and other content so tools can turn the text into web pages or PDFs.')}</p>
      <nav className={styles.introContents} aria-label={tr('概览目录', 'Overview sections')}>
        <a href="#markup-example-title">{tr('标记是什么', 'What markup means')}</a>
        <a href="#markup-why-title">{tr('为什么用', 'Why use it')}</a>
        <a href="#markup-format-comparison">{tr('三种格式', 'Three formats')}</a>
        <a href="#markup-ai-title">{tr('与 AI 配合', 'Working with AI')}</a>
      </nav>
      <figure className={styles.deviceIntro}>
        <img src={panelImage} width="300" height="200" alt={tr('MySQL 体系架构拓扑：连接池、查询优化器与 InnoDB 存储引擎', 'MySQL architecture topology: connection pool, optimizer, and InnoDB engine')} />
        <figcaption>
          <strong>{tr('就从一份 MySQL 运维手册开始', 'Start with a MySQL operations manual')}</strong>
          <p>{tr('用 MySQL 场景比较标题、列表、表格和操作说明的写法。这里提供的是练习素材，不是完整的数据库安装或生产变更流程。', 'Use MySQL scenarios to compare headings, lists, tables and procedures. These are writing exercises, not complete installation or production-change instructions.')}</p>
          <p>{format === 'dita' ? tr('本课产出：一组 DITA 主题与 map 文件，可下载后继续编辑和发布。', 'Your result: DITA topics and map files to download, edit, and publish.') : tr('本课产出：一份 Markdown 或 AsciiDoc 源文件。页面预览帮助你检查写法，后续再把文件发布成网站。', 'Your result: a Markdown or AsciiDoc source file. The preview helps you check the notation; publishing the file as a site comes next.')}</p>
          <small>{tr('示例数据库场景，用于技术写作与结构化文档排版练习。', 'A realistic database scenario designed for technical writing and structured documentation practice.')}</small>
          <div className={styles.introActions}>
            <button className={styles.primary} disabled={!ready} onClick={resumeLabel ? onResume : onStart}>
              {resumeLabel ? tr('继续上次练习：', 'Resume: ') + resumeLabel : startLabel}
              <ArrowRightIcon />
            </button>
            <a href="#markup-format-comparison">{tr('先看看三种格式的区别', 'Compare the three formats')}</a>
          </div>
        </figcaption>
      </figure>
      <section className={styles.introSection} aria-labelledby="markup-example-title">
        <h3 id="markup-example-title">{tr('几行文字，就能表达层次', 'A few lines are enough to show structure')}</h3>
        <p>{tr('以 Markdown 为例：## 表示二级标题，数字加句点表示有序列表，两个星号围住的文字会加粗。这些符号不是要显示给读者的正文，而是写给处理工具的约定。', 'In Markdown, ## marks a level-two heading, a number followed by a period starts an ordered list, and paired double asterisks mark strong emphasis. These symbols tell the processor how to interpret the text.')}</p>
        <div className={styles.introExample}>
          <div>
            <span>{tr('你写的 Markdown', 'Markdown source')}</span>
            <pre><code>{tr('## 启动前检查\n\n1. 确认 3306 端口未占用。\n2. **验证数据目录写权限**。', '## Pre-flight checks\n\n1. Confirm port 3306 is free.\n2. **Verify data directory permissions**.')}</code></pre>
          </div>
          <div>
            <span>{tr('读者看到的效果', 'What the reader sees')}</span>
            <div className={styles.introExampleResult}>
              <h4>{tr('启动前检查', 'Pre-flight checks')}</h4>
              <ol>
                <li>{tr('确认 3306 端口未占用。', 'Confirm port 3306 is free.')}</li>
                <li>
                  <strong>{tr('验证数据目录写权限', 'Verify data directory permissions')}</strong>
                  {tr('。', '.')}
                </li>
              </ol>
            </div>
          </div>
        </div>
        <p>{tr('Markdown 和 AsciiDoc 都是轻量级标记语言；DITA 则是一套基于 XML 的结构化文档架构，还规定了内容怎样拆分、组织和复用。它们都能表达文档结构，但解决的问题并不完全相同。', 'Markdown and AsciiDoc are lightweight markup languages. DITA is an XML-based architecture for structured documentation: it also defines how content is divided, organized, and reused. All three express structure, but they address different needs.')}</p>
      </section>
      <section className={styles.introSection} aria-labelledby="markup-why-title">
        <h3 id="markup-why-title">{tr('为什么技术工程推崇纯文本标记？', 'Why technical engineering favors plain-text markup')}</h3>
        <dl className={styles.introReasons}>
          <div>
            <dt>{tr('内容与排版表现彻底解耦', 'Decoupling content from presentation')}</dt>
            <dd>{tr('专注梳理技术逻辑与准确描述，无需手动调整字号缩进。全站排版风格由静态生成器与主题模板统一构建保障。', 'Focus on technical logic and accuracy without manual styling. Site-wide formatting is handled consistently by generators and themes.')}</dd>
          </div>
          <div>
            <dt>{tr('方便比较修改', 'Compare changes')}</dt>
            <dd>{tr('原生接入 Git 等版本控制系统。修改步骤、增删参数均可通过行级 Diff 清晰呈现，方便团队协作与审计。', 'Native integration with Git workflows. Every step change and parameter update is tracked as a line-level diff for clear team audit.')}</dd>
          </div>
          <div>
            <dt>{tr('配合工具发布', 'Publish with compatible tools')}</dt>
            <dd>{tr('源文件可以交给相应工具生成网页、PDF 或离线文档；支持哪些输出、如何检查，需要按工具配置。', 'Compatible tools can turn source files into websites, PDFs or offline documents. Output formats and checks depend on the tools and configuration.')}</dd>
          </div>
        </dl>
        <p>{tr('纯文本便于比较修改和批量处理，但版本管理、内容复用和发布仍需要配套流程。', 'Plain text helps with change review and batch processing. Versioning, reuse and publishing still need an appropriate workflow.')}</p>
      </section>
      <section className={styles.introSection} aria-labelledby="markup-format-comparison">
        <h3 id="markup-format-comparison">{tr('Markdown、AsciiDoc 与 DITA 有什么区别', 'How Markdown, AsciiDoc and DITA differ')}</h3>
        <p>{tr('选择取决于要表达的内容、复用需求，以及团队愿意投入多少学习和维护精力。', 'Choose based on the content, reuse needs, and how much learning and maintenance your team can support.')}</p>
        <div className={styles.introTableScroll} role="region" aria-label={tr('三种文档格式比较，可横向滚动', 'Document format comparison; scroll horizontally')} tabIndex={0}>
          <table className={styles.introComparison}>
            <caption>{tr('按写作和维护需求选择格式', 'Choose a format for your writing and maintenance needs')}</caption>
            <thead>
              <tr>
                <th scope="col">{tr('关注维度', 'Dimension')}</th>
                <th scope="col">Markdown</th>
                <th scope="col">AsciiDoc</th>
                <th scope="col">DITA</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([title, ...cells]) => (
                <tr key={title}>
                  <th scope="row">{title}</th>
                  {cells.map((cell, i) => <td key={i}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={styles.introRecommendation}>{tr('“写一份说明”路线可从 Markdown 起步，随后用 AsciiDoc 对照高阶表达；“DITA · 组织多份说明”路线则演示模块化 Topic 与 Map 在大型手册中的组装逻辑。', 'Choose Write a guide to start with Markdown and compare AsciiDoc notation. Choose DITA · Organize guides to explore modular Topic and Map compilation for complex suites.')}</p>
      </section>
      <section className={styles.introSection} aria-labelledby="markup-ai-title">
        <h3 id="markup-ai-title">{tr('怎样与 AI 配合', 'Working with AI')}</h3>
        <p>{tr('标题便于按小节提供上下文，列表保留顺序，代码块区分命令和说明。可以请 AI 检查某一小节是否缺少条件，但不能据此保证检索效果或回答准确率。', 'Headings help select context, lists preserve order, and code blocks distinguish commands from explanations. Ask AI to check a specific section for missing conditions; the format alone does not guarantee retrieval quality or accuracy.')}</p>
        <blockquote className={styles.introPrompt}>
          <strong>{tr('审阅提示示例', 'Example review prompt')}</strong>
          <p>{tr('“输入包含‘启动前检查’与‘操作流程’两节内容。请仅审查各步骤是否缺失前置条件与验证命令，列出问题项，禁止改写原文或捏造未经说明的产品特性。”', '“Attached are ‘Before you begin’ and ‘Operation steps’. Review only for missing preconditions or verification commands. List issues explicitly without rewriting or inventing features.”')}</p>
        </blockquote>
        <p>{tr('标准化的 Markdown 结构虽然更易被程序化工具检索解析，但并不自动保证大模型输出的准确率。涉及复杂表格与系统拓扑时，依然需要人工结合产品事实进行终审校验。', 'Standardized markup enables cleaner retrieval and automated parsing, but does not inherently guarantee model accuracy. Complex tables and architecture references still require rigorous human verification against product reality.')}</p>
        <p className={styles.introSource}>
          {tr('相关技术实践：', 'Engineering reference: ')}
          <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">{tr('Anthropic：基于清晰语义分区构建高质量 Agent 上下文', 'Anthropic: Effective context engineering with clear document sections')}</a>
        </p>
      </section>
      <section className={styles.introSection} aria-labelledby="markup-learning-title">
        <h3 id="markup-learning-title">{tr('接下来，动手写一小段', 'Next, write a small section')}</h3>
        <ol className={styles.introSteps}>
          <li>{tr('读本节任务和语法速查，再修改练习素材。', 'Read the task and syntax reference, then edit the starter material.')}</li>
          <li>{tr('对照效果，检查这一段；完成后继续下一项。', 'Review the preview and check your work, then continue to the next lesson.')}</li>
          <li>{tr('随时查看完整成果，也可以下载，放到自己的工具里继续。', 'View the complete result at any time, or download it to continue in your own tools.')}</li>
        </ol>
        <p>{tr('Markdown 和 AsciiDoc 对照练习同一份说明；DITA 练习把说明拆成主题，再组成手册。三种格式的草稿分别保存，切换不会自动转换内容。', 'Markdown and AsciiDoc cover the same guide. DITA exercises split it into topics and assemble a manual. Each format keeps its own draft; switching formats does not convert your writing.')}</p>
        <button className={styles.primary} disabled={!ready} onClick={onStart}>
          {startLabel}
          <ArrowRightIcon />
        </button>
        <p className={styles.introSource}>
          {tr('格式参考：', 'Format references: ')}
          <a href="https://daringfireball.net/projects/markdown/">Markdown</a>
          {' '}
          ·
          <a href="https://docs.asciidoctor.org/asciidoc/latest/">AsciiDoc</a>
          {' '}
          ·
          <a href="https://docs.oasis-open.org/dita/dita/v1.3/os/part0-overview/dita-v1.3-os-part0-overview.html">DITA</a>
        </p>
      </section>
    </section>
  )
}
