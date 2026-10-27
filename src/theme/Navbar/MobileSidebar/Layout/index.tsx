import { useNavbarSecondaryMenu, useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import { cn } from '@site/src/lib/utils'
import type { Props } from '@theme/Navbar/MobileSidebar/Layout'

export default function NavbarMobileSidebarLayout({ header, primaryMenu, secondaryMenu }: Props): React.JSX.Element {
  const { shown } = useNavbarMobileSidebar()
  const { shown: secondaryMenuShown } = useNavbarSecondaryMenu()
  return (
    <div className="navbar-sidebar" role="dialog" aria-modal={shown ? true : undefined} aria-label="Navigation" aria-hidden={!shown} inert={!shown}>
      {header}
      <div
        className={cn('navbar-sidebar__items', {
          'navbar-sidebar__items--show-secondary': secondaryMenuShown,
        })}
      >
        <div className="navbar-sidebar__item menu" inert={secondaryMenuShown}>{primaryMenu}</div>
        <div className="navbar-sidebar__item menu" inert={!secondaryMenuShown}>{secondaryMenu}</div>
      </div>
    </div>
  )
}
