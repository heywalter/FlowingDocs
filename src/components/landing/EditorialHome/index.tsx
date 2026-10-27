import HeroScene from './HeroScene'
import { useEffect, useRef } from 'react'
import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { usePluginData } from '@docusaurus/useGlobalData'
import type { BlogPost } from '@docusaurus/plugin-content-blog'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import { resolveThumbnail } from '@site/src/lib/thumbnails'
import styles from './styles.module.css'

const copy = {
  zh: {
    brand: '知流小记', otherBrand: 'Flowing Docs',
    nav: ['文章', '技术写作', '项目', '关于'],
    greeting: '你好，我是 Walter。',
    intro: '记录工作中的经验、工具使用和日常生活。',
    read: '阅读文章', writing: '技术写作', latest: '近期文章', allPosts: '全部文章',
    readMore: '阅读全文', writingIntro: '技术文档编写与维护中的实践笔记。',
    allDocs: '全部内容', projects: '做过的项目', allProjects: '全部项目',
    docs: [
      { title: '标记语言', description: '合并表格、复用内容，看看不同标记语言怎么做。', action: '对照示例' },
      { title: '信息表达', description: '参数怎么解释，步骤怎么写，内容怎么排。', action: '看看例子' },
      { title: '文档发布', description: '从源文件到网页，梳理工具选择和发布过程。', action: '阅读记录' },
    ],
    docSifter: '本地运行的中文技术文档审校工具。',
    flowingDocs: '这个网站的搭建和维护记录。',
    demo: '体验演示', siteStory: '阅读记录', menu: '打开导航', closeMenu: '关闭导航',
    navLabel: '主导航', empty: '还没有发布文章。',
  },
  en: {
    brand: 'Flowing Docs', otherBrand: 'Walter’s notes',
    nav: ['Articles', 'Technical writing', 'Projects', 'About'],
    greeting: 'Hi, I’m Walter.',
    intro: 'Notes on work, tools, and everyday life.',
    read: 'Read articles', writing: 'Technical writing', latest: 'Recent articles', allPosts: 'All articles',
    readMore: 'Read the article', writingIntro: 'Notes from writing and maintaining technical documentation.',
    allDocs: 'All notes', projects: 'Things I’ve built', allProjects: 'All projects',
    docs: [
      { title: 'Markup languages', description: 'Merged tables, reusable content, and how different formats handle them.', action: 'Compare examples' },
      { title: 'Information design', description: 'Explaining parameters, writing steps, and laying out a page.', action: 'See the examples' },
      { title: 'Publishing docs', description: 'From source files to a website: tools, choices, and the publishing process.', action: 'Read the notes' },
    ],
    docSifter: 'A local review tool for Chinese technical documentation.',
    flowingDocs: 'Notes on building and maintaining this website.',
    demo: 'Try the demo', siteStory: 'Read the story', menu: 'Open navigation', closeMenu: 'Close navigation',
    navLabel: 'Main navigation', empty: 'No articles published yet.',
  },
}

function useHomeLocale() {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  const { pathname } = useLocation()
  const otherLocalePath = en ? pathname.replace(/^\/en(?=\/|$)/, '') || '/' : `/en${pathname}`
  return { en, text: copy[en ? 'en' : 'zh'], prefix: en ? '/en' : '', pathname, otherLocalePath }
}

function Arrow() {
  return <ArrowRightIcon aria-hidden="true" className={styles.arrow} />
}

function PostImage({ image, eager = false }: { image: string, eager?: boolean }) {
  const src = useBaseUrl(resolveThumbnail(image))
  const fallback = useBaseUrl(image)
  return (
    <img
      src={src}
      alt=""
      width="640"
      height="360"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={(event) => {
        if (event.currentTarget.src !== fallback) event.currentTarget.src = fallback
      }}
    />
  )
}

function Article({ post, featured = false }: { post: BlogPost, featured?: boolean }) {
  const { en, text } = useHomeLocale()
  const { permalink, title, description, date, frontMatter } = post.metadata
  const caption = frontMatter as typeof frontMatter & { homepage_title?: string, homepage_description?: string }
  const displayTitle = caption.homepage_title?.trim() || title
  const summary = caption.homepage_description?.trim() || description
  const dateLabel = new Intl.DateTimeFormat(en ? 'en-GB' : 'zh-CN', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(new Date(date))
  return (
    <article className={featured ? styles.featured : styles.article}>
      {frontMatter.image && (
        <Link to={permalink} className={styles.articleImage} tabIndex={-1} aria-hidden="true">
          <PostImage image={frontMatter.image} eager={featured} />
        </Link>
      )}
      <div className={styles.articleBody}>
        <time dateTime={new Date(date).toISOString()}>{dateLabel}</time>
        {featured
          ? <h2><Link to={permalink}>{displayTitle}</Link></h2>
          : <h3><Link to={permalink}>{displayTitle}</Link></h3>}
        <p>{summary}</p>
        {featured && (
          <Link to={permalink} className={styles.textLink}>
            {text.readMore}
            <Arrow />
          </Link>
        )}
      </div>
    </article>
  )
}

function useHomeMotion() {
  const surface = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = surface.current
    if (!root || !('IntersectionObserver' in window)) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const played = new WeakSet<Element>()
    let observer: IntersectionObserver | undefined
    function observeRules() {
      observer?.disconnect()
      if (reduced.matches) return
      // Observe decoration only. Text remains visible without JavaScript.
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || played.has(entry.target)) continue
          played.add(entry.target)
          const rule = entry.target as HTMLElement
          rule.dataset.played = 'true'
          observer?.unobserve(entry.target)
        }
      }, { rootMargin: '0px 0px -32px 0px', threshold: 0 })
      root!.querySelectorAll('[data-home-rule]').forEach((rule) => {
        if (!played.has(rule)) observer!.observe(rule)
      })
    }
    observeRules()
    reduced.addEventListener('change', observeRules)
    return () => {
      observer?.disconnect()
      reduced.removeEventListener('change', observeRules)
    }
  }, [])
  return surface
}

function Rule() {
  return <span className={styles.rule} data-home-rule="" aria-hidden="true" />
}

export default function EditorialHome() {
  const surface = useHomeMotion()
  const { en, text, prefix } = useHomeLocale()
  const blog = usePluginData('docusaurus-plugin-content-blog') as { latestPosts: BlogPost[] }
  const posts = blog.latestPosts
  const featuredPost = posts[0]
  const logo = useBaseUrl('/img/logo.webp')
  const docSifterCover = `/img/thumbs/docsifter-${en ? 'en' : 'zh'}-poster.webp`
  const docPaths = ['/docs/markup/', '/docs/information-design/', '/docs/publishing/']

  return (
    <div ref={surface} className={`${styles.surface} ${styles.motion}`}>
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.heroCopy}>
            <h1 id="home-title">
              <span className={styles.greeting}>{en ? 'Hi, I’m' : '你好，我是'}</span>
              {' '}
              <span className={styles.name}>Walter</span>
            </h1>
            <p>{text.intro}</p>
            <div className={styles.heroActions}>
              <Link to={`${prefix}/blog/`} className={styles.primaryLink}>
                {text.read}
                <Arrow />
              </Link>
              <Link to={`${prefix}/docs/`} className={styles.textLink}>
                {text.writing}
                <Arrow />
              </Link>
            </div>
          </div>
          <HeroScene en={en} />
          <Rule />
        </section>

        {featuredPost
          ? (
              <section className={styles.articles} aria-label={text.latest}>
                <Article post={featuredPost} featured />
                <div className={styles.recent}>
                  <div className={styles.sectionHeading}>
                    <h2>{text.latest}</h2>
                    <Link to={`${prefix}/blog/`} className={styles.textLink}>
                      {text.allPosts}
                      <Arrow />
                    </Link>
                  </div>
                  {posts.slice(1).map(post => <Article key={post.id} post={post} />)}
                </div>
                <Rule />
              </section>
            )
          : <p className={styles.empty}>{text.empty}</p>}

        <section className={styles.writing} aria-labelledby="writing-title">
          <div className={styles.sectionHeading}>
            <div>
              <h2 id="writing-title">{text.writing}</h2>
              <p>{text.writingIntro}</p>
            </div>
            <Link to={`${prefix}/docs/`} className={styles.textLink}>
              {text.allDocs}
              <Arrow />
            </Link>
          </div>
          <div className={styles.docGrid}>
            {text.docs.map((doc, index) => (
              <article className={styles.doc} key={doc.title}>
                <span className={styles.number} aria-hidden="true">{`0${index + 1}`}</span>
                <div>
                  <h3><Link to={`${prefix}${docPaths[index]}`}>{doc.title}</Link></h3>
                  <p>{doc.description}</p>
                  <Link to={`${prefix}${docPaths[index]}`} className={styles.textLink}>
                    {doc.action}
                    <Arrow />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <Rule />
        </section>

        <section className={styles.projects} aria-labelledby="projects-title">
          <div className={styles.sectionHeading}>
            <h2 id="projects-title">{text.projects}</h2>
            <Link to={`${prefix}/showcase/`} className={styles.textLink}>
              {text.allProjects}
              <Arrow />
            </Link>
          </div>
          <div className={styles.projectGrid}>
            <article className={styles.project}>
              <div className={styles.projectImage}><PostImage image={docSifterCover} /></div>
              <div>
                <h3>DocSifter</h3>
                <p>{text.docSifter}</p>
                <a href={`/demos/docsifter/${en ? 'index-en' : 'index'}.html`} className={styles.textLink}>
                  {text.demo}
                  <Arrow />
                </a>
              </div>
            </article>
            <article className={styles.project}>
              <div className={styles.siteImage}><img src={logo} width="120" height="100" alt="" loading="lazy" /></div>
              <div>
                <h3>Flowing Docs</h3>
                <p>{text.flowingDocs}</p>
                <Link to={`${prefix}/blog/building-a-docusaurus-blog/`} className={styles.textLink}>
                  {text.siteStory}
                  <Arrow />
                </Link>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}
