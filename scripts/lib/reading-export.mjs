import { fromMarkdown } from 'mdast-util-from-markdown'
import { toMarkdown } from 'mdast-util-to-markdown'
import { gfm } from 'micromark-extension-gfm'
import { gfmFromMarkdown, gfmToMarkdown } from 'mdast-util-gfm'

export function parseMarkdown(body) {
  return fromMarkdown(body, { extensions: [gfm()], mdastExtensions: [gfmFromMarkdown()] })
}

export function cleanMarkdownForLLM(body, resolveUrl = url => url) {
  const tree = parseMarkdown(body)
  function clean(nodes) {
    return nodes.flatMap((node) => {
      // Code is an opaque leaf. Never remove imports, JSX, or example URLs inside it.
      if (node.type === 'code' || node.type === 'inlineCode') return [node]
      if (node.type === 'paragraph') {
        const raw = body.slice(node.position.start.offset, node.position.end.offset)
        if (/^import\s+(?:[\s\S]*?\s+from\s+)?['"][^'"\n]+['"];?\s*$/.test(raw)) return []
      }
      if (['link', 'image', 'definition'].includes(node.type)) node.url = resolveUrl(node.url)
      if (node.type === 'html') {
        node.value = node.value
          .replace(/<TabItem\b[^>]*\blabel="([^"]+)"[^>]*>/g, '<strong>$1</strong>\n')
          .replace(/<\/?[A-Z][A-Za-z0-9]*(?:\s[^>]*?)?\s*\/?>/g, '')
          .replace(/<\/?details(?:\s[^>]*)?>/gi, '')
          .replace(/<summary>([\s\S]*?)<\/summary>/gi, '<strong>$1</strong>\n')
          .replace(/\b(href|src)=(['"])([^'"]+)\2/g, (_, attr, quote, url) => `${attr}=${quote}${resolveUrl(url)}${quote}`)
        if (!node.value.trim()) return []
      }
      if (node.type === 'text') node.value = node.value.replace(/^:::([a-z]+)(?:[ \t]+([^\n]+))?$/gm, (_, kind, title) => title || kind).replace(/^:::$/gm, '')
      if (node.children) node.children = clean(node.children)
      return [node]
    })
  }
  tree.children = clean(tree.children)
  return toMarkdown(tree, { extensions: [gfmToMarkdown()], fences: true, bullet: '-', emphasis: '*', strong: '*' })
}
