import type { Locale, Syntax } from './course'

export const spanExamples = {
  zh: {
    heading: '备份与维护安排',
    columns: ['备份类型', '方式', '说明'],
    category: '物理备份', standard: '全量冷备', standardNote: '停机直接拷贝数据文件',
    quick: '增量热备', quickNote: '基于 Redo Log 持续追加', noteLabel: '通用规范',
    note: '备份文件必须离线归档，定期演练恢复。',
  },
  en: {
    heading: 'Backup and maintenance plan',
    columns: ['Category', 'Method', 'Description'],
    category: 'Physical backup', standard: 'Cold backup', standardNote: 'Direct data directory snapshot',
    quick: 'Hot backup', quickNote: 'Continuous redo log tracking', noteLabel: 'General policy',
    note: 'Archive backups off-site and verify recovery regularly.',
  },
}
export function spanSource(locale: Locale, syntax: Syntax, merged = true) {
  const e = spanExamples[locale]
  if (syntax === 'markdown') {
    return [
      '## ' + e.heading, '',
      '<table>',
      '  <thead><tr>' + e.columns.map(c => '<th>' + c + '</th>').join('') + '</tr></thead>',
      '  <tbody>',
      '    <tr><td' + (merged ? ' rowspan="2"' : '') + '>' + e.category + '</td><td>' + e.standard + '</td><td>' + e.standardNote + '</td></tr>',
      '    <tr>' + (merged ? '' : '<td>' + e.category + '</td>') + '<td>' + e.quick + '</td><td>' + e.quickNote + '</td></tr>',
      '    <tr><td>' + e.noteLabel + '</td><td' + (merged ? ' colspan="2"' : '') + '>' + e.note + '</td>' + (merged ? '' : '<td></td>') + '</tr>',
      '  </tbody>',
      '</table>',
    ].join('\n')
  }
  return [
    '== ' + e.heading, '', '[cols="1,1,2",options="header"]', '|===',
    '|' + e.columns.join(' |'), '',
    (merged ? '.2+|' : '|') + e.category + ' |' + e.standard + ' |' + e.standardNote,
    (merged ? '' : '|' + e.category + ' ') + '|' + e.quick + ' |' + e.quickNote, '',
    '|' + e.noteLabel + (merged ? ' 2+|' : ' |') + e.note + (merged ? '' : ' |'),
    '|===',
  ].join('\n')
}
// Appending an optional section never replaces the learner's existing writing.
export function appendSpanSource(source: string, locale: Locale, syntax: Syntax) {
  const heading = (syntax === 'markdown' ? '## ' : '== ') + spanExamples[locale].heading
  if (source.split('\n').some(line => line.trim() === heading)) return source
  return source.trimEnd() + '\n\n' + spanSource(locale, syntax, false)
}
