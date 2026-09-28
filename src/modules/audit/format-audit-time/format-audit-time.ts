const TIME_ZONE = 'America/Sao_Paulo'
const LOCALE = 'pt-BR'

const AUDIT_TIME_FORMAT = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

export const formatAuditTime = (isoDate: string): string => {
  const parts = Object.fromEntries(AUDIT_TIME_FORMAT.formatToParts(new Date(isoDate)).map((part) => [part.type, part.value]))

  return `${parts.day ?? ''}/${parts.month ?? ''}/${parts.year ?? ''} ${parts.hour ?? '00'}:${parts.minute ?? '00'}`
}
