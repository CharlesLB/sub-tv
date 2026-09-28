const MONTH_NUMBERS: Readonly<Record<string, number>> = {
  janeiro: 1,
  fevereiro: 2,
  março: 3,
  marco: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
}

const LONG_DATE_PATTERN = /(\d{1,2}) de ([a-zç]+) de (\d{4})/i
const SHORT_DATE_PATTERN = /(\d{2})\/(\d{2})\/(\d{4})/

const padTwoDigits = (value: number): string => String(value).padStart(2, '0')

const formatIsoDate = (year: number, month: number, day: number): string => `${year}-${padTwoDigits(month)}-${padTwoDigits(day)}`

export const parseLongPortugueseDate = (text: string): string | null => {
  const match = LONG_DATE_PATTERN.exec(text)
  if (!match) return null
  const month = MONTH_NUMBERS[(match[2] ?? '').toLowerCase()]
  if (month === undefined) return null

  return formatIsoDate(Number(match[3]), month, Number(match[1]))
}

export const parseShortBrazilianDate = (text: string): string | null => {
  const match = SHORT_DATE_PATTERN.exec(text)
  if (!match) return null

  return formatIsoDate(Number(match[3]), Number(match[2]), Number(match[1]))
}
