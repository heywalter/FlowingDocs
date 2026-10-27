import Link from '@docusaurus/Link'
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import { useSiteNavigation } from '@site/src/components/SiteChrome'

export default function NavbarMobilePrimaryMenu() {
  const { prefix, items, pathname } = useSiteNavigation()
  const mobile = useNavbarMobileSidebar()
  return <ul className="menu__list">{items.map(({ path, label }) => <li className="menu__list-item" key={path}><Link className="menu__link" to={prefix + path} aria-current={pathname.startsWith(prefix + path) ? 'page' : undefined} onClick={mobile.toggle}>{label}</Link></li>)}</ul>
}
