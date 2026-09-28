const TIME_ZONE = 'America/Sao_Paulo'
const LOCALE = 'pt-BR'

const partsOf = (isoDate: string, options: Intl.DateTimeFormatOptions): Record<string, string> =>
  Object.fromEntries(new Intl.DateTimeFormat(LOCALE, { timeZone: TIME_ZONE, ...options }).formatToParts(new Date(isoDate)).map((part) => [part.type, part.value.replace('.', '')]))

export const formatShortDate = (isoDate: string): string => {
  const parts = partsOf(isoDate, { weekday: 'short', day: '2-digit', month: 'short' })

  return `${parts.weekday ?? ''} ${parts.day ?? ''} ${parts.month ?? ''}`.toUpperCase()
}

export const formatTime = (isoDate: string): string => {
  const parts = partsOf(isoDate, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })

  return `${parts.hour ?? '00'}:${parts.minute ?? '00'}`
}

export const formatShortDateTime = (isoDate: string): string => `${formatShortDate(isoDate)} · ${formatTime(isoDate)}`

export const formatTitleDate = (isoDate: string): string => {
  const parts = partsOf(isoDate, { weekday: 'short', day: '2-digit', month: 'short' })
  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

  return `${capitalize(parts.weekday ?? '')} ${parts.day ?? ''} ${capitalize(parts.month ?? '')}`
}
