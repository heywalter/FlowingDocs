import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

// 记录用户在导航栏语言下拉里做出的显式选择。
// Netlify 的语言重定向优先采信 nf_lang cookie，其次才是 Accept-Language，
// 所以写下这个 cookie 后，static/_redirects 里的规则就不会再把用户拽回去。
//
// Docusaurus 的 LocaleDropdownNavbarItem 会把 htmlLang 透传到 <a> 的 lang 属性上，
// 因此 a[lang] 就是"语言切换链接"的可靠标识。
if (ExecutionEnvironment.canUseDOM) {
  document.addEventListener(
    'click',
    (event) => {
      const link = (event.target as Element | null)?.closest?.('a[lang]') as HTMLAnchorElement | null
      if (!link?.lang) {
        return
      }
      // 捕获阶段 + 同步写入，确保 cookie 在页面跳转发起前就已生效
      document.cookie = `nf_lang=${link.lang}; path=/; max-age=31536000; samesite=lax`
    },
    true,
  )
}
