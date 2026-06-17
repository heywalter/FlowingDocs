import React from 'react'
import { Variants, motion } from 'framer-motion'
import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import HeroMain from './img/hero_main.svg'
import styles from './styles.module.css'
import SocialLinks from '@site/src/components/SocialLinks'
import { Icon, IconProps } from '@iconify/react'

interface LogoWithLink extends IconProps {
  boxClassName?: string
  iconStyle?: React.CSSProperties
  to: string
  label: string
}

const variants: Variants = {
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 100,
      duration: 0.3,
      delay: i * 0.3,
    },
  }),
  hidden: { opacity: 0, y: 30 },
}

function Logos() {
  const logos: LogoWithLink[] = [
    {
      icon: 'logos:docusaurus',
      style: { left: '20%', top: '20%' },
      to: '/blog/tags/docusaurus',
      label: 'Docusaurus',
    },
    {
      icon: 'logos:asciidoctor',
      style: { right: '20%', top: '10%' },
      to: '/blog/tags/asciidoc',
      label: 'AsciiDoc',
    },
    {
      icon: 'simple-icons:openai',
      boxClassName: styles.aiBox,
      iconStyle: { fontSize: '2.15rem' },
      to: '/blog/tags/ai',
      label: 'AI',
    },
  ]

  return (
    <>
      {logos.map((logo, index) => (
        <motion.div
          className={`${styles.box} ${logo.boxClassName ?? ''}`}
          style={logo.style}
          key={index}
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <Link to={logo.to} aria-label={`View ${logo.label} posts`}>
            <Icon icon={logo.icon} style={logo.iconStyle ?? { fontSize: '3rem' }} />
          </Link>
        </motion.div>
      ))}
    </>
  )
}

function Background() {
  return (
    <motion.div className={styles.background}>
      <Logos />
      <HeroMain style={{ marginTop: '180px' }} />
      <div className={styles.circle} />
    </motion.div>
  )
}

function Name() {
  return (
    <motion.div
      className={styles.hero_text}
      custom={1}
      initial="hidden"
      animate="visible"
      variants={variants}
      onMouseMove={(e) => {
        e.currentTarget.style.setProperty('--x', `${e.clientX}px`)
        e.currentTarget.style.setProperty('--y', `${e.clientY}px`)
      }}
    >
      <Translate id="homepage.hero.greet">你好，</Translate>
      <span
        className={styles.name}
        onMouseMove={(e) => {
          const bounding = e.currentTarget.getBoundingClientRect()
          e.currentTarget.style.setProperty('--positionX', `${bounding.x}px`)
          e.currentTarget.style.setProperty('--positionY', `${bounding.y}px`)
        }}
      >
        <Translate id="homepage.hero.name">世界</Translate>
      </span>
      <span className={styles.wave}>👋</span>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <motion.div className={styles.hero}>
      <div className={styles.intro}>
        <Name />
        <motion.p
          custom={2}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <Translate id="homepage.hero.text">记录技术传播实践，关注用户体验，分享平凡生活~</Translate>
        </motion.p>
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <SocialLinks />
        </motion.div>

        <motion.div
          className={styles.buttonGroup}
          custom={4}
          initial="hidden"
          animate="visible"
          variants={variants}
        >
          <div className={styles.outer}>
            <div className={styles.gradient} />
            <a className={styles.button} href="./about">
              <Translate id="homepage.hero.introduce">自我介绍</Translate>
            </a>
          </div>
        </motion.div>
      </div>
      <Background />
    </motion.div>
  )
}
