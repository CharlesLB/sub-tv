import * as R from 'remeda'
import type { PositionedText } from '../sumula-types/sumula-types'

const SAME_ROW_TOLERANCE = 3
const ANCHOR_ABOVE_TOLERANCE = 3
const MAXIMUM_ANCHOR_DISTANCE = 24

export type AnchoredGroup = { anchor: PositionedText; members: PositionedText[] }

export const isSameRow = (first: PositionedText, second: PositionedText): boolean => Math.abs(first.y - second.y) <= SAME_ROW_TOLERANCE

export const findItem = (items: PositionedText[], text: string, predicate: (item: PositionedText) => boolean = () => true): PositionedText | undefined =>
  items.find((item) => item.text === text && predicate(item))

export const findItems = (items: PositionedText[], text: string): PositionedText[] => items.filter((item) => item.text === text)

export const rowOf = (items: PositionedText[], reference: PositionedText): PositionedText[] =>
  R.sortBy(
    items.filter((item) => isSameRow(item, reference)),
    (item) => item.x,
  )

export const itemRightOf = (items: PositionedText[], reference: PositionedText): PositionedText | undefined =>
  rowOf(items, reference).find((item) => item.x > reference.x)

export const readingOrder = (items: PositionedText[]): PositionedText[] => R.sortBy(items, [(item) => Math.round(item.y), 'desc'], (item) => item.x)

export const joinText = (items: PositionedText[]): string =>
  readingOrder(items)
    .map((item) => item.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

export const withinVerticalRange = (items: PositionedText[], upperY: number, lowerY: number): PositionedText[] => items.filter((item) => item.y < upperY && item.y > lowerY)

const nearestAnchorIndex = (anchors: PositionedText[], item: PositionedText): number =>
  anchors.reduce(
    (bestIndex, anchor, index) => (bestIndex < 0 || Math.abs(anchor.y - item.y) < Math.abs((anchors[bestIndex]?.y ?? 0) - item.y) ? index : bestIndex),
    -1,
  )

const anchorAboveIndex = (anchors: PositionedText[], item: PositionedText): number =>
  anchors.reduce((bestIndex, anchor, index) => {
    const distance = anchor.y - item.y
    if (distance < -ANCHOR_ABOVE_TOLERANCE || distance > MAXIMUM_ANCHOR_DISTANCE) return bestIndex
    const bestDistance = bestIndex < 0 ? Number.POSITIVE_INFINITY : (anchors[bestIndex]?.y ?? 0) - item.y

    return distance < bestDistance ? index : bestIndex
  }, -1)

const groupByAnchor = (anchors: PositionedText[], members: PositionedText[], pickIndex: (item: PositionedText) => number): AnchoredGroup[] =>
  anchors.map((anchor, anchorIndex) => ({
    anchor,
    members: members.filter((member) => member !== anchor && pickIndex(member) === anchorIndex),
  }))

export const groupByNearestAnchor = (anchors: PositionedText[], members: PositionedText[]): AnchoredGroup[] =>
  groupByAnchor(anchors, members, (item) => nearestAnchorIndex(anchors, item))

export const groupByAnchorAbove = (anchors: PositionedText[], members: PositionedText[]): AnchoredGroup[] =>
  groupByAnchor(anchors, members, (item) => anchorAboveIndex(anchors, item))

export const parseClockMinute = (text: string): number | null => {
  const match = /^(\d{1,3}):(\d{2})$/.exec(text.trim())

  return match ? Number(match[1]) : null
}
