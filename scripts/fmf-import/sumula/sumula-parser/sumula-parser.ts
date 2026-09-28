import { normalizeName, tokenSimilarity } from '../../text-normalization/text-normalization'
import { extractPositionedText } from '../pdf-text-items/pdf-text-items'
import { parseCards, parseGoals, parseSubstitutions } from '../sumula-events-parser/sumula-events-parser'
import { parseSumulaHeader } from '../sumula-header-parser/sumula-header-parser'
import { parseSumulaLineups } from '../sumula-lineup-parser/sumula-lineup-parser'
import { parseSumulaStaff } from '../sumula-staff-parser/sumula-staff-parser'
import { type ParsedSumula, type PositionedText, SIDE, type Side, type SumulaHeader } from '../sumula-types/sumula-types'

const MINIMUM_SIDE_SIMILARITY = 0.2

export const resolveSide = (header: SumulaHeader, teamName: string): Side | null => {
  const normalizedTeam = normalizeName(teamName)
  if (normalizedTeam.length === 0) return null
  if (normalizedTeam === normalizeName(header.homeName)) return SIDE.HOME
  if (normalizedTeam === normalizeName(header.awayName)) return SIDE.AWAY
  const homeSimilarity = tokenSimilarity(teamName, header.homeName)
  const awaySimilarity = tokenSimilarity(teamName, header.awayName)
  if (Math.max(homeSimilarity, awaySimilarity) < MINIMUM_SIDE_SIMILARITY || homeSimilarity === awaySimilarity) return null

  return homeSimilarity > awaySimilarity ? SIDE.HOME : SIDE.AWAY
}

export const parseSumulaItems = (items: PositionedText[]): ParsedSumula => {
  const header = parseSumulaHeader(items)
  const players = parseSumulaLineups(items)
  const goals = parseGoals(items).map((goal) => ({ ...goal, side: resolveSide(header, goal.teamName) }))
  const cards = parseCards(items).map((card) => ({ ...card, side: resolveSide(header, card.teamName) }))
  const substitutions = parseSubstitutions(items).map((substitution) => ({ ...substitution, side: resolveSide(header, substitution.teamName) }))

  const warnings = [
    ...(header.homeName && header.awayName ? [] : ['cabeçalho sem nomes dos times']),
    ...(players.length > 0 ? [] : ['relação de jogadores vazia']),
    ...[...goals, ...cards, ...substitutions].filter((event) => event.side === null).map((event) => `evento sem equipe reconhecida: ${event.teamName}`),
  ]

  return { header, players, staff: parseSumulaStaff(items), goals, cards, substitutions, warnings }
}

export const parseSumulaPdf = async (pdfBytes: Uint8Array): Promise<ParsedSumula> => parseSumulaItems(await extractPositionedText(pdfBytes))
