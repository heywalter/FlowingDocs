#!/usr/bin/env node
/**
 * 拉取首页用到的远程原图，生成 WebP 缩略图到 static/img/thumbs/。
 * 首页组件（BlogSection / ProjectSection）使用这些缩略图，详情页仍使用原图。
 * 原图是唯一源，缩略图属于构建产物（已加入 .gitignore）。
 *
 * 数据源：
 *  - blog / i18n/en/docusaurus-plugin-content-blog 博客 frontmatter 的 image
 *  - data/showcase.tsx 的 preview
 *
 * 用法：node scripts/generate-thumbnails.mjs
 */
import { mkdir, readdir, readFile, stat } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BLOG_DIRS = ['blog', join('i18n', 'en', 'docusaurus-plugin-content-blog')]
const SHOWCASE_FILE = join(ROOT, 'data', 'showcase.tsx')
const OUTPUT_DIR = join(ROOT, 'static', 'img', 'thumbs')
const THUMB_WIDTH = 640
const THUMB_QUALITY = 80

// URL pathname 最后一个文件名去掉扩展名，作为缩略图文件名（与 src/lib/thumbnails.ts 保持一致）
function stemFor(url) {
  try {
    const pathname = new URL(url).pathname
    return basename(pathname).replace(/\.[^.]+$/, '')
  }
  catch {
    return ''
  }
}

function thumbPathFor(url) {
  return join(OUTPUT_DIR, `${stemFor(url)}.webp`)
}

async function collectBlogImages() {
  const urls = new Set()
  for (const dir of BLOG_DIRS) {
    const abs = join(ROOT, dir)
    let files
    try {
      files = await readdir(abs)
    }
    catch {
      continue
    }
    for (const file of files) {
      if (!/\.(md|mdx)$/.test(file)) continue
      const content = await readFile(join(abs, file), 'utf8')
      const match = content.match(/^image:\s*(.+)$/m)
      if (!match) continue
      const value = match[1].trim().replace(/^['"]|['"]$/g, '')
      if (/^https?:\/\//.test(value)) urls.add(value)
    }
  }
  return urls
}

async function collectShowcaseImages() {
  const urls = new Set()
  let content
  try {
    content = await readFile(SHOWCASE_FILE, 'utf8')
  }
  catch {
    return urls
  }
  const re = /preview:\s*['"]([^'"]+)['"]/g
  let match
  while ((match = re.exec(content))) {
    if (/^https?:\/\//.test(match[1])) urls.add(match[1])
  }
  return urls
}

async function main() {
  const urls = new Set([
    ...(await collectBlogImages()),
    ...(await collectShowcaseImages()),
  ])

  if (urls.size === 0) {
    console.log('[thumbs] 未发现远程图片，跳过')
    return
  }

  await mkdir(OUTPUT_DIR, { recursive: true })
  let generated = 0

  for (const url of urls) {
    const stem = stemFor(url)
    if (!stem) {
      console.warn(`  ⚠ 跳过无法解析的 URL: ${url}`)
      continue
    }
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      const out = thumbPathFor(url)
      await sharp(buffer)
        .resize({ width: THUMB_WIDTH })
        .webp({ quality: THUMB_QUALITY })
        .toFile(out)
      const { size } = await stat(out)
      console.log(`  ✓ ${stem} → ${Math.round(size / 1024)} KB`)
      generated += 1
    }
    catch (err) {
      // 缩略图是可选优化项，缺失时首页会回退到原图，因此不阻断构建
      console.warn(`  ⚠ 跳过 ${url}: ${err.message}`)
    }
  }

  console.log(`[thumbs] 已生成 ${generated}/${urls.size} 张缩略图`)
}

main()
