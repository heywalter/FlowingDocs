import { useEffect, useRef, useState } from 'react'
import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons'
import Icon from '@site/src/components/Icon'
import styles from './HeroScene.module.css'

export default function HeroScene({ en }: { en: boolean }) {
  const stage = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [visible, setVisible] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const prefix = en ? '/en' : ''
  const photo = useBaseUrl('/img/home/window-desk.webp')
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReduced(preference.matches)
    const updateVisibility = () => setPageVisible(document.visibilityState === 'visible')
    updatePreference()
    updateVisibility()
    setReady(true)
    preference.addEventListener('change', updatePreference)
    document.addEventListener('visibilitychange', updateVisibility)
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => setVisible(Boolean(entry?.isIntersecting)))
      : undefined
    if (stage.current) observer?.observe(stage.current)
    return () => {
      preference.removeEventListener('change', updatePreference)
      document.removeEventListener('visibilitychange', updateVisibility)
      observer?.disconnect()
    }
  }, [])
  const tools = [
    { id: 'markdown', icon: 'ri:markdown-fill', label: 'Markdown', title: en ? 'Explore Markdown examples' : '查看 Markdown 对照示例', to: `${prefix}/docs/markup/?syntax=markdown&exercise=intro` },
    { id: 'asciidoc', icon: 'logos:asciidoctor', label: 'AsciiDoc', title: en ? 'Explore AsciiDoc examples' : '查看 AsciiDoc 对照示例', to: `${prefix}/docs/markup/?syntax=asciidoc&exercise=intro` },
    { id: 'ai', icon: 'simple-icons:openai', label: 'AI', title: en ? 'Read about AI tools' : '阅读 AI 工具相关文章', to: `${prefix}/blog/tags/ai/` },
    { id: 'cycling', icon: 'ri:bike-fill', label: en ? 'Cycling' : '骑行', title: en ? 'A little about life outside work' : '了解工作之外的我', to: `${prefix}/about/#life-title` },
    { id: 'docusaurus', icon: 'logos:docusaurus', label: 'Docusaurus', title: en ? 'How I built this site' : '这个网站的搭建记录', to: `${prefix}/blog/building-a-docusaurus-blog/` },
    { id: 'hosting', icon: 'ri:terminal-box-fill', label: en ? 'Self-hosting' : '自托管', title: en ? 'Read about my home private cloud' : '阅读家用私有云实践', to: `${prefix}/blog/nextcloud-self-hosted-cloud-storage/` },
  ]
  return (
    <div ref={stage} className={styles.scene} data-playing={ready && !paused && !reduced && visible && pageVisible}>
      <div className={styles.orbit} aria-hidden="true" />
      <div className={styles.photoFrame} aria-hidden="true">
        <img src={photo} width="1200" height="900" alt="" fetchPriority="high" />
      </div>
      <nav className={styles.tools} aria-label={en ? 'Tools and interests' : '工具与兴趣'}>
        {tools.map(tool => (
          <Link key={tool.id} to={tool.to} title={tool.title} aria-label={`${tool.label} · ${tool.title}`} className={`${styles.tool} ${styles[tool.id]}`}>
            <span className={styles.token}>
              <span className={styles.icon}><Icon icon={tool.icon} width="32" height="32" /></span>
              <span>{tool.label}</span>
            </span>
          </Link>
        ))}
      </nav>
      <div className={styles.caption}>
        <span>{en ? 'Tools & interests' : '一些工具与兴趣'}</span>
        <button
          type="button"
          disabled={!ready || reduced}
          aria-label={reduced ? (en ? 'Motion disabled by your system preference' : '已遵循系统减少动态效果设置') : paused ? (en ? 'Resume floating icons' : '继续图标动效') : (en ? 'Pause floating icons' : '暂停图标动效')}
          onClick={() => setPaused(value => !value)}
        >
          {paused || reduced ? <PlayIcon aria-hidden="true" /> : <PauseIcon aria-hidden="true" />}
          <span>{reduced ? (en ? 'Motion off' : '动效已关闭') : paused ? (en ? 'Resume' : '继续') : (en ? 'Pause' : '暂停')}</span>
        </button>
      </div>
    </div>
  )
}
