import { ChevronRightIcon } from '@radix-ui/react-icons'
import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import CodeBlock from '@theme/CodeBlock'
import { friends } from '@site/data/friends'
import styles from './styles.module.css'

export default function Friends() {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  const title = en ? 'Friends' : '友链'
  const description = en ? 'Personal websites and places to exchange ideas.' : '个人网站与交流入口。'
  const siteInfo = `title: ${en ? 'Flowing Docs' : '知流小记 / Flowing Docs'}\ndescription: ${en ? 'Work, tools, and everyday life' : '工作、工具与生活记录'}\nwebsite: https://flowingdocs.com\navatar: https://flowingdocs.com/img/logo.webp`
  return (
    <Layout title={title} description={description}>
      <main className="site-page">
        <header className="site-page-heading">
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="site-page-links"><a href="mailto:walter@flowingdocs.com">{en ? 'Get in touch' : '邮件联系'}</a></div>
        </header>
        <ul className={styles.list}>
          {friends.map(friend => (
            <li key={friend.website}>
              <a href={friend.website}>
                {friend.avatar && <img src={friend.avatar} alt="" width="56" height="56" loading="lazy" />}
                <div>
                  <h2><span>{friend.title}</span></h2>
                  <p>{friend.description}</p>
                  <small>{friend.tags?.join(' · ')}</small>
                </div>
              </a>
            </li>
          ))}
        </ul>
        <details className={`${styles.info} site-disclosure`}>
          <summary>
            <ChevronRightIcon aria-hidden="true" />
            <span>{en ? 'Site information for linking here' : '本站信息'}</span>
          </summary>
          <CodeBlock language="yaml">{siteInfo}</CodeBlock>
        </details>
      </main>
    </Layout>
  )
}
