import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './styles.module.css'

export default function BlogBrowseNav({ active }: { active?: 'articles' | 'topics' | 'archive' }) {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  const prefix = en ? '/en/blog' : '/blog'
  const links = [
    { id: 'articles', path: '/', label: en ? 'All articles' : '全部文章' },
    { id: 'topics', path: '/tags/', label: en ? 'Topics' : '按主题' },
    { id: 'archive', path: '/archive/', label: en ? 'Archive' : '按时间' },
  ]
  return (
    <nav className={styles.nav} aria-label={en ? 'Browse articles' : '浏览文章'}>
      {links.map(link => <Link key={link.id} to={prefix + link.path} aria-current={active === link.id ? 'page' : undefined}>{link.label}</Link>)}
      <a className={styles.feed} href={`${prefix}/atom.xml`}>RSS</a>
    </nav>
  )
}
