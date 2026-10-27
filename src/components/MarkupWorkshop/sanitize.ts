import DOMPurify from 'dompurify'
import { panelImage } from './course'

export function sanitizePreview(html: string) {
  const clean = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'form', 'button', 'textarea', 'select', 'iframe', 'audio', 'video'],
    FORBID_ATTR: ['style', 'srcset'],
  })
  const root = document.createElement('div')
  root.innerHTML = clean
  root.querySelectorAll('[id]').forEach(el => el.id = 'markup-preview-' + el.id)
  root.querySelectorAll('[name]').forEach(el => el.removeAttribute('name'))
  root.querySelectorAll('img').forEach((el) => {
    if (el.getAttribute('src') !== panelImage) el.replaceWith(document.createTextNode('[' + (el.alt || 'image') + ']'))
  })
  root.querySelectorAll('a').forEach((el) => {
    const href = el.getAttribute('href') || ''
    if (href.startsWith('#')) el.setAttribute('href', '#markup-preview-' + href.slice(1))
    else if (/^https?:\/\//i.test(href) || href === panelImage) {
      el.target = '_blank'
      el.rel = 'noopener noreferrer'
    }
    else el.removeAttribute('href')
  })
  root.querySelectorAll('input').forEach((el) => {
    if (el.type !== 'checkbox') el.remove()
    else el.disabled = true
  })
  return root.innerHTML
}
