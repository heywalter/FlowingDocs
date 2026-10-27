/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { type ReactNode } from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { useSearchName } from '@site/src/pages/showcase/_utils'
import styles from './styles.module.css'

export default function ShowcaseSearchBar(): ReactNode {
  const [searchName, setSearchName] = useSearchName()
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const label = currentLocale === 'en' ? 'Search projects' : '搜索项目'
  return (
    <div className={styles.searchBar}>
      <label htmlFor="project-search">{label}</label>
      <input
        id="project-search"
        type="search"
        placeholder={currentLocale === 'en' ? 'Project name' : '输入项目名称'}
        value={searchName}
        onInput={(e) => {
          setSearchName(e.currentTarget.value)
        }}
      />
    </div>
  )
}
