import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { PageMetadata } from '@docusaurus/theme-common'
import Layout from '@theme/Layout'
import EditorialHome from '../components/landing/EditorialHome'

const HOME_KEYWORDS = {
  'zh-Hans': ['Walter', '知流小记', 'Flowing Docs', '个人博客', 'AI 工具', '自托管', '技术写作', '个人项目', '生活记录'],
  'en': ['Walter', 'Flowing Docs', 'personal blog', 'AI tools', 'self-hosting', 'technical writing', 'personal projects', 'everyday life'],
}

export default function Home() {
  const {
    i18n,
    siteConfig: { customFields, tagline },
  } = useDocusaurusContext()
  const { description } = customFields as { description: string }
  const keywords = i18n.currentLocale === 'en' ? HOME_KEYWORDS.en : HOME_KEYWORDS['zh-Hans']

  return (
    <Layout title={tagline} description={description}>
      <PageMetadata keywords={keywords} />
      <EditorialHome />
    </Layout>
  )
}
