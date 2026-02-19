import type * as Preset from '@docusaurus/preset-classic'
import type { Config } from '@docusaurus/types'
import { themes } from 'prism-react-renderer'
import social from './data/social'
import type { GiscusConfig } from './src/components/Comment'

// Helper functions for i18n support
function getSiteTitle() {
  switch (process.env.DOCUSAURUS_CURRENT_LOCALE) {
    case 'en':
      return 'Flowing Docs'
    default:
      return '知流小记'
  }
}

function getSiteTagline() {
  switch (process.env.DOCUSAURUS_CURRENT_LOCALE) {
    case 'en':
      return 'Technical documentation and knowledge sharing'
    default:
      return '技术文档与知识分享'
  }
}

function getSiteBio() {
  switch (process.env.DOCUSAURUS_CURRENT_LOCALE) {
    case 'en':
      return 'Technical Documentation Engineer'
    default:
      return '技术内容创作者'
  }
}

function getSiteDescription() {
  switch (process.env.DOCUSAURUS_CURRENT_LOCALE) {
    case 'en':
      return 'Personal blog about technical documentation, content design, and user experience optimization.'
    default:
      return '关于技术文档、内容设计和用户体验优化的个人博客。'
  }
}

function getMetaDescription() {
  switch (process.env.DOCUSAURUS_CURRENT_LOCALE) {
    case 'en':
      return 'Technical documentation engineer sharing content development and user experience practices.'
    default:
      return '技术内容创作者分享内容开发与用户体验实践。'
  }
}

function getBlogDescription() {
  switch (process.env.DOCUSAURUS_CURRENT_LOCALE) {
    case 'en':
      return 'Exploring technical communication, sharing practices in technical writing, user experience, and knowledge dissemination.'
    default:
      return '探索技术传播，分享技术写作、用户体验与知识传播实践。'
  }
}

function getBlogSidebarTitle() {
  switch (process.env.DOCUSAURUS_CURRENT_LOCALE) {
    case 'en':
      return 'Recent Posts'
    default:
      return '最近文章'
  }
}

const config: Config = {
  title: getSiteTitle(), // Site title, shown in the browser tab and elsewhere
  tagline: getSiteTagline(),
  titleDelimiter: '-', // Delimiter used in the page title
  url: 'https://flowingdocs.com/', // Primary domain for your site
  baseUrl: '/', // Base path where the site is served
  favicon: 'img/favicon.ico', // Path to the favicon
  organizationName: 'heywalter', // GitHub org or username
  projectName: 'flowingdocs', // Project name (used in some URLs)
  customFields: {
    // Custom fields you want to expose
    bio: getSiteBio(),
    description: getSiteDescription(),
  },

  themeConfig: {
    // Main theme configuration
    image: 'img/logo.webp', // Default social share image
    metadata: [ // Keywords for SEO
      {
        name: 'keywords',
        content: [
          'technical documentation engineering',
          'API documentation design',
          'developer experience optimization',
          'AI-powered technical writing',
          'open source documentation systems',
          'docs-as-code',
          'user experience writing',
          'technical communication',
          'Flowing Docs',
        ].join(', '),
      },
      {
        name: 'keywords',
        content: [
          '技术文档工程化',
          'API 文档设计',
          '开发者体验优化',
          'AI 技术写作',
          '开源文档系统',
          '文档即代码',
          '用户体验写作',
          '技术传播',
          '知流小记',
        ].join(', '),
      },
    ],
    docs: {
      sidebar: {
        hideable: true, // Allows the docs sidebar to be collapsible
      },
    },
    navbar: {
      logo: {
        alt: 'Flowing Docs', // Alt text for the logo
        src: 'img/logo.webp',
        srcDark: 'img/logo-dark.webp', // Logo for dark mode
      },
      hideOnScroll: true, // Hides the navbar while scrolling down
      items: [
        { label: '博客', position: 'left', to: 'blog' },
        { label: '技术写作', position: 'left', to: 'docs' },
        { label: '项目案例', position: 'left', to: 'showcase' },
        {
          label: '更多',
          position: 'right',
          items: [
            { label: '关于我', to: 'about' },
            { label: '归档', to: 'blog/archive' },
          ],
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark', // Dark footer theme
      links: [
        {
          title: '学习',
          items: [
            { label: '博客', to: 'blog' },
            { label: '技术写作', to: 'docs' },
            { label: '实战项目', to: 'showcase' },
            { label: '归档', to: 'blog/archive' },
          ],
        },
        {
          title: '社交媒体',
          items: [
            { label: '关于我', to: '/about' },
            { label: 'GitHub', href: social.github.href },
            { label: '邮箱', href: social.email.href },
            { label: 'Discord', href: social.discord.href },
          ],
        },
        {
          title: '更多',
          items: [
            // { label: '友链', to: 'friends' }, // 暂时隐藏友链
            {
              html: `
                <a href="https://docusaurus.io" target="_blank" rel="noreferrer noopener">
                  <img src="/img/buildwith.png" alt="build with docusaurus" width="120" height="50"/>
                </a>
                `,
            },
          ],
        },
      ],
      copyright: `Copyright © 2026 - ${new Date().getFullYear()} Walter | Built with Docusaurus | <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 2px;">CC BY-NC 4.0</a>`,
    },
    algolia: {
      appId: 'GV6YN1111111ODMO', // Algolia application ID
      apiKey: '50303937b0e4630bec4a20a14e3b7872', // Public search API key
      indexName: 'walter', // Algolia index name
    },
    prism: {
      theme: themes.oneLight, // Light code-block theme
      darkTheme: themes.oneDark, // Dark code-block theme
      additionalLanguages: ['bash', 'json', 'java', 'python', 'php', 'graphql', 'rust', 'toml', 'protobuf', 'diff'],
      defaultLanguage: 'javascript',
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line', // Highlights the next line
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'This will error', // Highlights the error line
        },
      ],
    },
    giscus: {
      repo: 'heywalter/FlowingDocs', // GitHub repo for Giscus
      repoId: 'R_kgDOQ3IAyQ',
      category: 'General',
      categoryId: 'DIC_kwDOQ3IAyc4C02fd',
      theme: 'light',
      darkTheme: 'dark_dimmed',
    } satisfies Partial<GiscusConfig>,
    tableOfContents: {
      minHeadingLevel: 2, // TOC starts from <h2>
      maxHeadingLevel: 4, // TOC ends at <h4>
    },
    liveCodeBlock: {
      playgroundPosition: 'top', // Positions the live editor above the code
    },
    zoom: {
      selector: '.markdown :not(em) > img', // Enables zooming for images in Markdown
      background: {
        light: 'rgb(255, 255, 255)', // Light mode overlay color
        dark: 'rgb(50, 50, 50)', // Dark mode overlay color
      },
    },
  } satisfies Preset.ThemeConfig,

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs', // Docs markdown directory
          sidebarPath: 'sidebars.ts', // Sidebar config for docs
        },
        blog: false, // Disables the default blog
        theme: {
          customCss: ['./src/css/custom.css', './src/css/tweet-theme.css'], // Global CSS
        },
        sitemap: {
          priority: 0.5, // Default priority for sitemap
        },
        gtag: {
          trackingID: 'G-TW8Q38798D', // Google Analytics Measurement ID
          anonymizeIP: true, // Masks IP addresses in analytics
        },
        debug: process.env.NODE_ENV === 'development', // Enables debug mode in development
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    'docusaurus-plugin-image-zoom', // Adds zoom functionality for images in Markdown
    '@docusaurus/plugin-ideal-image', // Generates responsive images for multiple screen sizes
    [
      '@docusaurus/plugin-pwa', // Enables Progressive Web App features
      {
        debug: process.env.NODE_ENV === 'development',
        offlineModeActivationStrategies: ['appInstalled', 'standalone', 'queryString'],
        pwaHead: [
          { tagName: 'link', rel: 'icon', href: '/img/logo.png' },
          { tagName: 'link', rel: 'manifest', href: '/manifest.json' },
          { tagName: 'meta', name: 'theme-color', content: '#12affa' },
        ],
      },
    ],
    [
      './src/plugin/plugin-content-blog', // Custom blog plugin
      {
        path: 'blog',
        editUrl: ({ locale, blogDirPath, blogPath, permalink }) =>
          `https://github.com/heywalter/flowingdocs/edit/main/${blogDirPath}/${blogPath}`, // "Edit this page" link
        editLocalizedFiles: false,
        blogDescription: getBlogDescription(),
        blogSidebarCount: 10, // Number of recent posts in the sidebar
        blogSidebarTitle: getBlogSidebarTitle(),
        postsPerPage: 10,
        showReadingTime: true,
        readingTime: ({ content, frontMatter, defaultReadingTime }) =>
          defaultReadingTime({ content, options: { wordsPerMinute: 300 } }),
        feedOptions: {
          type: 'all',
          title: 'Walter',
          description: 'feedId:41215011978385457+userId:41840354283324416',
          copyright: `Copyright © ${new Date().getFullYear()} Walter Built with Docusaurus.`,
        },
      },
    ],
    async function tailwindcssPlugin() {
      return {
        name: 'docusaurus-tailwindcss', // Integrates Tailwind CSS via PostCSS
        configurePostCss(postcssOptions) {
          postcssOptions.plugins.push(require('tailwindcss'))
          postcssOptions.plugins.push(require('autoprefixer'))
          return postcssOptions
        },
      }
    },
    async function injectMotto() {
      // Injects a custom motto comment into the HTML
      return {
        name: 'docusaurus-motto',
        injectHtmlTags() {
          return {
            headTags: [
              {
                tagName: 'script',
                innerHTML: `
                  (${function () {
                    // HTML comment with brand details
                    const motto = `
      This site is built with ❤️ using Docusaurus.
      Authored by Walter, a Technical Documentation Engineer.
      --------
      MISSION: Transform complex technology into flowing knowledge.
      --------
      GitHub: https://github.com/heywalter/flowingdocs
      --------
      "Documentation's purpose is to let knowledge flow freely." — Walter
      `;
                    if (document.firstChild?.nodeType !== Node.COMMENT_NODE) {
                      document.prepend(document.createComment(motto));
                    }
                  }.toString()})();`,
              },
            ],
          }
        },
      }
    },
  ],

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: getMetaDescription(),
      },
    },
  ],

  stylesheets: [
    // External fonts
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Normal.min.css',
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Medium.min.css',
    'https://cdn.jsdelivr.net/npm/misans@4.0.0/lib/Normal/MiSans-Semibold.min.css',
  ],

  i18n: {
    defaultLocale: 'zh-Hans', // Default site locale
    locales: ['zh-Hans', 'en'], // Supported locales
    localeConfigs: {
      'en': {
        label: 'English',
      },
      'zh-Hans': {
        label: '简体中文',
      },
    },
  },
  onBrokenLinks: 'warn', // Logs a warning on broken links instead of throwing an error
}

export default config
