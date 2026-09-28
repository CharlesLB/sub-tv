import type { TeamBadgeVM } from './types'

const FALLBACK_TEAM_COLOR = '#6A7D6F'
const ABBREVIATION_LENGTH = 3
const LOWERCASE_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e'])

export type TeamBadgeRow = {
  displayName: string | null
  shortName: string
  abbreviation: string | null
  color: string | null
}

const stripAccents = (text: string): string => text.normalize('NFD').replace(/[̀-ͯ]/g, '')

export const deriveAbbreviation = (name: string): string =>
  stripAccents(name)
    .replace(/[^A-Za-z]/g, '')
    .slice(0, ABBREVIATION_LENGTH)
    .toUpperCase()

export const toTeamBadge = (row: TeamBadgeRow): TeamBadgeVM => {
  const name = row.displayName ?? row.shortName

  return {
    name,
    abbreviation: row.abbreviation ?? deriveAbbreviation(name),
    color: row.color ?? FALLBACK_TEAM_COLOR,
  }
}

export const toTitleCase = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => (index > 0 && LOWERCASE_WORDS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ')

export const toPhaseLabel = (phase: string | null): string => (phase ? toTitleCase(phase) : 'Fase única')
