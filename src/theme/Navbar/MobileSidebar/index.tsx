import { useLockBodyScroll, useNavbarMobileSidebar } from '@docusaurus/theme-common/internal'
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header'
import NavbarMobileSidebarLayout from '@theme/Navbar/MobileSidebar/Layout'
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu'
import NavbarMobileSidebarSecondaryMenu from '@theme/Navbar/MobileSidebar/SecondaryMenu'
import React, { useEffect } from 'react'

export default function NavbarMobileSidebar(): React.JSX.Element | null {
  const mobileSidebar = useNavbarMobileSidebar()
  useLockBodyScroll(mobileSidebar.shown)
  useEffect(() => {
    if (!mobileSidebar.shown) return
    const previousFocus = document.activeElement as HTMLElement | null
    const drawer = document.querySelector<HTMLElement>('.navbar-sidebar')
    const controls = () => Array.from(drawer?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled), [tabindex="0"]') || []).filter(item => !item.closest('[inert]'))
    const focusDrawer = () => {
      if (!drawer?.contains(document.activeElement)) controls()[0]?.focus()
    }
    // The drawer is initially hidden by its slide transition. Retry once it is visible.
    const frame = requestAnimationFrame(focusDrawer)
    drawer?.addEventListener('transitionend', focusDrawer)
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        mobileSidebar.toggle()
      }
      if (event.key !== 'Tab') return
      const items = controls()
      const first = items[0]
      const last = items[items.length - 1]
      if (!drawer?.contains(document.activeElement)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first)?.focus()
        return
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      }
      else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      cancelAnimationFrame(frame)
      drawer?.removeEventListener('transitionend', focusDrawer)
      document.removeEventListener('keydown', onKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [mobileSidebar.shown, mobileSidebar.toggle])

  if (!mobileSidebar.shouldRender) {
    return null
  }

  return (
    <NavbarMobileSidebarLayout
      header={<NavbarMobileSidebarHeader />}
      primaryMenu={<NavbarMobileSidebarPrimaryMenu />}
      secondaryMenu={<NavbarMobileSidebarSecondaryMenu />}
    />
  )
}
