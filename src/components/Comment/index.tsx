import { useEffect, useState } from 'react'
import BrowserOnly from '@docusaurus/BrowserOnly'
import type { ThemeConfig } from '@docusaurus/preset-classic'
import { useColorMode, useThemeConfig } from '@docusaurus/theme-common'
import { useTitleFormatter } from '@docusaurus/theme-common/internal'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Giscus, { type GiscusProps, type Theme } from '@giscus/react'
import social from '@site/data/social'
import styles from './styles.module.css'

export type GiscusConfig = GiscusProps & { darkTheme: Theme }

const defaultConfig: Partial<GiscusProps> & { darkTheme: string } = {
  id: 'comments',
  mapping: 'title',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'top',
  lang: 'zh-CN',
  theme: 'light',
  darkTheme: 'dark_dimmed',
}

export default function Comment({ title, description }: { title?: string, description?: string }): React.JSX.Element {
  const themeConfig = useThemeConfig() as ThemeConfig & { giscus: GiscusConfig }
  const { i18n } = useDocusaurusContext()

  const giscus = { ...defaultConfig, ...themeConfig.giscus }
  const formattedTitle = useTitleFormatter().format(title ?? '')
  // Keep existing title-based discussions, without reading a stale document.title
  // while the router and page metadata are updating after article navigation.
  if (title && giscus.mapping === 'title') {
    giscus.mapping = 'specific'
    giscus.term = formattedTitle
  }

  const [readyTitle, setReadyTitle] = useState<string | null>(null)
  useEffect(() => {
    if (!title) return undefined
    // Giscus also reads the description from <head>. Wait for the current page's
    // metadata before mounting it, so a new discussion cannot inherit the old summary.
    const ready = () => {
      const currentDescription = document.querySelector('meta[property="og:description"], meta[name="description"]')?.getAttribute('content')
      if (document.title !== formattedTitle || (description && currentDescription !== description)) return false
      setReadyTitle(formattedTitle)
      return true
    }
    const observer = new MutationObserver(() => {
      if (ready()) observer.disconnect()
    })
    if (!ready()) observer.observe(document.head, { subtree: true, childList: true, attributes: true, characterData: true })
    return () => observer.disconnect()
  }, [title, description, formattedTitle])

  if (!giscus.repo || !giscus.repoId || !giscus.categoryId) {
    throw new Error('You must provide `repo`, `repoId`, and `categoryId` to `themeConfig.giscus`.')
  }

  giscus.theme = useColorMode().colorMode === 'dark' ? giscus.darkTheme : giscus.theme
  giscus.lang = i18n.currentLocale === 'zh-Hans' ? 'zh-CN' : i18n.currentLocale

  const en = i18n.currentLocale === 'en'
  return (
    <div className={styles.comments}>
      <BrowserOnly fallback={<p role="status">{en ? 'Loading comments…' : '正在加载评论……'}</p>}>
        {() => !title || readyTitle === formattedTitle
          ? <Giscus key={title ? formattedTitle : undefined} {...giscus} />
          : <p role="status">{en ? 'Loading comments…' : '正在加载评论……'}</p>}
      </BrowserOnly>
      <p className={styles.help}>
        {en ? 'Comments use GitHub sign-in. You can also ' : '留言需要登录 GitHub，也可以'}
        <a className="site-link site-inline-link" href={social.email.href}>{en ? 'contact me by email' : '通过邮件联系我'}</a>
        {en ? '.' : '。'}
      </p>
    </div>
  )
}
