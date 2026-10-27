import React, { useEffect, useRef } from 'react'
import styles from './styles.module.css'

export default function SourceEditor({ value, focusKey, ready, label, onChange, maxLength = 40000 }: {
  value: string
  focusKey: string
  ready: boolean
  label: string
  onChange: (value: string) => void
  maxLength?: number
}) {
  const editor = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (editor.current) {
      editor.current.scrollTop = 0
      editor.current.scrollLeft = 0
    }
  }, [focusKey])
  return <textarea id="markup-source" className={styles.segmentEditor} ref={editor} aria-label={label} disabled={!ready} value={value} maxLength={maxLength} spellCheck={false} autoCapitalize="off" autoCorrect="off" onChange={event => onChange(event.target.value)} />
}
