/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import clsx from 'clsx'
import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import { Tags, TagList, type TagType, type ProjectShowcase } from '@site/data/showcase'
import { sortBy } from '@site/src/utils/jsUtils'
import Heading from '@theme/Heading'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { resolveThumbnail } from '@site/src/lib/thumbnails'
import styles from './styles.module.css'

function TagItem({
  label,
  description,
  color,
}: {
  label: string
  description: string
  color: string
}) {
  return (
    <li className={styles.tag} title={description}>
      <span className={styles.textLabel}>{label}</span>
      <span className={styles.colorLabel} style={{ backgroundColor: color }} />
    </li>
  )
}

function ShowcaseCardTag({ tags }: { tags: TagType[] }) {
  const tagObjects = tags.map(tag => ({ tag, ...Tags[tag] }))

  // Keep same order for all tags
  const tagObjectsSorted = sortBy(tagObjects, tagObject =>
    TagList.indexOf(tagObject.tag),
  )

  return (
    <>
      {tagObjectsSorted.map((tagObject, index) => {
        return <TagItem key={index} {...tagObject} />
      })}
    </>
  )
}

function getCardImage(user: ProjectShowcase): string {
  return (
    user.preview
    // TODO make it configurable
    ?? `https://slorber-api-screenshot.netlify.app/${encodeURIComponent(
      user.url,
    )}/showcase`
  )
}

function ShowcaseCard({ user }: { user: ProjectShowcase }) {
  const image = getCardImage(user)
  const { i18n: { currentLocale } } = useDocusaurusContext()
  const localUrl = (url: string) => currentLocale === 'en' && url.startsWith('/blog/') ? '/en' + url : url
  return (
    <li key={user.title} className={styles.card}>
      <div className={clsx('card__image', styles.showcaseCardImage)}>
        <img src={resolveThumbnail(image)} alt="" width="640" height="360" loading="lazy" onError={(event) => { if (event.currentTarget.getAttribute('src') !== image) event.currentTarget.src = image }} />
      </div>
      <div className="card__body">
        <div className={clsx(styles.showcaseCardHeader)}>
          <Heading as="h2" className={styles.showcaseCardTitle}>
            <a href={localUrl(user.url)} className={`${styles.showcaseCardLink} site-link`}>
              {user.title}
            </a>
          </Heading>
        </div>
        <p className={styles.showcaseCardBody}>{user.description}</p>
        {(user.article || user.source) && (
          <div className={styles.showcaseCardActions}>
            {user.article && (
              <Link
                href={localUrl(user.article)}
                className="button button--primary button--sm site-link"
              >
                <Translate id="showcase.card.articleLink">项目介绍</Translate>
              </Link>
            )}
            {user.source && (
              <Link
                href={user.source}
                className={clsx(
                  'button button--secondary button--sm site-link',
                  styles.showcaseCardSrcBtn,
                )}
              >
                <Translate id="showcase.card.sourceLink">GitHub ↗</Translate>
              </Link>
            )}
          </div>
        )}
      </div>
      <ul className={clsx('card__footer', styles.cardFooter)}>
        <ShowcaseCardTag tags={user.tags} />
      </ul>
    </li>
  )
}

export default React.memo(ShowcaseCard)
