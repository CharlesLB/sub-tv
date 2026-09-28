import { parseShortBrazilianDate } from '../../competition-page/portuguese-date/portuguese-date'
import { parseInteger } from '../../html-text/html-text'
import type { PositionedText, SumulaHeader } from '../sumula-types/sumula-types'
import { findItem, findItems, itemRightOf, joinText, parseClockMinute, rowOf } from '../text-layout/text-layout'

const LABEL = {
  COMPETITION: 'Competição:',
  PHASE: 'Fase:',
  ROUND: 'Rodada:',
  MATCH: 'Jogo:',
  DATE: 'Data:',
  TIME: 'Hora:',
  VENUE: 'Local:',
  ADDED_TIME: 'Acréscimo:',
  VERSUS: 'X',
  RESULT_TITLE: 'Resultado do Jogo',
  REFEREES_TITLE: 'Arbitragem',
} as const

const HALF_SCORE_PATTERNS = {
  FIRST_HALF: /^1º Tempo:\s*(\d+)\s*x\s*(\d+)/i,
  SECOND_HALF: /^2º Tempo:\s*(\d+)\s*x\s*(\d+)/i,
  EXTRA_TIME: /^Prorroga\S*:\s*(\d+)\s*x\s*(\d+)/i,
  PENALTIES: /^P\S*naltis:\s*(\d+)\s*x\s*(\d+)/i,
} as const

const FINAL_SCORE_PATTERN = /\s(\d+)\s*x\s*(\d+)\s/i
const TEAM_NAME_ROW_TOLERANCE = 6
const TIME_PATTERN = /^(\d{1,2}:\d{2})/
const SIDE_SPLIT_X = 300

type ScorePair = { home: number; away: number }

const valueAfter = (items: PositionedText[], label: string): string | null => {
  const labelItem = findItem(items, label)

  return labelItem ? (itemRightOf(items, labelItem)?.text ?? null) : null
}

const readScorePair = (items: PositionedText[], pattern: RegExp): ScorePair | null => {
  const match = items.map((item) => pattern.exec(item.text)).find((candidate) => candidate !== null)

  return match ? { home: Number(match[1]), away: Number(match[2]) } : null
}

const readTeamNames = (items: PositionedText[]): { homeName: string; awayName: string } => {
  const matchLabel = findItem(items, LABEL.MATCH)
  const versus = matchLabel ? rowOf(items, matchLabel).find((item) => item.text === LABEL.VERSUS) : undefined
  if (!matchLabel || !versus) return { homeName: '', awayName: '' }
  const nameItems = items.filter((item) => Math.abs(item.y - matchLabel.y) <= TEAM_NAME_ROW_TOLERANCE && item.x > matchLabel.x && item !== versus)

  return {
    homeName: joinText(nameItems.filter((item) => item.x < versus.x)),
    awayName: joinText(nameItems.filter((item) => item.x > versus.x)),
  }
}

const readFinalScore = (items: PositionedText[]): ScorePair | null => {
  const resultTitle = findItem(items, LABEL.RESULT_TITLE)
  const refereesTitle = findItem(items, LABEL.REFEREES_TITLE)
  if (!resultTitle) return null
  const lowerBound = refereesTitle?.y ?? resultTitle.y - 60
  const candidates = items.filter((item) => item.y < resultTitle.y && item.y > lowerBound && !item.text.includes(':'))
  const match = candidates.map((item) => FINAL_SCORE_PATTERN.exec(` ${item.text} `)).find((candidate) => candidate !== null)

  return match ? { home: Number(match[1]), away: Number(match[2]) } : null
}

const sumScores = (pairs: (ScorePair | null)[]): ScorePair | null =>
  pairs.every((pair) => pair === null) ? null : pairs.reduce<ScorePair>((total, pair) => ({ home: total.home + (pair?.home ?? 0), away: total.away + (pair?.away ?? 0) }), { home: 0, away: 0 })

const readAddedTimes = (items: PositionedText[]): { firstHalf: number | null; secondHalf: number | null } => {
  const values = findItems(items, LABEL.ADDED_TIME).map((label) => ({ x: label.x, minute: parseClockMinute(itemRightOf(items, label)?.text ?? '') }))

  return {
    firstHalf: values.find((value) => value.x < SIDE_SPLIT_X)?.minute ?? null,
    secondHalf: values.find((value) => value.x >= SIDE_SPLIT_X)?.minute ?? null,
  }
}

export const parseSumulaHeader = (items: PositionedText[]): SumulaHeader => {
  const firstHalf = readScorePair(items, HALF_SCORE_PATTERNS.FIRST_HALF)
  const penalties = readScorePair(items, HALF_SCORE_PATTERNS.PENALTIES)
  const finalScore = readFinalScore(items) ?? sumScores([firstHalf, readScorePair(items, HALF_SCORE_PATTERNS.SECOND_HALF), readScorePair(items, HALF_SCORE_PATTERNS.EXTRA_TIME)])
  const hasPenalties = penalties !== null && penalties.home + penalties.away > 0
  const addedTimes = readAddedTimes(items)

  return {
    competition: valueAfter(items, LABEL.COMPETITION),
    phase: valueAfter(items, LABEL.PHASE),
    round: parseInteger(valueAfter(items, LABEL.ROUND) ?? ''),
    ...readTeamNames(items),
    date: parseShortBrazilianDate(valueAfter(items, LABEL.DATE) ?? ''),
    time: TIME_PATTERN.exec(valueAfter(items, LABEL.TIME) ?? '')?.[1] ?? null,
    venue: valueAfter(items, LABEL.VENUE),
    homeScore: finalScore?.home ?? null,
    awayScore: finalScore?.away ?? null,
    homeScoreHalfTime: firstHalf?.home ?? null,
    awayScoreHalfTime: firstHalf?.away ?? null,
    homePenalties: hasPenalties ? penalties.home : null,
    awayPenalties: hasPenalties ? penalties.away : null,
    addedTimeFirstHalf: addedTimes.firstHalf,
    addedTimeSecondHalf: addedTimes.secondHalf,
  }
}
