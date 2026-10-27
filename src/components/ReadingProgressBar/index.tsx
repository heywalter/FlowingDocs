import { type ReactNode, useEffect, useState } from 'react'
import styles from './styles.module.css'

export default function ReadingProgressBar(): ReactNode {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const body = document.querySelector<HTMLElement>('.site-reading [itemprop="articleBody"]')
    if (!body) return undefined
    const article = body.closest('article')
    const header = document.querySelector<HTMLElement>('header.navbar')
    let frame: number | undefined
    let active = true

    function updateProgress() {
      frame = undefined
      if (!active) return
      const rect = body!.getBoundingClientRect()
      const start = Math.max(0, rect.top + window.scrollY - (header?.getBoundingClientRect().height ?? 0))
      const end = rect.bottom + window.scrollY - window.innerHeight
      // Finish when the last line is visible, before comments or pagination.
      const value = end <= start
        ? (rect.bottom <= window.innerHeight ? 1 : 0)
        : (window.scrollY - start) / (end - start)
      setProgress(Math.min(1, Math.max(0, value)))
    }

    function scheduleUpdate() {
      if (active && frame === undefined) frame = requestAnimationFrame(updateProgress)
    }

    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(body)
    if (article) observer.observe(article)
    if (header) observer.observe(header)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    document.fonts?.ready.then(scheduleUpdate)
    updateProgress()
    return () => {
      active = false
      if (frame !== undefined) cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  return <div aria-hidden="true" className={styles.bar} style={{ transform: `scaleX(${progress})` }} />
}
