---
slug: /
title: 技术文档实践
sidebar_label: 文档总览
sidebar_position: 1
hide_table_of_contents: true
hide_title: true
description: "围绕标记语言、信息表达和文档发布，记录具体问题、处理方式与适用边界。"
image: /img/flowingdocs.png
tags:
  - technical-writing
  - information-design
  - documentation-engineering
  - docs-as-code
---

import DocsJourney from '@site/src/components/DocsJourney';

<DocsJourney />

这里记录技术文档工作中的具体问题、处理办法和取舍，面向需要写产品说明、接口文档或操作手册的技术写作者与研发人员。可以按手头的问题查阅，不必按顺序学完。

## 文档标记语言 {#start-here}

表格需要合并单元格，同一条提醒要放进两份说明，或者一套内容要组成不同手册——这些需求会影响格式选择。

- [对照常用写法](./markup/index.mdx?exercise=intro)：标题、列表、代码、图片与提示。
- [普通表格与合并单元格](./markup/index.mdx?syntax=asciidoc&exercise=table-spans)：Markdown 内嵌 HTML 与 AsciiDoc 原生写法。
- [一处修改，多处使用](./markup/index.mdx?syntax=asciidoc&view=reuse)：包含文件、变量，以及不同工具的限制。
- [用 DITA 组织多份说明](./markup/index.mdx?syntax=dita&exercise=intro)：Topic、Map 和复用，附可导出的项目。

练习借用 MySQL 场景来比较写法，重点是文档结构。它们不构成完整的数据库安装或生产变更流程。

## 信息表达 {#information-design}

“超时时间，默认 30”缺了什么？什么时候该用标签页，什么时候应该让两种方案同时可见？

从[把内容写清楚，让读者用得上](./information-design/index.mdx)开始。需要整理具体文档时，再查：

- [概念说明](./information-design/concept.md)：解释是什么、为什么，以及适用边界。
- [操作步骤](./information-design/task.md)：写清准备条件、执行动作和成功的判断方法。
- [参数参考](./information-design/reference.md)：交代单位、范围、特殊值和生效方式。

## 文档发布 {#publishing}

[选择静态站点生成器](./publishing/index.md)：对比 Docusaurus、VitePress、MkDocs 和 Antora，结合本站的双语、博客与交互组件，说明维护成本。页面也提供构建与发布的原理演示和最小站点模板。

## 这种工作方式适合哪些情况？ {#paradigm-shift}

Docs-as-Code 把版本控制、CI 检查和代码评审搬到了文档维护中。通常以纯文本写作，通过生成器发布为静态网页；文档可以与代码同仓，也可以单独维护。

当文档需要随产品版本维护、批量检查链接或多人评审时，这套方式比较方便。相应地，团队也需要维护构建依赖、发布配置，并处理分支合并。

Word 和在线协同文档同样拥有版本记录与模板能力。参与者是否习惯 Git、现有工具链是否够用，往往比格式本身更影响选择。如果现有协作方式已经够用，也可以继续使用。AI 可以辅助起草和校验，但技术事实仍要回到产品行为、源码或测试结果核实。

## 后续积累 {#maintenance}

第一版聚焦上面三个主题。API 说明与实现的一致性、AI 协作、用户反馈、访问路径分析和旧内容维护，会在有具体案例时补充。已有的[发布前自查与自动检查示例](./information-design/index.mdx#scorecard)可先使用。

<span id="optional-topics"></span>
<span id="lifecycle"></span>

## 勘误与交流 {#feedback}

发现错误时，可以[提交 Issue 或 PR](https://github.com/heywalter/flowingdocs)，也可以[到关于页面留言](/about)。带上页面地址、具体句子、使用环境和预期结果，会更容易定位问题。
