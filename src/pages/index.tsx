import { lazy, Suspense } from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { PageMetadata } from '@docusaurus/theme-common'
import Layout from '@theme/Layout'
import BlogSection from '../components/landing/BlogSection'
import Hero from '../components/landing/Hero'
import Particles from '../components/magicui/particles'

const ProjectSection = lazy(() => import('../components/landing/ProjectSection'))
const FeaturesSection = lazy(() => import('../components/landing/FeaturesSection'))

const HOME_KEYWORDS = {
  'zh-Hans': [
    '技术文档',
    '技术写作',
    '内容设计',
    '开发者体验',
    '文档工程',
    'Docs as Code',
    'Docusaurus',
    'AI 技术写作',
    '知流小记',
    'Flowing Docs',
  ],
  'en': [
    'technical documentation',
    'technical writing',
    'content design',
    'developer experience',
    'documentation engineering',
    'Docs as Code',
    'Docusaurus',
    'AI technical writing',
    'Flowing Docs',
  ],
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
      <main>
        <Hero />
        <Particles className="absolute inset-0" quantity={40} ease={80} color="#ffffff" refresh />

        <div className="relative">
          <div className="mx-auto max-w-7xl bg-background lg:px-8">
            <BlogSection />
            <Suspense fallback={null}>
              <ProjectSection />
              <FeaturesSection />
            </Suspense>
          </div>
          <div
            className="absolute inset-0 -z-50 bg-grid-slate-50 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.3))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
            style={{ backgroundPosition: '10px 10px;' }}
          />
        </div>
      </main>
    </Layout>
  )
}
