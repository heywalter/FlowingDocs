import { cn } from '@site/src/lib/utils'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import type { Props } from '@theme/TOC'
import TOCItems from '@theme/TOCItems'
import styles from './styles.module.css'

export default function TOC({ className, ...props }: Props) {
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const label = currentLocale === 'en' ? 'On this page' : '本文目录'
  return (
    <nav className={cn(styles.tableOfContents, 'thin-scrollbar', className)} aria-label={label}>
      <p className={styles.label}>{label}</p>
      <TOCItems {...props} className="table-of-contents pl-0" linkClassName="table-of-contents__link toc-highlight" linkActiveClassName="table-of-contents__link--active" />
    </nav>
  )
}
