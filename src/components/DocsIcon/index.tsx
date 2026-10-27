import React from 'react'
import styles from './styles.module.css'

export type IconName =
  | 'zap'
  | 'database'
  | 'globe'
  | 'x'
  | 'check'
  | 'alert'
  | 'shield'
  | 'bulb'
  | 'file'
  | 'folder'
  | 'branch'
  | 'bot'
  | 'send'
  | 'flask'
  | 'tag'
  | 'archive'
  | 'clock'
  | 'star'
  | 'wrench'
  | 'pen'
  | 'monitor'
  | 'columns'
  | 'link'
  | 'gear'
  | 'refresh'
  | 'target'
  | 'clipboard'
  | 'arrow'
  | 'award'
  | 'chart'
  | 'diamond'

// Outline glyphs on a 24px grid, drawn with currentColor so they follow text colour in light and dark themes.
const PATHS: Record<IconName, React.ReactNode> = {
  zap: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
    </>
  ),
  x: <path d="M18 6 6 18M6 6l12 12" />,
  check: <path d="M20 6 9 17l-5-5" />,
  alert: (
    <>
      <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  bulb: (
    <>
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2.3h6c0-1.1.4-1.8 1-2.3A7 7 0 0 0 12 2z" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h8" />
    </>
  ),
  folder: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
  branch: (
    <>
      <circle cx="6" cy="5" r="2" />
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M6 7v10M18 8c0 6-12 3-12 9" />
    </>
  ),
  bot: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M12 4v4M9 13h.01M15 13h.01M9 17h6" />
    </>
  ),
  send: (
    <>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4z" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6M10 3v6L4.5 18.5A1.5 1.5 0 0 0 5.8 21h12.4a1.5 1.5 0 0 0 1.3-2.5L14 9V3" />
      <path d="M7.5 14h9" />
    </>
  ),
  tag: (
    <>
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </>
  ),
  archive: (
    <>
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8M10 12h4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  star: <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />,
  wrench: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  ),
  pen: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
    </>
  ),
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  columns: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M12 3v18" />
    </>
  ),
  link: (
    <>
      <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" />
      <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
      <circle cx="12" cy="12" r="7" />
    </>
  ),
  refresh: (
    <>
      <path d="M21 12a9 9 0 1 1-2.6-6.3" />
      <path d="M21 4v5h-5" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="18" rx="2" />
      <path d="M9 4V3h6v1M9 10h6M9 14h6" />
    </>
  ),
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  award: (
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.2 14 7 22l5-3 5 3-1.2-8" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 16v-5M12 16V8M17 16v-9" />
    </>
  ),
  diamond: (
    <>
      <path d="M6 3h12l4 6-10 12L2 9z" />
      <path d="M2 9h20" />
    </>
  ),
}

type IconProps = {
  name: IconName
  size?: number
  filled?: boolean
  className?: string
}

export function Icon({ name, size = 16, filled = false, className }: IconProps) {
  return (
    <svg
      className={className ? `${styles.icon} ${className}` : styles.icon}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}

// Emoji used as UI decoration in the docs widgets, mapped to the icon that replaces them.
// Typographic marks (➔, ✓, ✔) are plain text and stay as they are.
const EMOJI_ICONS: Array<[string, IconName]> = [
  ['⚡', 'zap'],
  ['💾', 'database'],
  ['🌐', 'globe'],
  ['❌', 'x'],
  ['✅', 'check'],
  ['⚠', 'alert'],
  ['🚨', 'alert'],
  ['🛡', 'shield'],
  ['💡', 'bulb'],
  ['📄', 'file'],
  ['📁', 'folder'],
  ['🔀', 'branch'],
  ['🤖', 'bot'],
  ['🚀', 'send'],
  ['🧪', 'flask'],
  ['🏷', 'tag'],
  ['🗂', 'archive'],
  ['🐢', 'clock'],
  ['⭐', 'star'],
  ['🛠', 'wrench'],
  ['✍', 'pen'],
  ['🖥', 'monitor'],
  ['⚔', 'columns'],
  ['🔗', 'link'],
  ['⚙', 'gear'],
  ['🔄', 'refresh'],
  ['🎯', 'target'],
  ['📋', 'clipboard'],
  ['👉', 'arrow'],
  ['🏆', 'award'],
  ['📊', 'chart'],
  ['💎', 'diamond'],
]

const ICON_BY_EMOJI = new Map(EMOJI_ICONS)
// Matches each mapped emoji, including an optional variation selector (U+FE0F) that follows it.
const EMOJI_PATTERN = new RegExp(`(${EMOJI_ICONS.map(([emoji]) => emoji).join('|')})️?`, 'gu')

/** Renders a label with its mapped emoji replaced by inline SVG icons. Other text is returned unchanged. */
export function renderWithIcons(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = []
  let cursor = 0
  let key = 0
  for (const match of text.matchAll(EMOJI_PATTERN)) {
    const start = match.index ?? 0
    if (start > cursor) nodes.push(text.slice(cursor, start))
    nodes.push(<Icon key={`icon-${key++}`} name={ICON_BY_EMOJI.get(match[1] ?? '') ?? 'alert'} />)
    cursor = start + match[0].length
  }
  if (nodes.length === 0) return text
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return <>{nodes}</>
}

export default Icon
