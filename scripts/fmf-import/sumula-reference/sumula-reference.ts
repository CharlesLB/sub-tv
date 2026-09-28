// eslint-disable-next-line security/detect-unsafe-regex -- dois grupos opcionais em sequência, sem quantificador aninhado; casa nomes de arquivo da FMF
const SUMULA_FILE_PATTERN = /Sumula_Jogo_(\d+)(?:_F\d+)?(?:_(\d+))?\.pdf$/i
const PATH_SEPARATOR_PATTERN = /[/\\]/

export type SumulaReference = { url: string; fileName: string; fmfMatchId: number; revision: number }

export const readSumulaReference = (url: string): SumulaReference | null => {
  const fileName = url.split(PATH_SEPARATOR_PATTERN).at(-1) ?? ''
  const match = SUMULA_FILE_PATTERN.exec(fileName)
  if (!match) return null

  return { url, fileName, fmfMatchId: Number(match[1]), revision: match[2] === undefined ? 0 : Number(match[2]) }
}
