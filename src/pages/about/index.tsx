import React from 'react'
import Layout from '@theme/Layout'
import { Icon } from '@iconify/react'
import { translate } from '@docusaurus/Translate'
import Comment from '@site/src/components/Comment'
import social from '@site/data/social'
import styles from './styles.module.css'

export default function About() {
  return (
    <Layout
      title={translate({
        message: '关于我',
        id: 'about.page.title',
      })}
      description={translate({
        message: '桂陈的个人简历与技术背景',
        id: 'about.page.description',
      })}
    >
      <div className={styles.pageContainer}>
        <div className={styles.profileCard}>
          {/* Left Column: Avatar & Stats */}
          <div className={styles.leftColumn}>
            <div className={styles.avatarWrapper}>
              <img src="/img/avatar.webp" alt="Walter" className={styles.avatar} />
            </div>

            <div className={styles.socialGrid}>
              <a href={social.github.href} target="_blank" className={styles.socialLink} aria-label="GitHub">
                <Icon icon="ri:github-fill" />
              </a>
              <a href={social.x.href} target="_blank" className={styles.socialLink} aria-label="Twitter">
                <Icon icon="ri:twitter-x-fill" />
              </a>
              <a href={social.linkedin.href} target="_blank" className={styles.socialLink} aria-label="LinkedIn">
                <Icon icon="ri:linkedin-fill" />
              </a>
              <a href={social.email.href} className={styles.socialLink} aria-label="Email">
                <Icon icon="ri:mail-send-fill" />
              </a>
            </div>

            {/* Skills & Tools Section */}
            <div className={styles.skillsSection}>
              <h3 className={styles.sidebarTitle}>
                {translate({
                  message: '技能与工具',
                  id: 'about.sidebar.skills',
                })}
              </h3>
              
              <div className={styles.techStackContainer}>
                {/* Core Skills Group */}
                <div className={styles.techGroup}>
                  <div className={styles.groupHeader}>
                    <Icon icon="ri:coreos-fill" className={styles.groupIcon} />
                    <span>
                      {translate({
                        message: '核心能力',
                        id: 'about.tech.category1.title',
                      })}
                    </span>
                  </div>
                  <div className={styles.groupContent}>
                    <div className={styles.techTag}>
                      <Icon icon="ri:quill-pen-line" />
                      <span>Tech Writing</span>
                    </div>
                    <div className={styles.techTag}>
                      <Icon icon="ri:mind-map" />
                      <span>Info Arch</span>
                    </div>
                    <div className={styles.techTag}>
                      <Icon icon="ri:compass-3-line" />
                      <span>Content Strategy</span>
                    </div>
                  </div>
                </div>

                {/* Tech Stack Group */}
                <div className={styles.techGroup}>
                  <div className={styles.groupHeader}>
                    <Icon icon="ri:stack-fill" className={styles.groupIcon} />
                    <span>
                      {translate({
                        message: '技术栈',
                        id: 'about.tech.title',
                      })}
                    </span>
                  </div>
                  <div className={styles.groupContent}>
                    <div className={styles.techTag}>
                      <Icon icon="logos:docusaurus" />
                      <span>Docusaurus</span>
                    </div>
                    <div className={styles.techTag}>
                      <Icon icon="simple-icons:asciidoctor" />
                      <span>AsciiDoc</span>
                    </div>
                    <div className={styles.techTag}>
                      <Icon icon="logos:react" />
                      <span>React</span>
                    </div>
                    <div className={styles.techTag}>
                      <Icon icon="ri:markdown-fill" />
                      <span>Markdown</span>
                    </div>
                    <div className={styles.techTag}>
                      <Icon icon="logos:git-icon" />
                      <span>Git</span>
                    </div>
                  </div>
                </div>

                {/* Docs Tools Group */}
                <div className={styles.techGroup}>
                  <div className={styles.groupHeader}>
                    <Icon icon="ri:book-read-fill" className={styles.groupIcon} />
                    <span>
                      {translate({
                        message: '文档工具',
                        id: 'about.tech.category3.title',
                      })}
                    </span>
                  </div>
                  <div className={styles.groupContent}>
                    <div className={styles.techTag}>
                      <Icon icon="carbon:api" style={{ color: '#4caf50' }} />
                      <span>API Docs</span>
                    </div>
                    <div className={styles.techTag}>
                      <Icon icon="logos:openapi-icon" />
                      <span>OpenAPI</span>
                    </div>
                    <div className={styles.techTag}>
                      <Icon icon="ri:flow-chart" style={{ color: '#ff4081' }} />
                      <span>Mermaid</span>
                    </div>
                  </div>
                </div>
                {/* Certifications Group */}
                <div className={styles.techGroup}>
                  <div className={styles.groupHeader}>
                    <Icon icon="ri:award-fill" className={styles.groupIcon} />
                    <span>
                      {translate({
                        message: '认证',
                        id: 'about.certs.title',
                      })}
                    </span>
                  </div>
                  <div className={styles.groupContent}>
                    <div className={styles.techTag}>
                      <Icon icon="simple-icons:linux" />
                      <span>Linux Kylin</span>
                    </div>
                    <div className={styles.techTag}>
                      <Icon icon="simple-icons:clickhouse" style={{ color: '#FFCC00' }} />
                      <span>ClickHouse</span>
                    </div>
                    <div className={styles.techTag}>
                      <Icon icon="simple-icons:alibaba" style={{ color: '#FF6600' }} />
                      <span>Aliyun ACP</span>
                    </div>
                    <div className={styles.techTag}>
                      <Icon icon="simple-icons:mongodb" style={{ color: '#47A248' }} />
                      <span>MongoDB DBA</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Info & Content */}
          <div className={styles.rightColumn}>
            <div className={styles.headerInfo}>
              <h1 className={styles.name}>Walter Gui</h1>
              <p className={styles.title}>
                {translate({
                  message: '资深技术文档工程师 & AI 探索者',
                  id: 'about.role.title',
                })}
              </p>
              
              <div className={styles.bioText}>
                <p>
                  {translate({
                    message: '我是桂陈（Walter），一名技术内容创作者和技术传播实践者。感谢你来到知流小记！我的工作是让复杂的技术知识变得简单易懂，成为产品与用户之间的桥梁。',
                    id: 'about.intro.paragraph1',
                  })}
                </p>
                <p>
                  {translate({
                    message: '我的英文名 Walter 和 Water 发音相近，这也体现了我对技术传播的理念：',
                    id: 'about.intro.paragraph2',
                  })}
                </p>
                
                <div className={styles.quoteBox}>
                  <Icon icon="ri:double-quotes-l" className={styles.quoteIcon} />
                  <blockquote>
                    {translate({
                      message: '知识如水，唯流动方显价值。',
                      id: 'about.intro.quote',
                    })}
                  </blockquote>
                </div>
              </div>
            </div>

            {/* Philosophy Section */}
            <div className={styles.sectionBlock}>
              <h2 className={styles.blockTitle}>
                <Icon icon="ri:lightbulb-line" className={styles.blockIcon} />
                {translate({
                  message: '我的理念',
                  id: 'about.philosophy.title',
                })}
              </h2>
              <div className={styles.contentBlock}>
                <p>
                  {translate({
                    message: '技术文档不只是写说明书，更是连接产品与用户的重要环节。好的文档能让复杂的技术变得易懂，帮助用户快速上手。',
                    id: 'about.philosophy.paragraph1',
                  })}
                </p>
                <p>
                  {translate({
                    message: '现实中很多技术内容写得晦涩难懂，反而成了用户学习的障碍。我希望通过自己的工作，让知识真正流动起来，发挥应有的价值。',
                    id: 'about.philosophy.paragraph2',
                  })}
                </p>
              </div>
            </div>

            {/* Work Style Section */}
            <div className={styles.sectionBlock}>
              <h2 className={styles.blockTitle}>
                <Icon icon="ri:star-line" className={styles.blockIcon} />
                {translate({
                  message: '我的工作方式',
                  id: 'about.work.title',
                })}
              </h2>
              <div className={styles.workGrid}>
                <div className={styles.workItem}>
                  <div className={styles.workIconWrapper}>
                    <Icon icon="ri:team-line" />
                  </div>
                  <div>
                    <h3>{translate({ message: '协作挖掘', id: 'about.work.feature1.title' })}</h3>
                    <p>{translate({ message: '和产品团队深入沟通，了解功能的使用场景和业务价值，让内容不仅说明"怎么做"，更传达"为什么"。', id: 'about.work.feature1.description' })}</p>
                  </div>
                </div>
                
                <div className={styles.workItem}>
                  <div className={styles.workIconWrapper}>
                    <Icon icon="ri:code-box-line" />
                  </div>
                  <div>
                    <h3>{translate({ message: '技术转译', id: 'about.work.feature2.title' })}</h3>
                    <p>{translate({ message: '把复杂的技术概念用简单易懂的方式表达出来，让技术不再难懂。', id: 'about.work.feature2.description' })}</p>
                  </div>
                </div>

                <div className={styles.workItem}>
                  <div className={styles.workIconWrapper}>
                    <Icon icon="ri:lightbulb-flash-line" />
                  </div>
                  <div>
                    <h3>{translate({ message: '生动案例', id: 'about.work.feature3.title' })}</h3>
                    <p>{translate({ message: '通过具体例子帮助用户理解产品功能，让抽象概念变得具体。', id: 'about.work.feature3.description' })}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Life Section */}
            <div className={styles.sectionBlock}>
              <h2 className={styles.blockTitle}>
                <Icon icon="ri:cup-line" className={styles.blockIcon} />
                {translate({
                  message: '工作之外',
                  id: 'about.life.title',
                })}
              </h2>
              <div className={styles.lifeGrid}>
                <div className={styles.lifeItem}>
                  <Icon icon="ri:bike-fill" className={styles.lifeIcon} />
                  <span>
                    {translate({
                      message: '骑行爱好者',
                      id: 'about.life.hobby1.title',
                    })}
                  </span>
                </div>
                <div className={styles.lifeItem}>
                  <Icon icon="ri:terminal-box-fill" className={styles.lifeIcon} />
                  <span>
                    {translate({
                      message: '技术探索者',
                      id: 'about.life.hobby2.title',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div id="comments" className={styles.commentSection}>
          <Comment />
        </div>
      </div>
    </Layout>
  )
}
