import * as R from 'remeda'
import { sanitizePersonName } from '../../text-normalization/text-normalization'
import { type PositionedText, SIDE, type Side, type SumulaPlayer } from '../sumula-types/sumula-types'
import { findItems, groupByNearestAnchor, joinText, readingOrder } from '../text-layout/text-layout'

const TITLE = {
  PLAYERS: 'Relação de Jogadores',
  STARTERS: 'Titulares',
  SUBSTITUTES: 'Substitutos',
  STAFF: 'Comissão Técnica',
  NUMBER_HEADER: 'Nº',
} as const

const SIDE_SPLIT_X = 300
const HEADER_ROW_TOLERANCE = 2
const COLUMN_OFFSET = { NICKNAME: 10, FULL_NAME: 90, CBF: 235 } as const
const NUMBER_PATTERN = /^\d{1,3}$/
const CBF_FRAGMENT_PATTERN = /^[\d.]+$/
const CBF_PATTERN = /^\d{4,}$/
const THOUSANDS_SEPARATOR_PATTERN = /\./g
const PLACEHOLDER_CBF_PATTERN = /^0+$/
const CAPTAIN_PATTERN = /\s*\(C\)\s*$/i
const WRAPPED_NUMBER_GAP = 10

type SideFrame = { side: Side; minimumX: number; maximumX: number }

const SIDE_FRAMES: readonly SideFrame[] = [
  { side: SIDE.HOME, minimumX: Number.NEGATIVE_INFINITY, maximumX: SIDE_SPLIT_X },
  { side: SIDE.AWAY, minimumX: SIDE_SPLIT_X, maximumX: Number.POSITIVE_INFINITY },
]

const isInFrame = (frame: SideFrame, item: PositionedText): boolean => item.x >= frame.minimumX && item.x < frame.maximumX

const firstInFrame = (items: PositionedText[], frame: SideFrame, text: string): PositionedText | undefined => findItems(items, text).find((item) => isInFrame(frame, item))

const mergeWrappedNumbers = (numberItems: PositionedText[]): PositionedText[] =>
  R.sortBy(numberItems, [(item) => item.y, 'desc']).reduce<PositionedText[]>((merged, item) => {
    const previous = merged.at(-1)
    if (!previous || previous.y - item.y >= WRAPPED_NUMBER_GAP) return [...merged, item]

    return [...merged.slice(0, -1), { x: previous.x, y: (previous.y + item.y) / 2, text: `${previous.text}${item.text}` }]
  }, [])

const buildPlayer = (side: Side, numberX: number, anchor: PositionedText, members: PositionedText[], substitutesY: number): SumulaPlayer | null => {
  const cbfItems = members.filter((item) => item.x >= numberX + COLUMN_OFFSET.CBF && CBF_FRAGMENT_PATTERN.test(item.text))

  const joinedCbf = readingOrder(cbfItems)
    .map((item) => item.text)
    .join('')
    .replace(THOUSANDS_SEPARATOR_PATTERN, '')

  const cbfText = CBF_PATTERN.test(joinedCbf) ? joinedCbf : null
  const nameItems = members.filter((item) => !cbfItems.includes(item))
  const rawNickname = joinText(nameItems.filter((item) => item.x < numberX + COLUMN_OFFSET.FULL_NAME))
  const rawFullName = joinText(nameItems.filter((item) => item.x >= numberX + COLUMN_OFFSET.FULL_NAME))
  const isCaptain = CAPTAIN_PATTERN.test(rawFullName) || CAPTAIN_PATTERN.test(rawNickname)
  const nickname = sanitizePersonName(rawNickname.replace(CAPTAIN_PATTERN, ''))
  const fullName = sanitizePersonName(rawFullName.replace(CAPTAIN_PATTERN, ''))
  if (fullName.length === 0 && nickname.length === 0) return null

  return {
    side,
    shirtNumber: Number(anchor.text),
    nickname: nickname || null,
    fullName: fullName || nickname,
    cbfId: cbfText === null || PLACEHOLDER_CBF_PATTERN.test(cbfText) ? null : cbfText,
    isStarter: anchor.y > substitutesY,
    isCaptain,
  }
}

const parseSide = (items: PositionedText[], frame: SideFrame, playersTitleY: number): SumulaPlayer[] => {
  const startersTitle = firstInFrame(items, frame, TITLE.STARTERS)
  const staffTitle = firstInFrame(items, frame, TITLE.STAFF)
  const numberHeader = firstInFrame(items, frame, TITLE.NUMBER_HEADER)
  if (!startersTitle || !staffTitle || !numberHeader) return []
  const substitutesY = firstInFrame(items, frame, TITLE.SUBSTITUTES)?.y ?? Number.NEGATIVE_INFINITY
  const numberX = numberHeader.x

  const sectionItems = items.filter(
    (item) =>
      isInFrame(frame, item) &&
      item.y < Math.min(startersTitle.y, playersTitleY) &&
      item.y > staffTitle.y &&
      Math.abs(item.y - numberHeader.y) > HEADER_ROW_TOLERANCE &&
      item.text !== TITLE.SUBSTITUTES,
  )

  const numberItems = sectionItems.filter((item) => item.x < numberX + COLUMN_OFFSET.NICKNAME && NUMBER_PATTERN.test(item.text))
  const anchors = mergeWrappedNumbers(numberItems)

  return groupByNearestAnchor(
    anchors,
    sectionItems.filter((item) => !numberItems.includes(item)),
  ).flatMap(({ anchor, members }) => {
    const player = buildPlayer(frame.side, numberX, anchor, members, substitutesY)

    return player ? [player] : []
  })
}

export const parseSumulaLineups = (items: PositionedText[]): SumulaPlayer[] => {
  const playersTitle = findItems(items, TITLE.PLAYERS)[0]
  if (!playersTitle) return []

  return SIDE_FRAMES.flatMap((frame) => parseSide(items, frame, playersTitle.y))
}
