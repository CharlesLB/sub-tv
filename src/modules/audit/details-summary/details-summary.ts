import * as R from 'remeda'

const MAX_ENTRIES = 3
const MAX_LENGTH = 90
const ELLIPSIS = '…'
const ENTRY_SEPARATOR = ' · '
const IDENTIFIER_KEY = /id$|ids$|^slug$/i
const UUID_VALUE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const TRUE_LABEL = 'sim'
const FALSE_LABEL = 'não'

const DETAIL_KEY_LABEL: Record<string, string> = {
  text: 'texto',
  type: 'tipo',
  minute: 'minuto',
  period: 'período',
  side: 'lado',
  position: 'posição',
  preferredFoot: 'pé',
  displayName: 'apelido',
  fullName: 'nome',
  shirtNumber: 'camisa',
  clock: 'cronômetro',
  statusChanged: 'status alterado',
  username: 'usuário',
  round: 'rodada',
  venue: 'local',
  name: 'nome',
  year: 'ano',
  phase: 'fase',
  category: 'categoria',
}

const isPlainRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value)

const formatValue = (value: unknown): string | null => {
  if (value === null || value === undefined || value === '') return null
  if (typeof value === 'boolean') return value ? TRUE_LABEL : FALSE_LABEL
  if (typeof value === 'string') return UUID_VALUE.test(value) ? null : value
  if (typeof value === 'number') return String(value)
  if (Array.isArray(value)) return `${value.length} itens`
  if (isPlainRecord(value)) {
    const nested = R.entries(value).flatMap(([key, nestedValue]) => {
      const formatted = typeof nestedValue === 'object' ? null : formatValue(nestedValue)

      return formatted === null ? [] : [`${DETAIL_KEY_LABEL[key] ?? key} ${formatted}`]
    })

    return nested.length > 0 ? nested.join(', ') : null
  }

  return null
}

const truncate = (text: string): string => (text.length > MAX_LENGTH ? `${text.slice(0, MAX_LENGTH - 1)}${ELLIPSIS}` : text)

export const summarizeDetails = (details: unknown): string => {
  if (!isPlainRecord(details)) return ''

  const entries = R.entries(details).flatMap(([key, value]) => {
    if (IDENTIFIER_KEY.test(key)) return []
    const formatted = formatValue(value)

    return formatted === null ? [] : [`${DETAIL_KEY_LABEL[key] ?? key}: ${formatted}`]
  })

  return truncate(entries.slice(0, MAX_ENTRIES).join(ENTRY_SEPARATOR))
}

const NAME_KEY = 'name'

export const nameFromDetails = (details: unknown): string | null => {
  if (!isPlainRecord(details)) return null
  const name = details[NAME_KEY]

  return typeof name === 'string' && name.trim() !== '' ? name : null
}
