import { formatShortDate } from '@/lib/utils/format-date/format-date'

const TIME_ZONE = 'America/Sao_Paulo'
const SAO_PAULO_OFFSET = '-03:00'
const NOON = '12:00'
const DATE_INPUT_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_INPUT_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

const partsInSaoPaulo = (instant: Date, options: Intl.DateTimeFormatOptions): Record<string, string> =>
  Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE, ...options }).formatToParts(instant).map((part) => [part.type, part.value]))

export const toDateInputInSaoPaulo = (instant: Date): string => {
  const parts = partsInSaoPaulo(instant, { year: 'numeric', month: '2-digit', day: '2-digit' })

  return `${parts.year ?? ''}-${parts.month ?? ''}-${parts.day ?? ''}`
}

export const toTimeInputInSaoPaulo = (instant: Date): string => {
  const parts = partsInSaoPaulo(instant, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })

  return `${parts.hour ?? '00'}:${parts.minute ?? '00'}`
}

export const isDateInput = (value: string): boolean => DATE_INPUT_PATTERN.test(value) && !Number.isNaN(new Date(`${value}T${NOON}:00${SAO_PAULO_OFFSET}`).getTime())

export const isTimeInput = (value: string): boolean => TIME_INPUT_PATTERN.test(value)

export const toKickoffInstant = (date: string, time: string): Date => new Date(`${date}T${time}:00${SAO_PAULO_OFFSET}`)

export const formatDateInput = (date: string): string => (isDateInput(date) ? formatShortDate(`${date}T${NOON}:00${SAO_PAULO_OFFSET}`) : '')
