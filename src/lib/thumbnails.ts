/**
 * 把远程原图 URL 映射到构建时生成的本地 WebP 缩略图路径。
 * 缩略图由 scripts/generate-thumbnails.mjs 在 prebuild 时生成到 static/img/thumbs/，
 * 规则：取 URL pathname 最后一个文件名去掉扩展名作为 stem。
 * 本地/相对路径或无法解析的 URL 原样返回，交由 <img> 的 onError 兜底。
 */
export function resolveThumbnail(image: string): string {
  if (!image || !/^https?:\/\//.test(image)) {
    return image
  }
  try {
    const pathname = new URL(image).pathname
    const stem = pathname.split('/').pop()?.replace(/\.[^.]+$/, '') ?? ''
    if (!stem) return image
    return `/img/thumbs/${stem}.webp`
  }
  catch {
    return image
  }
}
