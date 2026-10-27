import { useColorMode, useThemeConfig } from '@docusaurus/theme-common'
import ColorModeToggle from '@theme/ColorModeToggle'
import type { Props } from '@theme/Navbar/ColorModeToggle'
import React from 'react'
import styles from './styles.module.css'

export default function NavbarColorModeToggle({ className }: Props): React.JSX.Element | null {
  const navbarStyle = useThemeConfig().navbar.style
  const { disableSwitch: disabled, respectPrefersColorScheme } = useThemeConfig().colorMode
  const { colorMode, setColorMode } = useColorMode()

  if (disabled) {
    return null
  }

  return (
    <ColorModeToggle
      className={className}
      buttonClassName={navbarStyle === 'dark' ? styles.darkNavbarColorModeToggle : undefined}
      value={colorMode}
      onChange={setColorMode}
      respectPrefersColorScheme={respectPrefersColorScheme}
    />
  )
}
