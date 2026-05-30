export function resolveAssetUrl(url?: string) {
  if (!url) return ''

  if (
    url.startsWith('http') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url
  }

  if (url.startsWith('/')) {
    return `${import.meta.env.BASE_URL}${url.slice(1)}`
  }

  return `${import.meta.env.BASE_URL}${url}`
}