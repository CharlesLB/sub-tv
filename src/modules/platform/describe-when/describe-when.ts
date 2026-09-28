const MONTH_ABBREVIATIONS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'] as const
const MILLISECONDS_PER_DAY = 86_400_000
const RECENT_WINDOW_DAYS = 14
const TIME_ZONE = 'America/Sao_Paulo'

const dayNumberIn = (date: Date): number => {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date).split('-').map(Number)

  return Date.UTC(year ?? 1970, (month ?? 1) - 1, day ?? 1) / MILLISECONDS_PER_DAY
}

export const describeWhen = (isoDate: string | null, now: Date): string => {
  if (!isoDate) return ''

  const date = new Date(isoDate)
  const daysAgo = dayNumberIn(now) - dayNumberIn(date)
  if (daysAgo === 0) return 'HOJE'
  if (daysAgo === 1) return 'ONTEM'
  if (daysAgo > 1 && daysAgo < RECENT_WINDOW_DAYS) return `HÁ ${daysAgo} DIAS`

  return `${MONTH_ABBREVIATIONS[date.getUTCMonth()] ?? ''} ${date.getUTCFullYear()}`
}
