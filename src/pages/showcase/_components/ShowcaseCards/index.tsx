/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { ReactNode } from 'react'
import clsx from 'clsx'
import Translate from '@docusaurus/Translate'
import {
  sortedShowcase,
  type ProjectShowcase,
} from '@site/data/showcase'
import Heading from '@theme/Heading'
import FavoriteIcon from '../FavoriteIcon'
import ShowcaseCard from '../ShowcaseCard'
import { useFilteredProjects } from '../../_utils'
import styles from './styles.module.css'

// Separate favorite projects from regular projects
const favoriteProjects = sortedShowcase.filter(project =>
  project.tags.includes('favorite'),
)

const otherProjects = sortedShowcase.filter(
  project => !project.tags.includes('favorite'),
)

function HeadingNoResult() {
  return (
    <Heading as="h2">
      <Translate id="showcase.usersList.noResult">No result</Translate>
    </Heading>
  )
}

/*
function HeadingFavorites() {
  return (
    <Heading as="h2" className={styles.headingFavorites}>
      <Translate id="showcase.favoritesList.title">最新案例</Translate>
      <FavoriteIcon size="large" style={{ marginLeft: '1rem' }} />
    </Heading>
  );
}
*/

function HeadingAllSites() {
  return (
    <Heading as="h2">
      <Translate id="showcase.usersList.allUsers">最新案例</Translate>
    </Heading>
  )
}

function CardList({
  heading,
  items,
}: {
  heading?: ReactNode
  items: ProjectShowcase[]
}) {
  return (
    <div className="container">
      {heading}
      <ul className={clsx('clean-list', styles.cardList)}>
        {items.map(item => (
          <ShowcaseCard key={item.title} user={item} />
        ))}
      </ul>
    </div>
  )
}

function NoResultSection() {
  return (
    <section className="margin-top--lg margin-bottom--xl">
      <div className="padding-vert--md text--center container">
        <HeadingNoResult />
      </div>
    </section>
  )
}

export default function ShowcaseCards() {
  const filteredProjects = useFilteredProjects()

  if (filteredProjects.length === 0) {
    return <NoResultSection />
  }

  return (
    <section className="margin-top--lg margin-bottom--xl">
      {filteredProjects.length === sortedShowcase.length
        ? (
            <>
              <div className="margin-top--lg">
                <CardList heading={<HeadingAllSites />} items={otherProjects as ProjectShowcase[]} />
              </div>
            </>
          )
        : (
            <CardList items={filteredProjects as ProjectShowcase[]} />
          )}
    </section>
  )
}
