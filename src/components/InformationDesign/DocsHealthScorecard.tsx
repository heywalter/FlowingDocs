import React, { useEffect, useId, useRef, useState } from 'react'
import Link from '@docusaurus/Link'
import styles from './ReviewChecklist.module.css'

type Locale = 'zh' | 'en'
type State = 'pending' | 'checked' | 'na'
const questions = [
  ['concept', '读者要理解的问题是否明确？', 'Is the reader’s question clear?', 'concept#definition'],
  ['concept', '原理、图示与术语是否一致？', 'Do the explanation, diagrams and terminology agree?', 'concept#visuals'],
  ['concept', '结论的条件和限制是否写出来？', 'Are conditions and limits stated?', 'concept#resource-boundary'],
  ['task', '版本、权限和工作目录是否够具体？', 'Are versions, permissions and working directories specific?', 'task#anatomy-prerequisites'],
  ['task', '步骤是否按实际任务拆分？', 'Are steps organized around the actual task?', 'task#rule-of-seven'],
  ['task', '验证能否支持承诺的结果？', 'Does verification establish the promised result?', 'task#anatomy-verification'],
  ['reference', '单位、范围和特殊值是否有依据？', 'Are units, ranges and special values verified?', 'reference#zero-ambiguity'],
  ['reference', '作用域与生效方式是否区分？', 'Are scope and timing distinguished?', 'reference#template'],
  ['reference', '默认值与条件性建议是否分开？', 'Are defaults separate from conditional recommendations?', 'reference#checklist'],
  ['publishing', '页面、图片和内部链接是否正常？', 'Do pages, images and internal links resolve?', 'index#ci-gates'],
  ['publishing', '窄屏和键盘操作是否检查过？', 'Have narrow screens and keyboard interactions been checked?', 'index#review'],
  ['publishing', '读者是否知道怎样反馈问题？', 'Can readers report a problem?', 'index#review'],
] as const

export default function DocsHealthScorecard({ locale = 'zh' }: { locale?: Locale }) {
  const tr = (zh: string, en: string) => locale === 'zh' ? zh : en
  const [category, setCategory] = useState('concept')
  const [answers, setAnswers] = useState<Record<string, State>>({})
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')
  const [showPrompt, setShowPrompt] = useState(false)
  const copyRequest = useRef(0)
  const promptId = useId()
  useEffect(() => () => {
    copyRequest.current++
  }, [])
  const groups = [['concept', '概念说明', 'Concept'], ['task', '操作步骤', 'Procedure'], ['reference', '参数参考', 'Reference'], ['publishing', '发布与反馈', 'Publishing']]
  const checked = Object.values(answers).filter(value => value === 'checked').length
  const na = Object.values(answers).filter(value => value === 'na').length

  function buildPrompt() {
    const currentQuestions = questions.filter(([g]) => g === category)
    const items = currentQuestions.map(([_, zh, en], i) => `${i + 1}. ${locale === 'zh' ? zh : en}`).join('\n')
    const promptZh = `你是一位严谨的技术文档工程师与审校专家。请审校以下内容，重点对照以下质量要点排查缺失、模糊或易误导之处：

【检查要点】
${items}
- 警惕“立即生效”、“马上生效”等模糊措辞，确认是否交代了具体作用域与生效时机。
- 对照提供的源码、测试或官方资料核实技术事实；没有依据的内容标记为“待核实”，不要猜测。

【审校要求】
1. 指出缺少关键事实的地方（列出需要向研发/产品核实的问题）。
2. 指出可能误导读者或定义模糊的表述。
3. 给出具体的修改建议与改写示例。

待审校文本：
[请在此粘贴你的技术文档内容]`

    const promptEn = `You are an expert technical writer and documentation reviewer. Please review the following text against these specific quality criteria, pointing out missing facts, ambiguity, or misleading statements:

[Review Criteria]
${items}
- Flag vague phrases like "takes effect immediately" unless the exact scope and timing boundaries are explicitly documented.
- Check technical claims against the provided source code, tests, or official references. Mark claims without evidence as unverified; do not guess.

[Feedback Format]
1. List missing facts and open questions for engineering.
2. Highlight ambiguous or potentially misleading instructions.
3. Provide concrete rewrite suggestions with examples.

Text to review:
[Paste your documentation here]`

    return locale === 'zh' ? promptZh : promptEn
  }

  const promptText = buildPrompt()
  async function copyPrompt() {
    const request = ++copyRequest.current
    setCopyStatus('copying')
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(promptText)
      if (request === copyRequest.current) setCopyStatus('copied')
    }
    catch {
      if (request !== copyRequest.current) return
      setCopyStatus('error')
      setShowPrompt(true)
    }
  }

  function chooseCategory(id: string) {
    copyRequest.current++
    setCategory(id)
    setCopyStatus('idle')
    setShowPrompt(false)
  }

  return (
    <section className={styles.panel} aria-label={tr('作者自查清单', 'Author review checklist')}>
      <div className={styles.heading}>
        <div>
          <h3>{tr('按当前文档选用', 'Choose what fits this document')}</h3>
          <p>{tr('记录已核实的事项，不给文档打分。', 'Record verified items without assigning a quality score.')}</p>
        </div>
        <div className={styles.actions}>
          <button type="button" className={styles.secondary} disabled={copyStatus === 'copying'} onClick={copyPrompt}>
            {copyStatus === 'copying' ? tr('正在复制…', 'Copying…') : tr('复制审校提示词', 'Copy review prompt')}
          </button>
          <button type="button" className={styles.secondary} aria-expanded={showPrompt} aria-controls={promptId} onClick={() => setShowPrompt(value => !value)}>{tr('查看提示词', 'View prompt')}</button>
          <button type="button" className={styles.secondary} onClick={() => setAnswers({})}>{tr('清空记录', 'Clear selections')}</button>
        </div>
      </div>
      <div className={styles.choices} aria-label={tr('选择检查类别', 'Choose a review category')}>
        {groups.map(([id, zh, en]) => <button key={id} type="button" aria-pressed={category === id} onClick={() => chooseCategory(id!)}>{tr(zh!, en!)}</button>)}
      </div>
      <p className={styles.copyStatus} role="status">
        {copyStatus === 'copied' && tr('已复制当前类别的审校提示词。', 'Copied the review prompt for this category.')}
        {copyStatus === 'error' && tr('自动复制失败。请在下方文本框中选中内容，手动复制。', 'Could not copy automatically. Select the text below and copy it manually.')}
      </p>
      <div id={promptId} className={styles.prompt} hidden={!showPrompt}>
        <label htmlFor={`${promptId}-text`}>{tr('当前类别的审校提示词（可手动复制）', 'Review prompt for this category (copy manually)')}</label>
        <textarea id={`${promptId}-text`} readOnly rows={10} value={promptText} onFocus={event => event.currentTarget.select()} />
      </div>
      <ul className={styles.checks}>
        {questions.map(([group, zh, en, path], index) => {
          if (group !== category) return null
          const target = path.replace('index#', '#').replace(/^(concept|task|reference)#/, '$1/#')
          return (
            <li key={index}>
              <div>
                <label htmlFor={`review-${locale}-${index}`}>{tr(zh, en)}</label>
                <Link to={`${locale === 'en' ? '/en' : ''}/docs/information-design/${target}`}>{tr('查看说明', 'Read the guidance')}</Link>
              </div>
              <select id={`review-${locale}-${index}`} value={answers[index] || 'pending'} onChange={event => setAnswers(current => ({ ...current, [index]: event.target.value as State }))}>
                <option value="pending">{tr('待检查', 'To check')}</option>
                <option value="checked">{tr('已确认', 'Verified')}</option>
                <option value="na">{tr('不适用', 'Not applicable')}</option>
              </select>
            </li>
          )
        })}
      </ul>
      <p className={styles.note} role="status">{tr(`已确认 ${checked} 项 · 待检查 ${questions.length - checked - na} 项 · 不适用 ${na} 项。记录仅保留在当前页面。`, `${checked} verified · ${questions.length - checked - na} to check · ${na} not applicable. Selections last for this page visit.`)}</p>
    </section>
  )
}
