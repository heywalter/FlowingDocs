// Locate a section inside the one shared source file without changing its content.
export function sectionRange(source: string, heading: string, first = false) {
  const lines = source.split('\n')
  let fence = ''
  const headings: { line: number, title: string }[] = []
  lines.forEach((line, index) => {
    const marker = line.match(/^\s*(`{3,}|~{3,}|-{4,}|\.{4,})/)
    if (marker) {
      if (!fence) fence = marker[1]![0]!
      else if (marker[1]![0] === fence) fence = ''
      return
    }
    if (fence) return
    const title = line.replace(/^(?:#{1,2}|={1,2})\s+/, '').trim()
    if (/^(?:#{1,2}|={1,2})\s+/.test(line) || title === heading) headings.push({ line: index, title })
  })
  const match = headings.find(item => item.title === heading)
  const firstLine = first ? 0 : match?.line ?? 0
  const endLine = headings.find(item => item.line > (match?.line ?? firstLine))?.line ?? lines.length
  const start = lines.slice(0, firstLine).reduce((sum, line) => sum + line.length + 1, 0)
  return { start, firstLine, endLine, found: !!match }
}
