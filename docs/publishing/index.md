---
title: 文档发布：怎样选择静态发布工具与方案
sidebar_label: 文档发布
sidebar_position: 4
description: "比较常见发布工具，结合本站说明内容、导航、主题与维护成本。"
keywords:
  - 静态站点生成器
  - SSG
  - Docusaurus
  - VitePress
  - MkDocs
  - Antora
  - 文档工程
  - 多语言发布
  - 技术写作
image: /img/flowingdocs.png
tags:
  - static-sites
  - tooling-tradeoffs
  - docusaurus
  - architecture
---

import PublishingFlow from '@site/src/components/PublishingFlow';
import DocsJourney from '@site/src/components/DocsJourney';

选发布工具时，我会先看已有文件能否直接使用，再看谁来维护构建、主题和扩展。主题好看很重要，但不能替代这两个判断。

这一页对比几种常见生成器，再用本站说明定制带来的收益与维护工作。它是选型记录，不要求你跟着搭出同样的网站。

## 生成器和托管服务分别做什么 {#how-it-works}

静态站点生成器读取内容、导航配置和主题，在构建时产出 HTML、CSS、JavaScript 等文件。托管服务提供访问地址，并把文件交给浏览器。

<PublishingFlow />

“静态”不表示网页不能交互。本站的语法练习由浏览器中的 JavaScript 提供；它也不意味着所有生成器都会增量构建，具体要看工具与配置。

## 从已有内容和维护能力缩小选择 {#choose-tools}

下面是按常见需求整理的判断，不是性能排名。具体功能需要结合采用的版本、主题和插件确认。

| 工具 | 可以优先考虑的情况 | 需要承担的工作 |
| --- | --- | --- |
| [Docusaurus](https://docusaurus.io/docs/3.9.2) | Markdown / MDX 内容，希望共用博客、文档和 React 组件 | 维护 Node.js 项目；定制主题和组件后，要跟随升级检查 |
| [VitePress](https://vitepress.dev/guide/what-is-vitepress) | Markdown 文档为主，团队熟悉 Vue | 自行组织博客等额外栏目；维护嵌入的 Vue 组件 |
| [MkDocs](https://www.mkdocs.org/user-guide/writing-your-docs/) | Markdown 文档，团队熟悉 Python，希望使用现成主题和插件 | 核对主题、插件兼容性；按需求维护定制 |
| [Antora](https://docs.antora.org/antora/latest/component-version/) | 已有 AsciiDoc，需要组织多个仓库和产品版本 | 按组件、版本与模块组织内容；维护 UI 和发布配置 |

已有大量 AsciiDoc 时，先评估支持它的工具链，再决定是否值得迁移。需要编辑 DITA 时，则应一起评估编辑器、内容管理和 [DITA-OT](https://www.dita-ot.org/dev/topics/output-formats) 等发布工具，不能只比较网站主题。

[Docusaurus 的版本功能](https://docusaurus.io/docs/3.9.2/versioning)会把当前文档与侧边栏复制到版本目录中；它不会自动创建 Git 分支。保留多个版本，也意味着勘误可能需要同步到多份文件。

## 本站为什么用 Docusaurus {#site-example}

FlowingDocs 同时维护博客、文档和中英文内容，也需要嵌入交互示例。这些需求与 Docusaurus 的组织方式比较契合。早期过程见[博客搭建记录](/blog/building-a-docusaurus-blog/)。

- **博客和文档可以各自组织**：博客按时间与话题展开，文档按问题归类。本站定制过博客插件，这部分需要自己跟随框架升级。
- **框架提供语言路由**：翻译、代码示例和标签 URL 是否对应，仍需要逐项检查。构建成功不等于所有跨语言链接都有效。
- **正文可以嵌入 React 组件**：交互练习容易放进页面，但状态、键盘操作、窄屏和错误恢复都要自行实现与验证。

这些是本站采用它的理由，不代表其他文档站也需要同一套工具。

## 扩展写法会影响迁移 {#rendering-differences}

### 提示框依赖渲染工具

Docusaurus 的写法：

```markdown
:::note 版本说明
本例适用于 2.x。
:::
```

本站显示为：

:::note 版本说明
本例适用于 2.x。
:::

迁移到仅支持 CommonMark 的平台时，需要转换这种扩展；它不会自动变成同样的提示框。普通引用写法通常更容易迁移，但表现不同。

### 交互组件依赖运行环境

```mdx
import MarkupWorkshop from '@site/src/components/MarkupWorkshop';

<MarkupWorkshop />
```

这段代码需要相应的组件、依赖和 React/MDX 环境。只复制文件中的文字，无法带走整个练习工作台。

我的取舍是把关键解释保留为普通正文，在对照写法或观察变化明显有帮助的地方使用交互组件。

## 观察修改、生成与发布的区别 {#worked-example}

下面是原理演示。编辑预览、生成的版本和读者版本分别保存，便于看出修改什么时候生效；它不会构建或上传真实站点。

<DocsJourney variant="workbench" />

需要实际验证时，可[下载最小 Markdown 站点模板](pathname:///docs/publishing-starter.zip)，按 README 安装依赖并构建。它使用 Docusaurus 3.9.2，包含中英文说明和练习资源，不包含本站全部交互组件。

发布前至少检查主要入口、图片、下载包和语言切换，再检查实际托管地址。第一次发布可以先让少量读者试用，根据他们遇到的问题调整。

接下来：[返回标记语言练习](../markup/index.mdx?exercise=intro)，或使用[作者自查清单](../information-design/index.mdx#scorecard)。
