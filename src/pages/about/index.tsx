import useBrokenLinks from '@docusaurus/useBrokenLinks'
import { useState } from 'react'
import Layout from '@theme/Layout'
import { PageMetadata } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { ArrowRightIcon, ChevronRightIcon, EnvelopeClosedIcon, GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import Comment from '@site/src/components/Comment'
import social from '@site/data/social'
import { ABOUT_KEYWORDS, getLocalizedKeywords } from '@site/src/lib/seo'
import editorial from '@site/src/components/landing/EditorialHome/styles.module.css'
import styles from './styles.module.css'

const content = {
  zh: {
    title: '关于我', description: 'Walter Gui 的个人博客，记录工作经验、工具使用、个人项目与日常生活。',
    intro: [
      '你好，我是 Walter。平时写文档、写代码，也尝试 AI 工具和自托管服务。',
      '这里记录工作中的经验、做过的项目和生活里的见闻。有些尝试解决了问题，有些还在慢慢摸索。',
    ],
    awardPrefix: '2026 年获得 ', awardSuffix: '。',
    workTitle: '工作与实践',
    work: [
      '我的工作与技术文档有关，经常需要和研发、产品一起确认功能行为、使用条件和限制。遇到说不清楚的地方，会结合源码、测试结果和实际操作继续核实。',
      '我也用脚本和 AI 工具辅助检查与整理，把重复的工作尽量交给工具，留下需要判断的问题自己处理。',
    ],
    tools: '常用工具', projectsTitle: '项目与笔记',
    projects: [
      { title: 'DocSifter', description: '中文技术文档的本地审校工具，结合规则与模型检查文字问题，并保护代码块和文档结构。', action: '查看演示' },
      { title: '家用私有云', description: '用旧主机搭建 Nextcloud，记录文件同步、版本管理和本地知识库接入的过程。', action: '阅读记录' },
      { title: '知流小记', description: '基于 Docusaurus 搭建的个人网站，记录内容整理、页面设计和日常维护中的尝试。', action: '搭建记录' },
    ],
    lifeTitle: '工作之外', life: '工作之外，我喜欢骑行，也会用旧设备搭建家用服务。有意思的经历和遇到的问题，偶尔会写在这里。',
    details: '认证与常用工具', certsTitle: '认证',
    contactTitle: '联系', contactIntro: '如有建议、文章勘误，或想交流相关经验，欢迎来信。', comments: '留言',
  },
  en: {
    title: 'About me', description: 'Walter Gui’s personal blog: notes on work, tools, personal projects, and everyday life.',
    intro: [
      'Hi, I’m Walter. I write documentation and code, and try out AI tools and self-hosted services.',
      'I write about work, personal projects, and everyday life. Some experiments have solved a problem; others are still a work in progress.',
    ],
    awardPrefix: 'In 2026, I received an award at the ', awardSuffix: '.',
    workTitle: 'Work and practice',
    work: [
      'My work involves technical documentation. I work with engineering and product teams to check how features behave, what they require, and where their limits are. When something is unclear, I check source code, test results, and the product itself.',
      'I also use scripts and AI tools to help with checking and organizing, leaving more time for questions that need my judgment.',
    ],
    tools: 'Tools I use', projectsTitle: 'Projects and notes',
    projects: [
      { title: 'DocSifter', description: 'A local tool that combines rules and models to check Chinese technical documentation while protecting code blocks and document structure.', action: 'View the demo' },
      { title: 'A home private cloud', description: 'Running Nextcloud on an old PC, with notes on file sync, version history, and connecting a local knowledge base.', action: 'Read the notes' },
      { title: 'Flowing Docs', description: 'A personal website built with Docusaurus, with notes on organizing content, designing pages, and maintaining the site.', action: 'How I built it' },
    ],
    lifeTitle: 'Outside work', life: 'Outside work, I enjoy cycling and setting up home services on older devices. I occasionally write about those experiences and the problems I run into.',
    details: 'Certifications and tools', certsTitle: 'Certifications',
    contactTitle: 'Contact', contactIntro: 'Suggestions, corrections, and notes from your own experience are welcome by email.', comments: 'Leave a comment',
  },
}

export default function About() {
  // The homepage cycling shortcut points to this custom-page anchor.
  useBrokenLinks().collectAnchor('life-title')
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  const text = content[en ? 'en' : 'zh']
  const prefix = en ? '/en' : ''
  const avatar = useBaseUrl('/img/avatar.webp')
  const [showComments, setShowComments] = useState(false)
  const projectPaths = [`/demos/docsifter/${en ? 'index-en' : 'index'}.html`, `${prefix}/blog/nextcloud-self-hosted-cloud-storage/`, `${prefix}/blog/building-a-docusaurus-blog/`]

  return (
    <Layout title={en ? 'About Me' : text.title} description={text.description}>
      <PageMetadata keywords={getLocalizedKeywords(currentLocale, ABOUT_KEYWORDS)} />
      <div className={editorial.surface}>
        <main className={styles.page}>
          <section className={styles.intro} aria-labelledby="about-name">
            <div>
              <p className={styles.eyebrow}>{text.title}</p>
              <h1 id="about-name">Walter Gui</h1>
              <div className={styles.bio}>{text.intro.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
            </div>
            <img className={styles.avatar} src={avatar} alt={en ? 'Walter’s illustrated avatar' : 'Walter 的插画头像'} width="1024" height="1024" fetchPriority="high" />
          </section>

          <section className={styles.section} aria-labelledby="work-title">
            <h2 id="work-title">{text.workTitle}</h2>
            <div className={styles.prose}>
              {text.work.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
              {/* Award status and year confirmed by Walter on 2026-10-21. */}
              <p id="award-title">
                {text.awardPrefix}
                <a className="site-link site-inline-link" href="https://globalwritersawards.document360.com/">Document360 Global Writers Awards</a>
                {text.awardSuffix}
              </p>
              <details className={`${styles.details} site-disclosure`}>
                <summary>
                  <ChevronRightIcon aria-hidden="true" />
                  <span>{text.details}</span>
                </summary>
                <dl>
                  <dt>{text.certsTitle}</dt>
                  <dd>Linux Kylin · ClickHouse · Aliyun ACP · MongoDB DBA</dd>
                  <dt>{text.tools}</dt>
                  <dd>Git · React · Docusaurus · Codex · Nextcloud · Mermaid</dd>
                </dl>
              </details>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="things-title">
            <h2 id="things-title">{text.projectsTitle}</h2>
            <div>
              {text.projects.map((project, index) => (
                <article className={styles.project} key={project.title}>
                  <span className={styles.number} aria-hidden="true">{`0${index + 1}`}</span>
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                  <a href={projectPaths[index]} className={`${editorial.textLink} site-link`}>
                    {project.action}
                    <ArrowRightIcon aria-hidden="true" data-link-arrow />
                  </a>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.section} aria-labelledby="life-title">
            <h2 id="life-title">{text.lifeTitle}</h2>
            <div className={styles.prose}>
              <p>{text.life}</p>
            </div>
          </section>

          <section className={`${styles.section} ${styles.contact}`} aria-labelledby="contact-title">
            <h2 id="contact-title">{text.contactTitle}</h2>
            <div>
              <p>{text.contactIntro}</p>
              <div className={styles.contactLinks}>
                <a className="site-link" href={social.email.href}>
                  <EnvelopeClosedIcon aria-hidden="true" />
                  walter@flowingdocs.com
                </a>
                <a className="site-link" href={social.github.href}>
                  <GitHubLogoIcon aria-hidden="true" />
                  GitHub
                </a>
                <a className="site-link" href={social.linkedin.href}>
                  <LinkedInLogoIcon aria-hidden="true" />
                  LinkedIn
                </a>
                <a className="site-link" href={social.x.href}>X</a>
              </div>
              <details id="comments" className={`${styles.details} site-disclosure`} onToggle={event => setShowComments(event.currentTarget.open)}>
                <summary>
                  <ChevronRightIcon aria-hidden="true" />
                  <span>{text.comments}</span>
                </summary>
                {showComments && <div className={styles.comments}><Comment /></div>}
              </details>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  )
}
