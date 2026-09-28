import path from 'node:path'

const PUBLIC_FOLDER = 'public'
const CREST_FOLDER = 'crests'
const CREST_EXTENSION = '.png'
const NON_ALPHANUMERIC_RUN = /[^a-z0-9]+/g
const EDGE_HYPHENS = /^-+|-+$/g
const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

export const crestFileNameOf = (crestId: string): string => {
  const slug = crestId.toLowerCase().replace(NON_ALPHANUMERIC_RUN, '-').replace(EDGE_HYPHENS, '')
  if (slug.length === 0) throw new Error(`ID de escudo sem caracteres utilizáveis: "${crestId}"`)

  return `${slug}${CREST_EXTENSION}`
}

export const crestDiskPathOf = (fileName: string): string => path.join(PUBLIC_FOLDER, CREST_FOLDER, fileName)

export const crestPublicPathOf = (fileName: string): string => `/${CREST_FOLDER}/${fileName}`

export const isPngImage = (body: Uint8Array): boolean => PNG_SIGNATURE.every((byte, index) => body[index] === byte)
