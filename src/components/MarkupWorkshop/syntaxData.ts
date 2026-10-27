import type { Locale } from './course'
import type { Format } from './workbook'

type Reference = { rows: [string, string][], pitfall: string, more?: string, example?: string }

export function syntaxReference(locale: Locale, format: Format, lesson: string) {
  const t = (zh: string, en: string) => locale === 'zh' ? zh : en
  const title = t('标题', 'Title')
  const section = t('小节', 'Section')
  const first = t('第一项', 'First item')
  const second = t('第二项', 'Second item')
  const text = t('文字', 'Text')
  const group = t('分类', 'Group')
  const item = t('一项内容', 'An item')
  const label = t('名称', 'Name')
  const value = t('值', 'Value')
  const md: Record<string, Reference> = {
    'headings': { rows: [['# ' + title, t('文档标题', 'Document title')], ['## ' + section, t('小节标题', 'Section heading')]], pitfall: t('# 后留空格；段落之间留一个空行。', 'Leave a space after # and a blank line between paragraphs.') },
    'bullets': { rows: [['- ' + first + '\n- ' + second, t('每项独占一行，不编号', 'One item per line, without numbering')]], pitfall: t('- 后留空格，列表前与正文空一行。', 'Leave a space after - and a blank line before the list.') },
    'ordered': { rows: [['1. ' + first + '\n2. ' + second, t('按顺序编号', 'A numbered sequence')]], pitfall: t('英文句点后需要空格，否则可能仍是普通段落。', 'The period needs a following space, or this may remain plain text.') },
    'nested': { rows: [['- ' + group + '\n  - ' + item, t('子项缩进到父项文字的位置', 'Indent the child to the start of the parent text')]], pitfall: t('本例子项前有两个空格；与父项顶格对齐会变成同一层。', 'This example uses two leading spaces. Aligning the markers makes them siblings.') },
    'emphasis': { rows: [['**' + text + '**', t('加粗', 'Bold')], ['*' + text + '*', t('斜体', 'Italic')]], pitfall: t('标记贴着文字写，不要写成 ** 文字 **。', 'Keep the markers next to the text: **text**, not ** text **.') },
    'media': { rows: [['![' + t('图片说明', 'Image description') + '](image.png)', t('图片与替代文字', 'Image and alternative text')], ['[' + t('链接文字', 'Link text') + '](https://example.com)', t('可点击的链接', 'Clickable link')]], pitfall: t('图片比链接多一个 !；练习中请使用素材提供的图片路径。', 'Images have an extra !. Use the supplied image path in the exercise.') },
    'table': { rows: [['| ' + label + ' | ' + value + ' |\n| --- | --- |\n| A | 1 |', t('表头、分隔行、数据行', 'Header, delimiter, data row')]], pitfall: t('分隔行不能省略。这是 GFM 扩展，管道表格不能合并单元格。', 'The delimiter row is required. This is a GFM extension; pipe tables cannot merge cells.') },
    'table-spans': {
      rows: [['<td rowspan="2">' + group + '</td>', t('跨两行', 'Span two rows')], ['<td colspan="2">' + text + '</td>', t('跨两列', 'Span two columns')]],
      pitfall: t('这是内嵌 HTML，不是 Markdown 原生合并语法；合并后必须删掉被占用的单元格。', 'This is embedded HTML, not native Markdown span syntax. Remove cells displaced by the span.'),
      more: t('这些 td 片段要放在 table 的 tr 内。发布平台可能限制 HTML；本课支持表格及其中的基础 HTML，单元格内不混写 Markdown。', 'Place these td fragments inside table rows (tr). Platforms may restrict HTML. This course supports basic table HTML; do not mix Markdown inside the cells.'),
      example: '<table>\n  <tr><th>' + label + '</th><th>' + value + '</th></tr>\n  <tr><td rowspan="2">' + group + '</td><td>A</td></tr>\n  <tr><td>B</td></tr>\n  <tr><td colspan="2">' + text + '</td></tr>\n</table>',
    },
    'literal': { rows: [['`' + text + '`', t('行内等宽文字', 'Inline code')], ['```text\n' + text + '\n```', t('保留换行的文本块', 'A text block that preserves line breaks')]], pitfall: t('使用英文反引号 `，不是单引号；围栏各占一行。', 'Use backticks, not apostrophes. Put each fence on its own line.') },
    'xref': { rows: [['[' + t('阅读这里', 'Read here') + '](#' + (locale === 'zh' ? '小节' : 'section') + ')', t('链接到同一文档的标题', 'Link to a heading in this document')]], pitfall: t('锚点必须存在。不同平台生成标题锚点的规则可能不同。', 'The target anchor must exist. Heading-ID rules can differ between platforms.') },
    'note': { rows: [['> **' + t('提醒', 'Note') + '**: ' + text, t('引用块中加一个醒目标题', 'A blockquote with a bold label')]], pitfall: t('> 放在行首；这是引用块，提醒标题和颜色不代表通用的警告等级。', 'Put > at the start of the line. A blockquote label and color do not define a standard warning level.') },
    'checklist': { rows: [['- [ ] ' + item, t('未完成', 'Unchecked')], ['- [x] ' + item, t('已完成', 'Checked')]], pitfall: t('方括号内外的空格要保留；这是 GFM 扩展。', 'Keep the spaces around the brackets. Task lists are a GFM extension.') },
    'escape': { rows: [['\\*' + text + '\\*', t('显示星号，不加斜体', 'Show literal asterisks instead of italics')], ['\\|', t('管道表格单元格中的竖线', 'A literal pipe inside a pipe-table cell')]], pitfall: t('反斜杠紧挨需要转义的标点，预览中不显示反斜杠。', 'Place the backslash directly before the punctuation; the backslash disappears in the preview.') },
  }
  const adoc: Record<string, Reference> = {
    'headings': { rows: [['= ' + title, t('文档标题', 'Document title')], ['== ' + section, t('一级小节', 'First-level section')]], pitfall: t('等号后留空格，标题与正文之间空一行。', 'Leave a space after the equals signs and a blank line before the body.') },
    'bullets': { rows: [['* ' + first + '\n* ' + second, t('无序列表，每项一行', 'Unordered list, one item per line')]], pitfall: t('星号后需要空格；列表前与正文空一行。', 'A space must follow the asterisk. Leave a blank line before the list.') },
    'ordered': { rows: [['. ' + first + '\n. ' + second, t('处理器自动生成编号', 'The processor generates the numbers')]], pitfall: t('使用英文句点加空格，不需要手动写 1、2、3。', 'Use a period followed by a space; the numbers are automatic.') },
    'nested': { rows: [['* ' + group + '\n** ' + item, t('星号数量表示列表层级', 'The number of asterisks sets the level')]], pitfall: t('第二层用两个星号；这里的 ** 不是加粗。', 'Use two asterisks for the second level. Here ** is not bold markup.') },
    'emphasis': { rows: [['*' + text + '*', t('加粗', 'Bold')], ['_' + text + '_', t('斜体', 'Italic')]], pitfall: t('标记要成对。本课示例在整组标记两侧留空格，避免与相邻文字粘连。', 'Use paired markers. Keep spaces around the marked phrase in these examples to avoid adjacent-word boundaries.') },
    'media': { rows: [['image::image.png[' + t('图片说明', 'Image description') + ']', t('块级图片', 'Block image')], ['link:https://example.com[' + t('链接文字', 'Link text') + ']', t('链接', 'Link')]], pitfall: t('块级图片用两个冒号 image::，并独占一行。', 'Block images use two colons (image::) and occupy their own line.') },
    'table': { rows: [['[cols="1,1",options="header"]', t('两列，第一行为表头', 'Two columns, with a header row')], ['|===', t('表格起止标记，各占一行', 'Opening and closing delimiters, on separate lines')], ['|' + label + ' |' + value, t('每个单元格以 | 开头', 'Each cell starts with |')]], pitfall: t('表头与数据之间空一行；结尾不要漏掉 |===。', 'Leave a blank line after the header and close the table with |===.'), example: '[cols="1,1",options="header"]\n|===\n|' + label + ' |' + value + '\n\n|A |1\n|===' },
    'table-spans': {
      rows: [['.2+|' + group, t('跨两行（前置点 .2+|）', 'Span two rows (leading dot: .2+|)')], ['2+|' + text, t('跨两列（无前置点 2+|）', 'Span two columns (no leading dot: 2+|)')]],
      pitfall: t('句点代表跨行（.2+|），无句点代表跨列（2+|）。合并标记直接替代竖线，不要写成 | .2+|；并务必删掉被跨越覆盖的单元格。', 'Leading dot spans rows (.2+|); no dot spans columns (2+|). The specifier replaces the pipe (never write | .2+|). Remove any displaced cells.'),
      more: t('这是 AsciiDoc 原生表格语法。在单行书写多个单元格时，跨列单元格前保留一个空格（如 |分类 2+|说明）。', 'These are native AsciiDoc cell specifiers. When inlining multiple cells on one line, precede the span specifier with a space (e.g. |Group 2+|Text).'),
      example: '[cols="1,1,2",options="header"]\n|===\n|' + label + ' |' + first + ' |' + second + '\n\n.2+|' + group + ' |A |说明1\n|B |说明2\n\n|' + label + ' 2+|' + text + '\n|===',
    },
    'literal': { rows: [['`' + text + '`', t('行内等宽文字', 'Inline monospace')], ['....\n' + text + '\n....', t('保留换行与空格', 'Preserve line breaks and spaces')]], pitfall: t('上下两行都是四个英文句点，不是省略号。', 'Each delimiter is four periods, not an ellipsis.') },
    'xref': { rows: [['[[example]]', t('放在目标小节标题之前', 'Place before the target heading')], ['<<example,' + t('阅读这里', 'Read here') + '>>', t('引用该锚点', 'Reference that anchor')]], pitfall: t('两处的锚点名称必须相同；引用显示文字可以不同。', 'The anchor names must match; the displayed link text may differ.') },
    'note': { rows: [['NOTE: ' + text, t('单段提示块', 'A single-paragraph note')]], pitfall: t('NOTE 大写，使用英文冒号并留空格；提示前后空一行。', 'Use uppercase NOTE, a colon and a space. Separate the note from surrounding paragraphs with blank lines.') },
    'checklist': { rows: [['* [ ] ' + item, t('未完成', 'Unchecked')], ['* [x] ' + item, t('已完成', 'Checked')]], pitfall: t('保留方括号内外的空格；本课在源码中修改勾选状态。', 'Keep the spaces around the brackets. Change the checked state in the source.') },
    'escape': { rows: [['\\*' + text + '*', t('阻止成对星号变成加粗', 'Keep the paired asterisks literal')]], pitfall: t('本例在开头标记前加反斜杠；AsciiDoc 与 Markdown 的转义细节不同。', 'This example escapes the opening marker. AsciiDoc escaping differs from Markdown.') },
  }
  const dita: Record<string, Reference> = {
    concept: { rows: [['<concept id="example">', t('概念主题的根元素', 'Root of a concept topic')], ['<conbody><p>' + text + '</p></conbody>', t('解释性正文，放在 title 之后', 'Explanatory body, after title')]], pitfall: t('每个开始标签都要闭合；concept 结束时写 </concept>。', 'Close every opening tag, including </concept> at the end.'), more: t('concept 用于解释，task 用于步骤，reference 用于查阅信息。这里展示的是结构片段，完整主题还需要 title。', 'Use concept for explanations, task for steps and reference for lookup information. These are structural fragments; a full topic also needs a title.') },
    task: { rows: [['<steps>\n  <step><cmd>' + t('执行操作。', 'Perform an action.') + '</cmd></step>\n</steps>', t('操作列表，放在 taskbody 内', 'Instruction list, inside taskbody')]], pitfall: t('每个 step 都需要 cmd；一次操作写一个步骤。', 'Each step needs a cmd. Write one action per step.'), more: t('task 主题依次包含 title、taskbody；steps 位于 taskbody 内。浏览器只检查本课用到的基本结构。', 'A task contains title followed by taskbody. Place steps inside taskbody. Browser checks cover only the basic structures used here.') },
    reference: { rows: [['<sthead><stentry>' + label + '</stentry></sthead>', t('simpletable 的表头行', 'Header row of a simpletable')], ['<strow><stentry>A</stentry></strow>', t('simpletable 的数据行', 'Data row of a simpletable')]], pitfall: t('每行的 stentry 数量应一致；simpletable 不支持合并单元格。', 'Keep the number of stentry elements consistent. simpletable does not support cell spans.'), more: t('这些行放在 simpletable 内，再放入 reference 的 refbody。复杂合并表格需要 DITA 的 table（CALS）结构，未包含在本课预览中。', 'Place these rows inside simpletable, within a reference topic’s refbody. Complex spans use DITA table (CALS), which this preview does not cover.') },
    map: { rows: [['<map>\n  <title>' + t('运维手册', 'Operations guide') + '</title>\n  <topicref href="start-service.dita"/>\n</map>', t('用文件路径引用主题', 'Reference a topic by its file path')]], pitfall: t('href 必须指向现有主题；交换 topicref 的位置可改变本课手册顺序。', 'href must resolve to an existing topic. Reorder topicref elements to change this guide’s sequence.') },
    reuse: { rows: [['<topicref href="start-service.dita"/>', t('在两份 map 中引用同一主题', 'Reference the same topic from two maps')]], pitfall: t('两份 map 引用同一个文件，不要复制出两份主题再分别修改。', 'Both maps reference the same file; do not make two separate copies.'), more: t('本节练习整篇主题复用。DITA 还支持片段级复用（如 conref），这里不展开。', 'This lesson reuses a whole topic. DITA also supports fragment reuse, such as conref, which is outside this exercise.') },
    oxygen: { rows: [['guide.ditamap', t('在 DITA Maps Manager 中打开的入口', 'Open this entry point in DITA Maps Manager')], ['start-service.dita', t('在 Author 视图中编辑的主题', 'A topic to edit in Author mode')]], pitfall: t('浏览器预览通过不代表完整 DITA 校验通过；在 Oxygen 中校验后再发布。', 'A passing browser check is not full DITA validation. Validate in Oxygen before publishing.') },
  }
  const reference = (format === 'markdown' ? md : format === 'asciidoc' ? adoc : dita)[lesson]
  if (!reference) return undefined
  const source = format === 'dita' ? 'https://docs.oasis-open.org/dita/dita/v1.3/os/part0-overview/dita-v1.3-os-part0-overview.html' : format === 'asciidoc' ? 'https://docs.asciidoctor.org/asciidoc/latest/syntax-quick-reference/' : ['table', 'table-spans', 'checklist'].includes(lesson) ? 'https://github.github.com/gfm/' : 'https://commonmark.org/help/'
  return { ...reference, source }
}
