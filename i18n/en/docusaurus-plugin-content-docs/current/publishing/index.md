---
title: "Documentation Publishing: Choosing the Right Static Tooling"
sidebar_label: Documentation Publishing
sidebar_position: 4
description: "Compare publishing tools and understand content, navigation, themes and maintenance costs."
keywords:
  - Static Site Generators
  - SSG
  - Docusaurus
  - VitePress
  - MkDocs
  - Antora
  - Documentation Engineering
  - Bilingual Publishing
  - Technical Writing
image: /img/flowingdocs.png
tags:
  - static-sites
  - tooling-tradeoffs
  - docusaurus
  - architecture
---

import PublishingFlow from '@site/src/components/PublishingFlow';
import DocsJourney from '@site/src/components/DocsJourney';

When choosing a publishing tool, I first check whether it can use the existing files and who will maintain the build, theme and extensions. Appearance matters, but does not answer those questions.

This page compares common generators and uses this site to explain customization costs. It is a selection note, not a requirement to build the same website.

## Generator and host responsibilities {#how-it-works}

A static site generator reads content, navigation configuration and themes at build time, producing HTML, CSS, JavaScript and other files. A host provides an address and serves those files to browsers.

<PublishingFlow locale="en" />

Static pages can still be interactive: this site's exercises run JavaScript in the browser. Static generation does not imply incremental builds; support depends on the tool and configuration.

## Start with content and maintenance capacity {#choose-tools}

These are judgments based on common needs, not performance rankings. Verify features against the versions, themes and plugins you intend to use.

| Tool | When to consider it | Maintenance work |
| --- | --- | --- |
| [Docusaurus](https://docusaurus.io/docs/3.9.2) | Markdown/MDX, shared blog and docs, React components | Maintain a Node.js project and check custom themes/components during upgrades |
| [VitePress](https://vitepress.dev/guide/what-is-vitepress) | Primarily Markdown docs and a team familiar with Vue | Organize extra sections such as a blog and maintain embedded Vue components |
| [MkDocs](https://www.mkdocs.org/user-guide/writing-your-docs/) | Markdown content, Python familiarity, existing themes/plugins | Check compatibility and maintain required customizations |
| [Antora](https://docs.antora.org/antora/latest/component-version/) | Existing AsciiDoc spread across repositories and product versions | Organize components, versions and modules; maintain the UI and publishing setup |

For a large AsciiDoc collection, evaluate compatible tools before converting it. DITA requires considering editing, content management and publishing tools such as [DITA-OT](https://www.dita-ot.org/dev/topics/output-formats), beyond website themes.

[Docusaurus versioning](https://docusaurus.io/docs/3.9.2/versioning) copies current documents and sidebars into versioned directories. It does not automatically create Git branches. Corrections may need to be applied to several retained versions.

## Why this site uses Docusaurus {#site-example}

FlowingDocs combines a blog, documentation, Chinese/English content and interactive examples. Docusaurus fits those needs reasonably well. See the [original blog setup notes](/en/blog/building-a-docusaurus-blog/).

- **Blog and docs have separate organization:** posts follow time and topics; docs follow problems. This site's custom blog plugin needs maintenance during framework upgrades.
- **The framework provides locale routes:** translations, examples and tag URLs still require checks. A successful build does not establish that every language-switch target exists.
- **React components fit into prose:** their state, keyboard support, responsive layout and error recovery still require implementation and testing.

These are this site's reasons, not requirements for every documentation project.

## Extensions affect portability {#rendering-differences}

### Notices depend on the renderer

Docusaurus notation:

```markdown
:::note Version note
This example applies to 2.x.
:::
```

Rendered here:

:::note Version note
This example applies to 2.x.
:::

A CommonMark-only platform needs a conversion for this extension. It will not automatically produce the same notice. Ordinary blockquotes are usually more portable but look different.

### Interactive components need their runtime

```mdx
import MarkupWorkshop from '@site/src/components/MarkupWorkshop';

<MarkupWorkshop />
```

This requires the component, its dependencies and a React/MDX environment. Copying the text alone does not transfer the workshop.

My approach is to keep essential explanations in ordinary prose and use interactions where comparison or visible changes clearly help.

## Compare editing, building and publishing {#worked-example}

This is an illustration. Working, built and reader versions are stored separately to show when changes take effect. It does not build or upload a real site.

<DocsJourney locale="en" variant="workbench" />

To try a real build, [download the minimal Markdown site template](pathname:///docs/publishing-starter.zip) and follow its README. It uses Docusaurus 3.9.2 and includes bilingual instructions and practice assets, without all of this site's interactive components.

Before publishing, check key entry points, images, downloads and language switching, then verify the hosted address. A first release can go to a small set of readers and improve based on the problems they encounter.

Next: [return to markup practice](../markup/index.mdx?exercise=intro), or use the [author review checklist](../information-design/index.mdx#scorecard).
