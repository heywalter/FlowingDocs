---
title: "Reference: facts readers need to look up"
sidebar_label: Reference Topics
sidebar_position: 4
description: "Compare units, ranges, special values and timing using fictional parameters."
image: /img/flowingdocs.png
tags:
  - information-design
  - reference-topics
  - parameter-contracts
  - data-dictionaries
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ReferenceTableSandbox from '@site/src/components/InformationDesign/ReferenceTableSandbox';

Reference documentation answers specific questions: what unit does a value use, can it be zero, and who is affected by a change? This page uses parameter entries to show what to verify and how to make it easy to find.

## Make each entry understandable on its own {#definition}

Readers may arrive directly from search. Keep the parameter name, definition, supported version and important limits nearby. Do not require them to read the whole manual to discover a unit.

## Check facts using reader questions {#zero-ambiguity}

| Question | Facts to verify |
| --- | --- |
| What does it control? | Object, trigger and start/end of measurement |
| How is the value written? | Type, unit and range |
| What do zero, negative or empty values mean? | Whether special values are allowed and their meaning |
| Who is affected? | Global, session or other scope, including inheritance |
| When does it apply? | Update method, restart requirements and in-flight operations |
| Is the default a recommendation? | Version-specific default; separate recommendations with conditions |
| What happens to invalid input? | Error, rejection, truncation or adjustment |
| How can it be checked? | Current-value or operation-status verification |

Mark irrelevant fields as not applicable. Verify unknown behavior with engineering, version-specific documentation or tests instead of filling gaps with guesses.

## Compare two descriptions {#sandbox}

These parameters belong to a **fictional service**. Names, ranges and behavior are teaching assumptions, not MySQL configuration advice.

<ReferenceTableSandbox locale="en" />

## Make tables easy to search {#table-typography}

Names and values are often short while descriptions are long. Allocate width accordingly; there is no universal percentage. Compare options in the [column-width example](./index.mdx#tables).

Labels can highlight scope or restart requirements, but must include text. Link long commands, procedures and troubleshooting to dedicated sections. Preserve full content on narrow screens, using horizontal scrolling within the table.

## A reusable entry structure {#template}

The example continues with the fictional `query_timeout` so readers do not mistake a writing sample for a database setting.

<Tabs>
<TabItem value="preview" label="Reading view" default>

### query_timeout

Limits the execution time of one query, measured from when execution starts.

| Attribute | Description |
| --- | --- |
| Type and unit | Integer, seconds |
| Default | 30 |
| Range | 0–3600 |
| Special value | 0 means no time limit |
| Scope | Current session |
| Effect | Applies to queries started after the change, not queries already running |
| Timeout | The query stops and returns `QUERY_TIMEOUT` |

**Still to verify:** whether the transaction rolls back, whether the connection remains usable, and how to query the active setting. Until those questions are answered, this would not be a complete real-product reference.

</TabItem>
<TabItem value="source" label="Copy the structure">

````markdown
### Parameter name

Define what it controls and identify the product version.

| Attribute | Verified value or behavior |
| --- | --- |
| Type and unit | … |
| Default and range | … |
| Special values | … |
| Scope | … |
| When it applies | … |
| Error behavior | … |

#### Verification
Provide a command or UI location and the expected result.

#### Recommendations and limits
State the environment and evidence behind recommendations.
List unresolved questions explicitly.
````

</TabItem>
</Tabs>

Real parameters require version-specific evidence. For example, [MySQL 8.0 buffer-pool resizing documentation](https://dev.mysql.com/doc/refman/8.0/en/innodb-buffer-pool-resize.html) explains chunk constraints, stages and monitoring. It does not justify inventing a universal TPS fluctuation percentage or treating a default as a production recommendation.

## Review before publishing {#checklist}

- Do units, types and examples agree?
- Do defaults identify a version and recommendations state their conditions?
- Are session/global, current and persisted values distinguished?
- Are special values, errors and verification methods supported by evidence?
- Have missing facts been verified rather than merely expressed more confidently?

Use the [review checklist](./index.mdx#scorecard) on an existing document, or read about [writing procedures](./task.md).
