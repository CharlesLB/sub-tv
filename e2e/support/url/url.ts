type UrlPredicate = (url: URL) => boolean

const pathAndQueryOf = (url: URL): string => `${url.pathname}${url.search}`

export const urlContaining =
  (fragment: string): UrlPredicate =>
  (url) =>
    decodeURIComponent(pathAndQueryOf(url)).includes(fragment)

export const urlEndingWith =
  (suffix: string): UrlPredicate =>
  (url) =>
    pathAndQueryOf(url).endsWith(suffix)
