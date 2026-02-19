/**
 * Social Links Configuration
 *
 * Defines social media platforms and their metadata (icon, title, color)
 * used in the profile section of the homepage.
 *
 * To add a new platform:
 * 1. Add the field to `Social` type
 * 2. Set the URL in `social`
 * 3. Define its UI properties in `socialSet`
 */

export type Social = {
  github?: string
  x?: string
  qq?: string
  wx?: string
  cloudmusic?: string
  zhihu?: string
  email?: string
  discord?: string
  linkedin?: string
}

type SocialValue = {
  href?: string
  title: string
  icon: string
  color: string
  qrcode?: string
}

const social: Social = {
  github: 'https://github.com/heywalter',
  x: 'https://twitter.com/hihiwalter',
  wx: '/img/WeChat_QR.png',
  // qq: '',
  // zhihu: '',
  email: 'mailto:walter@flowingdocs.com',
  discord: 'https://discord.gg/f9DU3Enqqm',
  linkedin: 'https://www.linkedin.com/in/heywalter/',
}

const socialSet: Record<keyof Social | 'rss', SocialValue> = {
  github: {
    href: social.github,
    title: 'GitHub',
    icon: 'ri:github-line',
    color: '#010409',
  },
  x: {
    href: social.x,
    title: 'X',
    icon: 'ri:twitter-x-line',
    color: '#000',
  },
  wx: {
    href: social.wx,
    title: 'WeChat',
    icon: 'ri:wechat-2-line',
    color: '#07c160',
    qrcode: '/img/WeChat_QR.png',
  },
  zhihu: {
    href: social.zhihu,
    title: 'Zhihu',
    icon: 'ri:zhihu-line',
    color: '#1772F6',
  },
  discord: {
    href: social.discord,
    title: 'Discord',
    icon: 'ri:discord-line',
    color: '#5A65F6',
  },
  qq: {
    href: social.qq,
    title: 'QQ',
    icon: 'ri:qq-line',
    color: '#1296db',
  },
  email: {
    href: social.email,
    title: 'Email',
    icon: 'ri:mail-line',
    color: '#D44638',
  },
  cloudmusic: {
    href: social.cloudmusic,
    title: 'NetEase Music',
    icon: 'ri:netease-cloud-music-line',
    color: '#C20C0C',
  },
  linkedin: {
    href: social.linkedin,
    title: 'LinkedIn',
    icon: 'ri:linkedin-line',
    color: '#0077B5',
  },
  /*rss: {
    href: '/blog/rss.xml',
    title: 'RSS',
    icon: 'ri:rss-line',
    color: '#FFA501',
  },*/
}

export default socialSet
