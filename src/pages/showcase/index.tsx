import styles from './styles.module.css'
import Link from '@docusaurus/Link'
import { PageMetadata } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import { getLocalizedKeywords, SHOWCASE_KEYWORDS } from '@site/src/lib/seo'
import ShowcaseSearchBar from './_components/ShowcaseSearchBar'
import ShowcaseCards from './_components/ShowcaseCards'
import ShowcaseFilters from './_components/ShowcaseFilters'

function ProjectFilters({ en }: { en: boolean }) {
  return (
    <section className={styles.filters} aria-label={en ? 'Filter projects' : '筛选项目'}>
      <ShowcaseFilters />
      <ShowcaseSearchBar />
    </section>
  )
}

export default function Showcase() {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  const title = en ? 'Projects' : '项目'
  const description = en ? 'Tools and websites I’ve built, with demos, source code, and notes on the work.' : '做过的一些工具和网站。这里放演示、源码，以及搭建过程中的记录。'
  return (
    <Layout title={title} description={description}>
      <PageMetadata keywords={getLocalizedKeywords(currentLocale, SHOWCASE_KEYWORDS)} />
      <main className="site-page site-showcase">
        <header className="site-page-heading">
          <h1>{title}</h1>
          <p>{description}</p>
          <nav className="site-page-links" aria-label={en ? 'Project links' : '项目链接'}>
            <a href="https://github.com/heywalter">GitHub</a>
            <Link to={en ? '/en/about/' : '/about/'}>{en ? 'Suggestions and corrections' : '建议与勘误'}</Link>
          </nav>
        </header>
        <ProjectFilters en={en} />
        <ShowcaseCards />
      </main>
    </Layout>
  )
}
