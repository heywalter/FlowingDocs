import Link from '@docusaurus/Link'
import { useLocation } from '@docusaurus/router'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import NavbarMobileSidebar from '@theme/Navbar/MobileSidebar'
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle'
import SearchBar from '@theme/SearchBar'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { alternateLocalePath } from '@site/src/lib/localePath'
import styles from './styles.module.css'

export function useSiteNavigation() {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  const prefix = en ? '/en' : ''
  const location = useLocation()
  const syncAlternate = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.href = alternateLocalePath(window.location.pathname, !en) + window.location.search + window.location.hash
  }
  const alternate = alternateLocalePath(location.pathname, !en) + location.search + location.hash
  const items = [
    { path: '/blog/', label: en ? 'Articles' : '文章' },
    { path: '/docs/', label: en ? 'Technical writing' : '技术写作' },
    { path: '/showcase/', label: en ? 'Projects' : '项目' },
    { path: '/about/', label: en ? 'About' : '关于' },
  ]
  return { en, prefix, alternate, syncAlternate, items, pathname: location.pathname }
}

export function SiteBrand() {
  const { en, prefix } = useSiteNavigation()
  const logo = useBaseUrl('/img/logo.webp')
  return (
    <Link to={`${prefix}/`} className={styles.brand} aria-label={en ? 'Flowing Docs' : '知流小记'}>
      <img src={logo} width="50" height="44" alt="" />
      <span>
        <strong>{en ? 'Flowing Docs' : '知流小记'}</strong>
        <small>{en ? 'Walter’s notes' : 'Flowing Docs'}</small>
      </span>
    </Link>
  )
}

export function SiteHeader() {
  const { en, prefix, alternate, syncAlternate, items, pathname } = useSiteNavigation()
  const mobile = useNavbarMobileSidebar()
  return (
    <header className={`navbar ${styles.header} ${mobile.shown ? 'navbar-sidebar--show' : ''}`}>
      <div className={styles.inner}>
        <SiteBrand />
        <nav className={styles.desktopNav} aria-label={en ? 'Main navigation' : '主导航'}>
          {items.map(({ path, label }) => <Link className="site-link" key={path} to={prefix + path} aria-current={pathname.replace(/\/$/, '').startsWith((prefix + path).replace(/\/$/, '')) ? 'page' : undefined}>{label}</Link>)}
        </nav>
        <div className={styles.tools}>
          <div className={styles.search}><SearchBar /></div>
          <a href={alternate} onClick={syncAlternate} className={styles.locale} lang={en ? 'zh-Hans' : 'en'} aria-label={en ? '切换到中文' : 'Switch to English'}>{en ? '中' : 'EN'}</a>
          <NavbarColorModeToggle />
          <button type="button" className={styles.menuToggle} aria-label={en ? 'Open navigation' : '打开导航'} aria-expanded={mobile.shown} onClick={mobile.toggle}><HamburgerMenuIcon aria-hidden="true" /></button>
        </div>
      </div>
      <div className="navbar-sidebar__backdrop" role="presentation" onClick={mobile.toggle} />
      <NavbarMobileSidebar />
    </header>
  )
}

export function SiteFooter() {
  const { en, prefix, alternate, syncAlternate } = useSiteNavigation()
  return (
    <footer className={styles.footer}>
      <Link to={`${prefix}/about/`} className={`${styles.footerBrand} site-link`}>{en ? 'Flowing Docs' : '知流小记'}</Link>
      <span>
        {`© ${new Date().getFullYear()} Walter · `}
        <a className="site-link" href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a>
      </span>
      <nav aria-label={en ? 'More links' : '更多链接'}>
        <Link className="site-link" to={`${prefix}/blog/archive/`}>{en ? 'Archive' : '归档'}</Link>
        <Link className="site-link" to={`${prefix}/friends/`}>{en ? 'Friends' : '友链'}</Link>
        <a className="site-link" href="https://github.com/heywalter">GitHub</a>
        <a className="site-link" href={alternate} onClick={syncAlternate} lang={en ? 'zh-Hans' : 'en'}>{en ? '中文' : 'EN'}</a>
      </nav>
    </footer>
  )
}
