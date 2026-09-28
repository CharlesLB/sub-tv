import { normalizeName, toTitleCase } from '../text-normalization/text-normalization'

const CLUB_SUFFIX_PATTERN = /[\s\-–.]*(\bS\.?\s?A\.?\s?F\.?|\bSAF|\bE\.?\s?C\.?|\bF\.?\s?C\.?|\bLTDA|\bESPORTE CLUBE|\bFUTEBOL CLUBE|\([^)]*\))\.?\s*$/i
const ABBREVIATION_LENGTH = 3
const ABBREVIATION_FILLER = 'X'
const MINOR_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'sc', 'ec', 'fc', 'ac', 'aa', 'se', 'ca', 'ce', 'cr'])

const DISPLAY_NAME_OVERRIDES: Readonly<Record<string, string>> = {
  america: 'América',
  'america to': 'América TO',
  atletico: 'Atlético',
  'nac muriae': 'Nacional de Muriaé',
  'sao joao del rei': 'São João del-Rei',
}

const CLUB_PALETTE = [
  '#E63946',
  '#F4A261',
  '#E9C46A',
  '#2A9D8F',
  '#264653',
  '#457B9D',
  '#1D3557',
  '#8338EC',
  '#FF006E',
  '#3A86FF',
  '#FB5607',
  '#06D6A0',
  '#118AB2',
  '#EF476F',
  '#7209B7',
  '#2B9348',
] as const

const stripSuffixes = (name: string): string => {
  const stripped = name.replace(CLUB_SUFFIX_PATTERN, '').trim()

  return stripped === name || stripped.length === 0 ? name : stripSuffixes(stripped)
}

const restoreAccents = (baseName: string, officialName: string | null): string => {
  const accentedWords = new Map(
    (officialName ?? '')
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word): [string, string] => [normalizeName(word), word]),
  )

  return baseName
    .split(/\s+/)
    .map((word) => accentedWords.get(normalizeName(word)) ?? word)
    .join(' ')
}

export const deriveDisplayName = (shortName: string, officialName: string | null): string => {
  const baseName = stripSuffixes(shortName.trim())

  return DISPLAY_NAME_OVERRIDES[normalizeName(baseName)] ?? toTitleCase(restoreAccents(baseName, officialName))
}

export const deriveAbbreviation = (displayName: string): string => {
  const words = normalizeName(displayName)
    .split(' ')
    .filter((word) => word.length > 0 && !MINOR_WORDS.has(word))
  const letters = words.join('').replace(/[^a-z]/g, '')
  const firstWord = (words[0] ?? '').replace(/[^a-z]/g, '')
  const source = firstWord.length >= ABBREVIATION_LENGTH ? firstWord : letters

  return source.slice(0, ABBREVIATION_LENGTH).toUpperCase().padEnd(ABBREVIATION_LENGTH, ABBREVIATION_FILLER)
}

const hashText = (text: string): number => [...text].reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 7)

export const deriveClubColor = (crestId: string): string => CLUB_PALETTE[hashText(crestId) % CLUB_PALETTE.length] ?? CLUB_PALETTE[0]
