import { buildCompetitionPageUrl, EDITION_SELECT_NAME } from '../constants/fmf-sources'
import { parseHtml, textOf } from '../html-text/html-text'
import { type CookieJar, createCookieJar, decodeUtf8, requestFmf } from '../http-client/http-client'
import { pageRelativePath, readStoredFile, storeFile } from '../raw-storage/raw-storage'

const HIDDEN_FIELD_NAMES = ['__VIEWSTATE', '__VIEWSTATEGENERATOR', '__EVENTVALIDATION', '__LASTFOCUS'] as const
const EVENT_TARGET_FIELD = '__EVENTTARGET'
const EVENT_ARGUMENT_FIELD = '__EVENTARGUMENT'

export type EditionOption = { editionId: number; label: string; isSelected: boolean }

export type EditionPageFile = { pageId: number; editionId: number; relativePath: string }

type LandingPage = { html: string; cookieJar: CookieJar }

export const readEditionOptions = (html: string): EditionOption[] =>
  parseHtml(html)
    .querySelectorAll(`select[name="${EDITION_SELECT_NAME}"] option`)
    .map((option) => ({
      editionId: Number(option.getAttribute('value') ?? ''),
      label: textOf(option),
      isSelected: option.hasAttribute('selected'),
    }))
    .filter((option) => Number.isInteger(option.editionId) && option.editionId > 0)

const readHiddenFields = (html: string): URLSearchParams => {
  const document = parseHtml(html)

  return new URLSearchParams(HIDDEN_FIELD_NAMES.map((fieldName): [string, string] => [fieldName, document.querySelector(`input[name="${fieldName}"]`)?.getAttribute('value') ?? '']))
}

const fetchLandingPage = async (pageId: number): Promise<LandingPage> => {
  const cookieJar = createCookieJar()
  const result = await requestFmf({ url: buildCompetitionPageUrl(pageId), cookieJar })
  if (!result.found) throw new Error(`página da competição d=${pageId} respondeu ${result.status}`)

  return { html: decodeUtf8(result.body), cookieJar }
}

const fetchEditionByPostback = async (pageId: number, landing: LandingPage, editionId: number): Promise<Uint8Array> => {
  const form = readHiddenFields(landing.html)
  form.set(EVENT_TARGET_FIELD, EDITION_SELECT_NAME)
  form.set(EVENT_ARGUMENT_FIELD, '')
  form.set(EDITION_SELECT_NAME, String(editionId))
  const result = await requestFmf({ url: buildCompetitionPageUrl(pageId), form, cookieJar: landing.cookieJar })
  if (!result.found) throw new Error(`edição ${editionId} de d=${pageId} respondeu ${result.status}`)

  return result.body
}

const downloadEdition = async (pageId: number, landing: LandingPage, option: EditionOption, shouldRefresh: boolean): Promise<EditionPageFile> => {
  const relativePath = pageRelativePath(pageId, option.editionId)
  const cached = shouldRefresh ? null : await readStoredFile(relativePath)

  if (!cached) {
    const body = option.isSelected ? new TextEncoder().encode(landing.html) : await fetchEditionByPostback(pageId, landing, option.editionId)
    await storeFile(relativePath, body)
  }

  return { pageId, editionId: option.editionId, relativePath }
}

export type EditionSelection = { refresh: boolean; selectEdition: (option: EditionOption) => boolean }

export const downloadEditionPages = async (pageId: number, selection: EditionSelection): Promise<EditionPageFile[]> => {
  const shouldRefresh = selection.refresh
  const landing = await fetchLandingPage(pageId)
  const options = readEditionOptions(landing.html).filter(selection.selectEdition)
  console.info(`d=${pageId}: ${options.length} edições (${options.map((option) => option.label).join(' | ')})`)

  return await options.reduce<Promise<EditionPageFile[]>>(async (previous, option) => [...(await previous), await downloadEdition(pageId, landing, option, shouldRefresh)], Promise.resolve([]))
}
