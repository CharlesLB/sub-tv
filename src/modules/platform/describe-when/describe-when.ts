const MONTH_ABBREVIATIONS = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'] as const
const MILLISECONDS_PER_DAY = 86_400_000
const RECENT_WINDOW_DAYS = 14
const TIME_ZONE = 'America/Sao_Paulo'

type CalendarDate = { year: number; monthIndex: number; day: number }

const calendarDateIn = (date: Date): CalendarDate => {
  const [year, month, day] = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date).split('-').map(Number)

  return { year: year ?? 1970, monthIndex: (month ?? 1) - 1, day: day ?? 1 }
}

const dayNumberOf = ({ year, monthIndex, day }: CalendarDate): number => Date.UTC(year, monthIndex, day) / MILLISECONDS_PER_DAY

export const describeWhen = (isoDate: string | null, now: Date): string => {
  if (!isoDate) return ''

  const date = calendarDateIn(new Date(isoDate))
  const daysAgo = dayNumberOf(calendarDateIn(now)) - dayNumberOf(date)
  if (daysAgo === 0) return 'HOJE'
  if (daysAgo === 1) return 'ONTEM'
  if (daysAgo > 1 && daysAgo < RECENT_WINDOW_DAYS) return `HÁ ${daysAgo} DIAS`

  return `${MONTH_ABBREVIATIONS[date.monthIndex] ?? ''} ${date.year}`
}
