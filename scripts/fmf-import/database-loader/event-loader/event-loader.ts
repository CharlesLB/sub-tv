import { and, eq, inArray, isNotNull } from 'drizzle-orm'
import { matchEvents } from '../../../../src/lib/db/schema'
import { CARD_KIND, GOAL_TYPE, type ParsedSumula, type Side, type SumulaCard, type SumulaGoal, type SumulaSubstitution } from '../../sumula/sumula-types/sumula-types'
import { redactDocuments } from '../../text-normalization/text-normalization'
import { createIssue, type ImportIssue, inChunks, SYNC_ISSUE, type Transaction } from '../database-context/database-context'
import { reconcileLiveEvents } from '../live-reconciliation/live-reconciliation'
import type { LoadedMatch } from '../match-loader/match-loader'
import { lineupKey, type MatchPlayerLookup } from '../player-loader/player-loader'
import { type MatchStaffLookup, staffKey } from '../staff-loader/staff-loader'

const FMF_SOURCE = 'fmf'
const EVENT_TYPE = { GOAL: 'gol', YELLOW: 'amarelo', RED: 'vermelho', SUBSTITUTION: 'substituicao' } as const
const ASSIST_MINUTE_WINDOW = 3
const SECOND_YELLOW_PATTERN = /segundo\s+cart|2º\s+cart|segundo\s+amarelo/i

type EventRow = typeof matchEvents.$inferInsert

type MatchContext = { matchId: string; players: Map<string, string>; staff: Map<string, string>; parsed: ParsedSumula }

type PreservedAssist = { playerId: string | null; minute: number | null; assistPlayerId: string | null }

type BuildResult = { rows: EventRow[]; issues: ImportIssue[] }

const oppositeSide = (side: Side): Side => (side === 'home' ? 'away' : 'home')

const playerOf = (context: MatchContext, side: Side | null, shirtNumber: number | null): string | null =>
  side === null || shirtNumber === null ? null : (context.players.get(lineupKey(side, shirtNumber)) ?? null)

const isListedWithoutCbf = (context: MatchContext, side: Side | null, shirtNumbers: (number | null)[]): boolean =>
  shirtNumbers.some((shirtNumber) => context.parsed.players.some((player) => player.side === side && player.shirtNumber === shirtNumber && playerOf(context, side, shirtNumber) === null))

const unresolvedIssue = (context: MatchContext, kind: string, side: Side | null, shirtNumbers: (number | null)[], details: Record<string, unknown>): ImportIssue =>
  createIssue(
    SYNC_ISSUE.SUMULA_ILEGIVEL,
    { motivo: isListedWithoutCbf(context, side, shirtNumbers) ? 'evento_de_jogador_sem_cbf' : 'evento_sem_jogador', evento: kind, ...details },
    { matchId: context.matchId },
  )

const buildGoal = (context: MatchContext, goal: SumulaGoal, preserved: PreservedAssist[]): BuildResult => {
  const playerId = playerOf(context, goal.side, goal.shirtNumber)
  if (!playerId || !goal.side) return { rows: [], issues: [unresolvedIssue(context, EVENT_TYPE.GOAL, goal.side, [goal.shirtNumber], { numero: goal.shirtNumber, equipe: goal.teamName })] }
  const assist = preserved.find((candidate) => candidate.playerId === playerId && Math.abs((candidate.minute ?? 0) - (goal.minute ?? 0)) <= ASSIST_MINUTE_WINDOW)
  const side = goal.goalType === GOAL_TYPE.CONTRA ? oppositeSide(goal.side) : goal.side

  return {
    rows: [
      {
        matchId: context.matchId,
        side,
        type: EVENT_TYPE.GOAL,
        period: goal.period,
        minute: goal.minute,
        playerId,
        goalType: goal.goalType,
        assistPlayerId: assist?.assistPlayerId ?? null,
        source: FMF_SOURCE,
      },
    ],
    issues: [],
  }
}

const buildCard = (context: MatchContext, card: SumulaCard): BuildResult => {
  const playerId = playerOf(context, card.side, card.shirtNumber)
  const staffMemberId = !playerId && card.side && card.shirtNumber === null ? (context.staff.get(staffKey(card.side, card.personName)) ?? null) : null
  if (!card.side || (!playerId && !staffMemberId))
    return { rows: [], issues: [unresolvedIssue(context, card.kind, card.side, [card.shirtNumber], { numero: card.shirtNumber, nome: card.personName, equipe: card.teamName })] }
  const yellowCount = context.parsed.cards.filter((candidate) => candidate.kind === CARD_KIND.AMARELO && candidate.side === card.side && candidate.shirtNumber === card.shirtNumber).length
  const fromSecondYellow = card.kind === CARD_KIND.VERMELHO && playerId !== null && (yellowCount >= 2 || SECOND_YELLOW_PATTERN.test(card.reason ?? ''))

  return {
    rows: [
      {
        matchId: context.matchId,
        side: card.side,
        type: card.kind === CARD_KIND.AMARELO ? EVENT_TYPE.YELLOW : EVENT_TYPE.RED,
        period: card.period,
        minute: card.minute,
        playerId,
        staffMemberId,
        fromSecondYellow,
        note: card.reason === null ? null : redactDocuments(card.reason),
        source: FMF_SOURCE,
      },
    ],
    issues: [],
  }
}

const buildSubstitution = (context: MatchContext, substitution: SumulaSubstitution): BuildResult => {
  const playerId = playerOf(context, substitution.side, substitution.playerInNumber)
  const playerOutId = playerOf(context, substitution.side, substitution.playerOutNumber)

  if (!substitution.side || !playerId || !playerOutId || playerId === playerOutId) {
    return {
      rows: [],
      issues: [
        unresolvedIssue(context, EVENT_TYPE.SUBSTITUTION, substitution.side, [substitution.playerInNumber, substitution.playerOutNumber], {
          entrou: substitution.playerInNumber,
          saiu: substitution.playerOutNumber,
          equipe: substitution.teamName,
        }),
      ],
    }
  }

  return {
    rows: [{ matchId: context.matchId, side: substitution.side, type: EVENT_TYPE.SUBSTITUTION, period: substitution.period, minute: substitution.minute, playerId, playerOutId, source: FMF_SOURCE }],
    issues: [],
  }
}

const readPreservedAssists = async (transaction: Transaction, matchIds: string[]): Promise<Map<string, PreservedAssist[]>> => {
  if (matchIds.length === 0) return new Map()

  const rows = await transaction
    .select({ matchId: matchEvents.matchId, playerId: matchEvents.playerId, minute: matchEvents.minute, assistPlayerId: matchEvents.assistPlayerId })
    .from(matchEvents)
    .where(and(inArray(matchEvents.matchId, matchIds), eq(matchEvents.source, FMF_SOURCE), eq(matchEvents.type, EVENT_TYPE.GOAL), isNotNull(matchEvents.assistPlayerId)))

  return new Map(matchIds.map((matchId) => [matchId, rows.filter((row) => row.matchId === matchId)]))
}

export const loadEvents = async (transaction: Transaction, loadedMatches: LoadedMatch[], players: MatchPlayerLookup, staff: MatchStaffLookup): Promise<ImportIssue[]> => {
  const contexts = loadedMatches.flatMap((loaded) =>
    loaded.sumula?.parsed
      ? [{ matchId: loaded.matchId, players: players.get(loaded.matchId) ?? new Map<string, string>(), staff: staff.get(loaded.matchId) ?? new Map<string, string>(), parsed: loaded.sumula.parsed }]
      : [],
  )

  const matchIds = contexts.map((context) => context.matchId)
  const preserved = await readPreservedAssists(transaction, matchIds)
  if (matchIds.length > 0) await transaction.delete(matchEvents).where(and(inArray(matchEvents.matchId, matchIds), eq(matchEvents.source, FMF_SOURCE)))

  const results = contexts.flatMap((context) => [
    ...context.parsed.goals.map((goal) => buildGoal(context, goal, preserved.get(context.matchId) ?? [])),
    ...context.parsed.cards.map((card) => buildCard(context, card)),
    ...context.parsed.substitutions.map((substitution) => buildSubstitution(context, substitution)),
  ])

  await inChunks(
    results.flatMap((result) => result.rows),
    async (chunk) => transaction.insert(matchEvents).values(chunk),
  )

  const reconciliationIssues = await reconcileLiveEvents(transaction, matchIds)

  return [...results.flatMap((result) => result.issues), ...reconciliationIssues]
}
