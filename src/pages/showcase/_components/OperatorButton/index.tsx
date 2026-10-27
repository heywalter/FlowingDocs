import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useOperator } from '../../_utils'
import styles from './styles.module.css'

export default function OperatorButton() {
  const [operator, toggleOperator] = useOperator()
  const { i18n: { currentLocale } } = useDocusaurusContext()
  return (
    <label className={styles.option}>
      <input type="checkbox" checked={operator === 'AND'} onChange={toggleOperator} />
      {currentLocale === 'en' ? 'Match all selected topics' : '匹配全部所选主题'}
    </label>
  )
}
