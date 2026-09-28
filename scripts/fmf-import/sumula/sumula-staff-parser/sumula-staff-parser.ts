import { sanitizePersonName } from '../../text-normalization/text-normalization'
import { SIDE, STAFF_ROLE, type PositionedText, type Side, type StaffRole, type SumulaStaff } from '../sumula-types/sumula-types'
import { findItems, groupByAnchorAbove, joinText } from '../text-layout/text-layout'

const STAFF_TITLE = 'Comissão Técnica'
const SIDE_SPLIT_X = 300
const PAGE_HEIGHT = 1_000
const LABEL_SUFFIX = ':'

const STAFF_LABELS: Readonly<Record<string, StaffRole>> = {
  'Técnico:': STAFF_ROLE.TECNICO,
  'Auxiliar Técnico:': STAFF_ROLE.AUXILIAR,
  'Médico:': STAFF_ROLE.MEDICO,
  'Preparador Físico:': STAFF_ROLE.PREPARADOR_FISICO,
  'Fisioterapeuta:': STAFF_ROLE.FISIOTERAPEUTA,
  'Massagista:': STAFF_ROLE.MASSAGISTA,
  'Prep. de Goleiros:': STAFF_ROLE.PREPARADOR_GOLEIROS,
  'Preparador de Goleiros:': STAFF_ROLE.PREPARADOR_GOLEIROS,
}

const sideOf = (item: PositionedText): Side => (item.x < SIDE_SPLIT_X ? SIDE.HOME : SIDE.AWAY)

const isLabel = (item: PositionedText): boolean => item.text.endsWith(LABEL_SUFFIX)

const pageBottomOf = (y: number): number => Math.floor(y / PAGE_HEIGHT) * PAGE_HEIGHT

const parseSide = (items: PositionedText[], side: Side, titleY: number): SumulaStaff[] => {
  const sectionItems = items.filter((item) => sideOf(item) === side && item.y < titleY && item.y > pageBottomOf(titleY))
  const labels = sectionItems.filter(isLabel)

  return groupByAnchorAbove(
    labels,
    sectionItems.filter((item) => !isLabel(item)),
  ).flatMap(({ anchor, members }) => {
    const fullName = sanitizePersonName(joinText(members))
    if (fullName.length === 0) return []

    return [{ side, role: STAFF_LABELS[anchor.text] ?? STAFF_ROLE.OUTRO, fullName }]
  })
}

export const parseSumulaStaff = (items: PositionedText[]): SumulaStaff[] => {
  const titles = findItems(items, STAFF_TITLE)

  return [SIDE.HOME, SIDE.AWAY].flatMap((side) => {
    const title = titles.find((item) => sideOf(item) === side)

    return title ? parseSide(items, side, title.y) : []
  })
}
