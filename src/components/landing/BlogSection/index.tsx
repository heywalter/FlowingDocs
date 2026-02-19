import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import type { BlogPost } from '@docusaurus/plugin-content-blog'
import { usePluginData } from '@docusaurus/useGlobalData'
import useBaseUrl from '@docusaurus/useBaseUrl'
import { cn } from '@site/src/lib/utils'
import Image from '@theme/IdealImage'
import { motion } from 'framer-motion'
import React from 'react'
import { Section } from '../Section'

const BLOG_POSTS_COUNT = 6

export function BlogItem({ post }: { post: BlogPost }) {
  const {
    metadata: { permalink, frontMatter, title, description },
  } = post
  
  const imageUrl = useBaseUrl(frontMatter.image)

  return (
    <motion.div
      className={cn('card', 'flex w-full bg-blog shadow-blog')}
      key={permalink}
      initial={{ y: 100, opacity: 0.001 }}
      whileInView={{ y: 0, opacity: 1, transition: { duration: 0.5 } }}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      viewport={{ once: true }}
    >
      {frontMatter.image && (
        <Link href={permalink} className="max-h-[240px] w-full cursor-pointer overflow-hidden object-cover">
          <Image img={imageUrl} alt={title} />
        </Link>
      )}
      <div className="card__body">
        <h4 className="text-base">
          <Link href={permalink} className="relative hover:no-underline">
            {title}
          </Link>
        </h4>
        <p className="text-sm">{description}</p>
      </div>
    </motion.div>
  )
}

export default function BlogSection(): JSX.Element {
  const blogData = usePluginData('docusaurus-plugin-content-blog') as {
    posts: BlogPost[]
    postNum: number
    tagNum: number
  }

  const posts = blogData.posts.slice(0, BLOG_POSTS_COUNT)

  if (blogData.postNum === 0) {
    return <Translate id="homepage.blog.no_posts">作者还没开始写作哦...</Translate>
  }

  return (
    <Section title={<Translate id="homepage.blog.title">近期博客</Translate>} icon="ri:quill-pen-line" href="/blog">
      <div className="grid grid-cols-1 gap-4 p-3 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogItem key={post.id} post={post} />
        ))}
      </div>
    </Section>
  )
}
