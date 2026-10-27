/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import clsx from 'clsx'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Heading from '@theme/Heading'
import ShowcaseCard from '../ShowcaseCard'
import ClearAllButton from '../ClearAllButton'
import { useFilteredProjects } from '../../_utils'
import styles from './styles.module.css'

export default function ShowcaseCards() {
  const projects = useFilteredProjects()
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const en = currentLocale === 'en'
  return (
    <section className={styles.results} aria-label={en ? 'Projects' : '项目列表'}>
      {projects.length === 0
        ? (
            <div className={styles.empty}>
              <Heading as="h2">{en ? 'No matching projects' : '没有匹配的项目'}</Heading>
              <p>{en ? 'Try another name or clear the filters.' : '试试其他名称，或清除筛选查看全部项目。'}</p>
              <ClearAllButton />
            </div>
          )
        : (
            <ul className={clsx('clean-list', styles.cardList)}>
              {projects.map(project => <ShowcaseCard key={project.title} user={project} />)}
            </ul>
          )}
    </section>
  )
}
