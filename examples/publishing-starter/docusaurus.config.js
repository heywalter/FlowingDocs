module.exports = {
  title: 'MySQL operations guide',
  url: 'https://example.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: {
    format: 'detect',
    hooks: { onBrokenMarkdownLinks: 'throw', onBrokenMarkdownImages: 'throw' },
  },
  presets: [['classic', {
    docs: { routeBasePath: '/', sidebarPath: './sidebars.js' },
    blog: false,
    theme: { customCss: './src/css/custom.css' },
  }]],
  themeConfig: {
    navbar: { title: 'MySQL operations guide', items: [{ to: '/', label: 'Guide', position: 'left' }] },
  },
}
