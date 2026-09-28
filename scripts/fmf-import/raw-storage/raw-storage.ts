import { createHash } from 'node:crypto'
import { access, mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const PAGES_FOLDER = 'pages'
const SUMULAS_FOLDER = 'sumulas'
const MISSING_SUFFIX = '.missing'
const PAGE_EXTENSION = '.html'
const PAGE_FILE_PATTERN = /^(\d+)-(\d+)\.html$/

export type RawStorageLocation = { rootDirectory: string; blobUrlPrefix: string }

export const LOCAL_RAW_STORAGE: RawStorageLocation = { rootDirectory: path.join('.data', 'raw', 'fmf'), blobUrlPrefix: 'file://.data/raw/fmf/' }

export const TEMPORARY_RAW_STORAGE: RawStorageLocation = { rootDirectory: path.join('/tmp', 'fmf-raw'), blobUrlPrefix: 'tmp://fmf-raw/' }

const activeStorage: { location: RawStorageLocation } = { location: LOCAL_RAW_STORAGE }

export const selectRawStorage = (location: RawStorageLocation): void => {
  activeStorage.location = location
}

export type StoredPage = { pageId: number; editionId: number; relativePath: string }

const pagesFolder = (): string => path.join(activeStorage.location.rootDirectory, PAGES_FOLDER)

export const pageRelativePath = (pageId: number, editionId: number): string => path.join(pagesFolder(), `${pageId}-${editionId}${PAGE_EXTENSION}`)

export const sumulaRelativePath = (fileName: string): string => path.join(activeStorage.location.rootDirectory, SUMULAS_FOLDER, fileName)

const missingMarkerPath = (relativePath: string): string => `${relativePath}${MISSING_SUFFIX}`

const fileExists = async (relativePath: string): Promise<boolean> =>
  await access(relativePath).then(
    () => true,
    () => false,
  )

export const readStoredFile = async (relativePath: string): Promise<Uint8Array | null> => ((await fileExists(relativePath)) ? new Uint8Array(await readFile(relativePath)) : null)

export const isMarkedMissing = async (relativePath: string): Promise<boolean> => await fileExists(missingMarkerPath(relativePath))

export const storeFile = async (relativePath: string, body: Uint8Array): Promise<void> => {
  await mkdir(path.dirname(relativePath), { recursive: true })
  await writeFile(relativePath, body)
}

export const markMissing = async (relativePath: string): Promise<void> => await storeFile(missingMarkerPath(relativePath), new Uint8Array())

export const listStoredPages = async (): Promise<StoredPage[]> => {
  const fileNames = (await fileExists(pagesFolder())) ? await readdir(pagesFolder()) : []

  return fileNames.flatMap((fileName) => {
    const match = PAGE_FILE_PATTERN.exec(fileName)
    if (!match) return []

    return [{ pageId: Number(match[1]), editionId: Number(match[2]), relativePath: path.join(pagesFolder(), fileName) }]
  })
}

export const computeSha256 = (body: Uint8Array): string => createHash('sha256').update(body).digest('hex')

export const toBlobUrl = (relativePath: string): string => `${activeStorage.location.blobUrlPrefix}${path.relative(activeStorage.location.rootDirectory, relativePath).split(path.sep).join('/')}`
