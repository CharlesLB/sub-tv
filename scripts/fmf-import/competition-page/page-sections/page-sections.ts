import { decodeHtmlText } from '../../html-text/html-text'

const CREST_FILE_PATTERN = /\/([^/\\]+)\.(?:png|jpe?g|gif)$/i
const NUMBERED_CREST_PREFIX = /^foto_logo_/i

export type PhasePane = { name: string; html: string }

export type CrestReference = { crestId: string; crestFileName: string }

export type TeamReference = CrestReference & { shortName: string }

export const sliceBetween = (html: string, startMarker: string, endMarker: string | null): string => {
  const start = html.indexOf(startMarker)
  if (start < 0) return ''
  const end = endMarker === null ? -1 : html.indexOf(endMarker, start + startMarker.length)

  return end < 0 ? html.slice(start) : html.slice(start, end)
}

const escapeForPattern = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const splitPhasePanes = (sectionHtml: string, paneIdPrefix: string): PhasePane[] => {
  const prefixPattern = escapeForPattern(paneIdPrefix)
  const tabPattern = new RegExp(`<a href="#(${prefixPattern}\\d+-\\d+)"[^>]*>([^<]*)</a>`, 'g')
  const tabs = [...sectionHtml.matchAll(tabPattern)].map((match) => ({ paneId: match[1] ?? '', name: decodeHtmlText(match[2] ?? '') }))
  const paneStarts = tabs.map((tab) => ({ ...tab, start: sectionHtml.indexOf(`id="${tab.paneId}"`) })).filter((tab) => tab.start >= 0)

  return paneStarts.map((tab, index) => ({
    name: tab.name,
    html: sectionHtml.slice(tab.start, paneStarts[index + 1]?.start ?? sectionHtml.length),
  }))
}

export const readCrestReference = (imageSource: string): CrestReference | null => {
  const match = CREST_FILE_PATTERN.exec(imageSource.trim())
  if (!match?.[1]) return null
  const fileName = imageSource.trim().split('/').at(-1) ?? ''

  return { crestId: match[1].replace(NUMBERED_CREST_PREFIX, ''), crestFileName: fileName }
}
