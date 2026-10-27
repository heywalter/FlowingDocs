// Completion receipts identify the exact files checked, never just a visited lesson.
export const ditaExercises = ['concept', 'task', 'reference', 'map', 'reuse']
export function ditaFile(lesson: string) {
  return lesson === 'task' || lesson === 'reuse' ? 'start-service.dita' : lesson === 'reference' ? 'parameters.dita' : lesson === 'map' ? 'guide.ditamap' : 'engines.dita'
}
export function ditaFingerprint(files: Record<string, string>, lesson: string) {
  const names = lesson === 'reuse' ? ['start-service.dita', 'guide.ditamap', 'quickstart.ditamap'] : [ditaFile(lesson)]
  // Compact deterministic checksum; this is draft invalidation, not a security boundary.
  let hash = 2166136261
  for (const char of JSON.stringify(names.map(name => files[name] || ''))) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619)
  return 'v1:' + (hash >>> 0).toString(16)
}
export function ditaPassed(files: Record<string, string>, receipts: Record<string, string> | undefined, lesson: string) {
  return ditaExercises.includes(lesson) && receipts?.[lesson] === ditaFingerprint(files, lesson)
}
export function reorderedTopics(current: string[], original: string[]) {
  return current.length === original.length && new Set(current).size === original.length && original.every(id => current.includes(id)) && current.some((id, i) => id !== original[i])
}
export function changedText(current: string[], original: string[]) {
  const normalize = (items: string[]) => items.map(s => s.replace(/\s+/g, ' ').trim())
  return current.length > 0 && current.every(s => s.trim()) && JSON.stringify(normalize(current)) !== JSON.stringify(normalize(original))
}
