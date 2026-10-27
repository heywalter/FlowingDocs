import React, { useEffect, useRef } from 'react'
import { CheckCircledIcon, ArrowRightIcon } from '@radix-ui/react-icons'
import type { Locale } from './course'
import styles from './styles.module.css'

export default function CheckFeedback({ locale, success, checks, attempt, onNext, nextLabel }: {
  locale: Locale
  success: boolean
  checks: { ok: boolean, message: string }[]
  attempt: number
  onNext?: () => void
  nextLabel?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (attempt > 0) ref.current?.scrollIntoView({ block: 'nearest' })
  }, [attempt])
  const tr = (zh: string, en: string) => locale === 'zh' ? zh : en
  return (
    <div key={attempt} ref={ref} role="status" className={success ? styles.checkPassed : styles.checkRetry} data-animate={attempt > 0}>
      {success && <CheckCircledIcon className={styles.checkBadge} aria-hidden="true" />}
      <div>
        <strong>{success ? tr('做到了，这一节通过了！', 'You did it — this lesson passes!') : tr('还差一点，按下面的提示再试试', 'Almost there. Try these changes.')}</strong>
        {success ? <p>{tr('这段的写法符合本节要求。可以继续，也可以留在这里试别的写法。', 'This section meets the lesson requirements. Continue, or stay and try another way to write it.')}</p> : <ul>{checks.filter(c => !c.ok).map(c => <li key={c.message}>{c.message}</li>)}</ul>}
        {success && onNext && (
          <button className={styles.primary} onClick={onNext}>
            {nextLabel || tr('继续下一项', 'Continue')}
            <ArrowRightIcon />
          </button>
        )}
      </div>
    </div>
  )
}
