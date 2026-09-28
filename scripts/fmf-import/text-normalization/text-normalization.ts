const DIACRITIC_PATTERN = /\p{Diacritic}/gu
const NON_ALPHANUMERIC_PATTERN = /[^a-z0-9]+/g

export const normalizeName = (text: string): string =>
  text.normalize('NFD').replace(DIACRITIC_PATTERN, '').toLowerCase().replace(NON_ALPHANUMERIC_PATTERN, ' ').trim()

export const nameTokens = (text: string): Set<string> => new Set(normalizeName(text).split(' ').filter((token) => token.length > 0))

export const tokenSimilarity = (first: string, second: string): number => {
  const firstTokens = nameTokens(first)
  const secondTokens = nameTokens(second)
  const sharedCount = [...firstTokens].filter((token) => secondTokens.has(token)).length
  const unionCount = new Set([...firstTokens, ...secondTokens]).size

  return unionCount === 0 ? 0 : sharedCount / unionCount
}

const LOWERCASE_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e'])
const ROMAN_NUMERAL_PATTERN = /^(?=[ivxlc]{2,})x{0,3}(ix|iv|v?i{0,3})$/
const UPPERCASE_WORD_PATTERN = /\./
const CLUB_ACRONYMS = new Set(['sc', 'ec', 'fc', 'ac', 'aa', 'se', 'ca', 'ce', 'cr', 'sl', 'saf', 'to'])

const capitalizeWord = (word: string, index: number): string => {
  if (index > 0 && LOWERCASE_WORDS.has(word)) return word
  if (ROMAN_NUMERAL_PATTERN.test(word) || UPPERCASE_WORD_PATTERN.test(word) || CLUB_ACRONYMS.has(word)) return word.toLocaleUpperCase('pt-BR')

  return word.charAt(0).toLocaleUpperCase('pt-BR') + word.slice(1)
}

export const toTitleCase = (text: string): string =>
  text
    .toLocaleLowerCase('pt-BR')
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(capitalizeWord)
    .join(' ')

const significantTokens = (text: string): string[] =>
  normalizeName(text)
    .split(' ')
    .filter((token) => token.length > 0 && !LOWERCASE_WORDS.has(token))

const tokensMatch = (first: string, second: string): boolean =>
  first === second || (first.length === 1 && second.startsWith(first)) || (second.length === 1 && first.startsWith(second))

const isOrderedSubsequence = (shorter: string[], longer: string[]): boolean =>
  shorter.reduce<number>((searchFrom, token) => {
    if (searchFrom < 0) return searchFrom
    const foundAt = longer.findIndex((candidate, index) => index >= searchFrom && tokensMatch(token, candidate))

    return foundAt < 0 ? -1 : foundAt + 1
  }, 0) >= 0

export const areNamesCompatible = (first: string, second: string): boolean => {
  const firstTokens = significantTokens(first)
  const secondTokens = significantTokens(second)
  if (firstTokens.length === 0 || secondTokens.length === 0) return false
  if (firstTokens.join(' ') === secondTokens.join(' ')) return true
  if (firstTokens[0] !== secondTokens[0] || !tokensMatch(firstTokens.at(-1) ?? '', secondTokens.at(-1) ?? '')) return false
  const [shorter, longer] = firstTokens.length <= secondTokens.length ? [firstTokens, secondTokens] : [secondTokens, firstTokens]

  return isOrderedSubsequence(shorter, longer)
}

const DIGIT_PATTERN = /\d/
const MISREAD_LETTER_O_PATTERN = /^(\p{L}+)0(\p{L}+)$/u
const LETTERS_THEN_DIGITS_PATTERN = /^(\p{L}{3,})\d+$/u
const PUNCTUATION_ONLY_PATTERN = /^[^\p{L}]+$/u

const sanitizeNameToken = (token: string): string => {
  const misread = MISREAD_LETTER_O_PATTERN.exec(token)
  if (misread) return `${misread[1]}o${misread[2]}`
  if (!DIGIT_PATTERN.test(token)) return token

  return LETTERS_THEN_DIGITS_PATTERN.exec(token)?.[1] ?? ''
}

export const sanitizePersonName = (text: string): string =>
  text
    .split(/\s+/)
    .map(sanitizeNameToken)
    .filter((token) => token.length > 0 && !PUNCTUATION_ONLY_PATTERN.test(token))
    .join(' ')

export const hasDigits = (text: string | null): boolean => text !== null && DIGIT_PATTERN.test(text)

const DOCUMENT_LIKE_PATTERN = /\d[\d./-]{5,}\d|\d{1,2}\/\d{1,2}\/\d{1,4}/g
const REDACTED_DOCUMENT = '[removido]'

export const redactDocuments = (text: string): string => text.replace(DOCUMENT_LIKE_PATTERN, REDACTED_DOCUMENT)
