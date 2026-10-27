---
slug: /
title: Technical Documentation Practices
sidebar_label: Overview
sidebar_position: 1
hide_table_of_contents: true
hide_title: true
description: "Practical problems, approaches and limits in markup, information design and publishing."
image: /img/flowingdocs.png
tags:
  - technical-writing
  - information-design
  - documentation-engineering
  - docs-as-code
---

import DocsJourney from '@site/src/components/DocsJourney';

<DocsJourney locale="en" />

These notes collect practical documentation problems, approaches and tradeoffs for technical writers and developers who write product guides, API documentation or procedures. Start with the problem you have; there is no required course order.

## Document markup {#start-here}

Merged table cells, a notice shared by two guides, or different manuals assembled from the same content can all affect your choice of format.

- [Compare common notation](./markup/index.mdx?exercise=intro): headings, lists, code, images and notices.
- [Ordinary and merged tables](./markup/index.mdx?syntax=asciidoc&exercise=table-spans): embedded HTML in Markdown versus native AsciiDoc notation.
- [Change once, reuse in several places](./markup/index.mdx?syntax=asciidoc&view=reuse): includes, variables and tool-specific limitations.
- [Organize guides with DITA](./markup/index.mdx?syntax=dita&exercise=intro): topics, maps and reuse, with an exportable project.

Exercises use MySQL scenarios to compare document structure. They are not complete database installation or production-change procedures.

## Information design {#information-design}

What is missing from “Timeout, default 30”? When are tabs helpful, and when should readers see both options together?

Start with [making documentation clear and useful](./information-design/index.mdx). For a specific document, see:

- [Concepts](./information-design/concept.md): what something is, why it works and where the explanation applies.
- [Procedures](./information-design/task.md): prerequisites, actions and a way to confirm success.
- [Reference](./information-design/reference.md): units, ranges, special values and when changes take effect.

## Publishing {#publishing}

[Choose a static site generator](./publishing/index.md): compare Docusaurus, VitePress, MkDocs and Antora, using this site's bilingual content, blog and interactive components to explain maintenance costs. The page includes a build/publish simulation and a minimal site template.

## When does this workflow help? {#paradigm-shift}

Docs-as-Code applies version control, CI checks, and peer reviews to documentation. Content is written in plain text and compiled through a generator—either alongside product code or in a dedicated repository.

This workflow helps when documentation follows product versions, needs automated link checks, or involves several reviewers. The team also needs to maintain build dependencies and deployment configuration, and handle branch merges.

Word and online collaboration tools also offer version history, tracked changes, and templates. Whether contributors are comfortable with Git—and whether existing workflows already solve the team's problems—often matters more than the format itself. If current tools meet the team's needs, keeping them is also a reasonable choice. AI can draft and proofread, but technical claims still need verification against product behavior, source code, or test results.

## Future notes {#maintenance}

This first edition focuses on the three topics above. API consistency, AI collaboration, reader feedback, traffic paths and stale-content maintenance will follow when there are concrete cases to discuss. The [review checklist and automated-check example](./information-design/index.mdx#scorecard) are available now.

<span id="optional-topics"></span>
<span id="lifecycle"></span>

## Corrections and discussion {#feedback}

[Open an issue or PR](https://github.com/heywalter/flowingdocs), or [leave a message on the About page](/en/about). Include the page URL, specific text, environment and expected result to help reproduce the problem.
