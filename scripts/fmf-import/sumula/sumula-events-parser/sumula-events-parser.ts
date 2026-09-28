import * as R from 'remeda'
import { sanitizePersonName } from '../../text-normalization/text-normalization'
import { CARD_KIND, GOAL_TYPE, PERIODS, type CardKind, type GoalType, type Period, type PositionedText, type SumulaCard, type SumulaGoal, type SumulaSubstitution } from '../sumula-types/sumula-types'
import { type AnchoredGroup, findItem, groupByAnchorAbove, isSameRow, joinText, parseClockMinute, rowOf } from '../text-layout/text-layout'

const SECTION_TITLES = {
  GOALS: 'Gols',
  YELLOW_CARDS: 'Cartões Amarelos',
  RED_CARDS: 'Cartões Vermelhos',
  OCCURRENCES: 'Ocorrências / Observações',
  ASSISTANT_REPORT: 'Relatório do Assistente',
  SUBSTITUTIONS: 'Substituições',
} as const

const COLUMN = {
  TIME: 'Tempo',
  PERIOD: '1T/2T',
  NUMBER: 'Nº',
  TYPE: 'Tipo',
  PLAYER_NAME: 'Nome do Jogador',
  TEAM: 'Equipe',
} as const

const GOAL_TYPE_CODES: Readonly<Record<string, GoalType>> = {
  NR: GOAL_TYPE.NORMAL,
  PN: GOAL_TYPE.PENALTI,
  GC: GOAL_TYPE.CONTRA,
  FT: GOAL_TYPE.FALTA,
}

const COLUMN_TOLERANCE = 8
const PERIOD_COLUMN_TOLERANCE = 20
const REASON_PREFIX = '- '
const REASON_PATTERN = /^-\s*/
const SUBSTITUTION_ENTRY_PATTERN = /^(\d{1,3})\s*-\s*/
const SHIRT_NUMBER_PATTERN = /^\d{1,3}$/

type Section = { items: PositionedText[]; headerRow: PositionedText[] }

type ColumnedGroup = { period: Period; anchor: PositionedText; columns: Record<string, PositionedText[]>; members: PositionedText[] }

const isPeriod = (text: string): text is Period => PERIODS.some((period) => period === text)

const readSection = (items: PositionedText[], title: string): Section | null => {
  const titleItem = findItem(items, title)
  if (!titleItem) return null
  const nextTitleY = Math.max(
    Number.NEGATIVE_INFINITY,
    ...Object.values(SECTION_TITLES)
      .map((candidate) => findItem(items, candidate)?.y)
      .filter((y): y is number => y !== undefined && y < titleItem.y),
  )
  const sectionItems = items.filter((item) => item.y < titleItem.y && item.y > nextTitleY)
  const timeHeader = R.sortBy(
    sectionItems.filter((item) => item.text === COLUMN.TIME),
    [(item) => item.y, 'desc'],
  )[0]
  if (!timeHeader) return null
  const headerRow = rowOf(sectionItems, timeHeader)

  return { items: sectionItems.filter((item) => item.y < timeHeader.y - 2), headerRow }
}

const columnOf = (headerRow: PositionedText[], item: PositionedText): string =>
  R.sortBy(
    headerRow.filter((header) => header.x <= item.x + COLUMN_TOLERANCE),
    [(header) => header.x, 'desc'],
  )[0]?.text ?? ''

const groupRows = (section: Section): ColumnedGroup[] => {
  const periodHeader = section.headerRow.find((item) => item.text === COLUMN.PERIOD)
  if (!periodHeader) return []
  const anchors = section.items.filter((item) => isPeriod(item.text) && Math.abs(item.x - periodHeader.x) <= PERIOD_COLUMN_TOLERANCE)

  return groupByAnchorAbove(anchors, section.items).flatMap(({ anchor, members }: AnchoredGroup) =>
    isPeriod(anchor.text) ? [{ period: anchor.text, anchor, columns: R.groupBy(members, (member) => columnOf(section.headerRow, member)), members }] : [],
  )
}

const columnText = (group: ColumnedGroup, column: string): string => joinText(group.columns[column] ?? [])

const shirtNumberOf = (text: string): number | null => (SHIRT_NUMBER_PATTERN.test(text) ? Number(text) : null)

export const parseGoals = (items: PositionedText[]): SumulaGoal[] => {
  const section = readSection(items, SECTION_TITLES.GOALS)

  return (section ? groupRows(section) : []).flatMap((group) => {
    const goalType = GOAL_TYPE_CODES[columnText(group, COLUMN.TYPE)]
    if (!goalType) return []

    return [
      {
        side: null,
        period: group.period,
        minute: parseClockMinute(columnText(group, COLUMN.TIME)),
        shirtNumber: shirtNumberOf(columnText(group, COLUMN.NUMBER)),
        goalType,
        playerName: sanitizePersonName(columnText(group, COLUMN.PLAYER_NAME)),
        teamName: columnText(group, COLUMN.TEAM),
      },
    ]
  })
}

const parseCardSection = (items: PositionedText[], title: string, kind: CardKind): SumulaCard[] => {
  const section = readSection(items, title)

  return (section ? groupRows(section) : []).map((group) => {
    const nameItems = group.columns[COLUMN.PLAYER_NAME] ?? []
    const reasonItems = nameItems.filter((item) => item.text.startsWith(REASON_PREFIX) || !isSameRow(item, group.anchor))

    return {
      side: null,
      kind,
      period: group.period,
      minute: parseClockMinute(columnText(group, COLUMN.TIME)),
      shirtNumber: shirtNumberOf(columnText(group, COLUMN.NUMBER)),
      personName: sanitizePersonName(joinText(nameItems.filter((item) => !reasonItems.includes(item)))),
      teamName: columnText(group, COLUMN.TEAM),
      reason: reasonItems.length > 0 ? joinText(reasonItems).replace(REASON_PATTERN, '').trim() : null,
    }
  })
}

export const parseCards = (items: PositionedText[]): SumulaCard[] => [
  ...parseCardSection(items, SECTION_TITLES.YELLOW_CARDS, CARD_KIND.AMARELO),
  ...parseCardSection(items, SECTION_TITLES.RED_CARDS, CARD_KIND.VERMELHO),
]

const parseSubstitutionGroup = (group: ColumnedGroup): SumulaSubstitution => {
  const entries = R.sortBy(
    group.members.filter((item) => SUBSTITUTION_ENTRY_PATTERN.test(item.text)),
    (item) => item.x,
  )
  const firstEntryX = entries[0]?.x ?? Number.POSITIVE_INFINITY
  const teamItems = group.members.filter((item) => item.x < firstEntryX - 5 && parseClockMinute(item.text) === null && item.x > group.anchor.x)
  const entryNumber = (entry: PositionedText | undefined): number | null => (entry ? Number(SUBSTITUTION_ENTRY_PATTERN.exec(entry.text)?.[1]) : null)

  return {
    side: null,
    period: group.period,
    minute: parseClockMinute(group.members.map((item) => item.text).find((text) => parseClockMinute(text) !== null) ?? ''),
    teamName: joinText(teamItems),
    playerInNumber: entryNumber(entries[0]),
    playerOutNumber: entryNumber(entries[1]),
  }
}

export const parseSubstitutions = (items: PositionedText[]): SumulaSubstitution[] => {
  const section = readSection(items, SECTION_TITLES.SUBSTITUTIONS)

  return (section ? groupRows(section) : []).map(parseSubstitutionGroup)
}
