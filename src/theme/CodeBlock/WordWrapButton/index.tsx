import { translate } from '@docusaurus/Translate'
import { cn } from '@site/src/lib/utils'
type Props = React.ComponentProps<'button'> & { isEnabled: boolean }
import IconWordWrap from '@theme/Icon/WordWrap'
import React from 'react'

import styles from './styles.module.css'

export default function WordWrapButton({ className, onClick, isEnabled }: Props): React.JSX.Element | null {
  const title = translate({
    id: 'theme.CodeBlock.wordWrapToggle',
    message: 'Toggle word wrap',
    description: 'The title attribute for toggle word wrapping button of code block lines',
  })

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('clean-btn', className, isEnabled && styles.wordWrapButtonEnabled)}
      aria-label={title}
      title={title}
    >
      <IconWordWrap className={styles.wordWrapButtonIcon} aria-hidden="true" />
    </button>
  )
}
