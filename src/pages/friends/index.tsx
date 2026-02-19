import React, { memo, useRef, useState } from 'react'
import CodeBlock from '@theme/CodeBlock'
import Layout from '@theme/Layout'
import { translate } from '@docusaurus/Translate'
import { Friend, friends as friendsData } from '@site/data/friends'
import Link from '@docusaurus/Link'
import { motion, AnimatePresence } from 'framer-motion'
import { useColorMode } from '@docusaurus/theme-common'
import styles from './styles.module.css'

const TITLE = translate({
  message: '友链',
  id: 'friends.page.title',
})
const DESCRIPTION = translate({
  message: '优秀的技术文档社区，共同进步',
  id: 'friends.page.description',
})
const ADD_FRIEND_URL = 'https://github.com/yourusername/blog/edit/main/data/friends.tsx'

const SITE_INFO = `title: 'DocCraft'
description: '${translate({
  message: '技术文档的艺术与科学',
  id: 'friends.siteInfo.description',
})}'
website: 'https://doccraft.io'
avatar: 'https://doccraft.io/img/logo.png'
`

const friends = friendsData

interface SiteInfoProps {
  isExpanded: boolean
  toggleExpanded: () => void
}

function SiteInfo({ isExpanded, toggleExpanded }: SiteInfoProps) {
  return (
    <div className={styles.siteInfoContainer}>
      <motion.div
        className={styles.siteInfoTab}
        animate={{
          x: isExpanded ? -320 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <button
          onClick={toggleExpanded}
          className={styles.toggleButton}
          aria-label={isExpanded
            ? translate({
                message: '收起站点信息',
                id: 'friends.siteInfo.collapse',
              })
            : translate({
                message: '展开站点信息',
                id: 'friends.siteInfo.expand',
              })}
        >
          <span className={styles.toggleIcon}>{isExpanded ? '✕' : '📋'}</span>
          <span className={styles.toggleLabel}>
            {translate({
              message: '站点信息',
              id: 'friends.siteInfo.label',
            })}
          </span>
        </button>
      </motion.div>

      <motion.div
        className={styles.siteInfoPanel}
        initial={{ x: 320 }}
        animate={{
          x: isExpanded ? 0 : 320,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <div className={styles.siteInfoHeader}>
          <span className={styles.siteInfoTitle}>
            {translate({
              message: '本站信息',
              id: 'friends.siteInfo.title',
            })}
          </span>
        </div>
        <CodeBlock language="yaml" className={styles.codeBlock}>
          {SITE_INFO}
        </CodeBlock>
      </motion.div>
    </div>
  )
}

function FriendHeader() {
  return (
    <section className={styles.headerSection}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {TITLE}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {DESCRIPTION}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Link
          className={styles.addFriendButton}
          to={ADD_FRIEND_URL}
          target="_blank"
          rel="noreferrer"
        >
          🔗
          {' '}
          {translate({
            message: '申请友链',
            id: 'friends.header.applyLink',
          })}
        </Link>
      </motion.div>
    </section>
  )
}

const FriendCard = memo(({ friend }: { friend: Friend }) => {
  const { colorMode } = useColorMode()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.li
      className={`${styles.friendCard} ${colorMode === 'dark' ? styles.darkCard : ''}`}
      whileHover={{
        y: -5,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className={styles.cardContent}>
        <motion.img
          src={friend.avatar ? (typeof friend.avatar === 'string' ? friend.avatar : (friend.avatar as any).src?.src || '') : ''}
          alt={friend.title}
          className={styles.avatar}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        />
        <div className={styles.friendInfo}>
          <div className={styles.titleWrapper}>
            <h3 className={styles.friendTitle}>
              <Link
                to={friend.website}
                rel="noopener noreferrer"
                className={styles.friendLink}
              >
                {friend.title}
              </Link>
            </h3>
            <motion.div
              className={styles.linkIcon}
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              →
            </motion.div>
          </div>
          <p className={styles.friendDescription}>{friend.description}</p>
          {friend.tags && friend.tags.length > 0 && (
            <div className={styles.tagContainer}>
              {friend.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.li>
  )
})

function FriendCards() {
  return (
    <section className={styles.cardsSection}>
      <motion.div
        className={styles.cardsContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <ul className={styles.cardsList}>
          {friends.map(friend => (
            <FriendCard key={friend.website} friend={friend} />
          ))}
        </ul>
      </motion.div>
    </section>
  )
}

function EmptyState() {
  const { colorMode } = useColorMode()

  return (
    <motion.div
      className={`${styles.emptyState} ${colorMode === 'dark' ? styles.darkEmptyState : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className={styles.emptyStateContent}>
        <div className={styles.emptyStateIcon}>🔍</div>
        <h3>
          {translate({
            message: '暂无友链',
            id: 'friends.empty.title',
          })}
        </h3>
        <p>
          {translate({
            message: '成为第一个添加友链的伙伴吧！',
            id: 'friends.empty.description',
          })}
        </p>
        <Link
          className={styles.addFriendButton}
          to={ADD_FRIEND_URL}
          target="_blank"
          rel="noreferrer"
        >
          {translate({
            message: '申请友链',
            id: 'friends.empty.applyLink',
          })}
        </Link>
      </div>
    </motion.div>
  )
}

export default function FriendLink(): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)

  const toggleInfoExpanded = () => {
    setIsInfoExpanded(!isInfoExpanded)
  }

  return (
    <Layout title={TITLE} description={DESCRIPTION} wrapperClassName={styles.friendsWrapper}>
      <motion.main ref={ref} className={styles.mainContent}>
        <FriendHeader />
        {friends.length > 0 ? <FriendCards /> : <EmptyState />}
        <SiteInfo isExpanded={isInfoExpanded} toggleExpanded={toggleInfoExpanded} />
      </motion.main>
    </Layout>
  )
}
