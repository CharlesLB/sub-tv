import { decodeHtmlText } from '../../html-text/html-text'
import { sliceBetween } from '../page-sections/page-sections'
import { type StandingRow, parseStandingsTab } from '../standings-tab-parser/standings-tab-parser'
import { type TableMatch, parseTableTab } from '../table-tab-parser/table-tab-parser'
import { type TopScorerRow, parseTopScorersTab } from '../top-scorers-tab-parser/top-scorers-tab-parser'

const TAB_MARKERS = {
  TABLE: 'id="tab_1-1"',
  STANDINGS: 'id="tab_2-2"',
  TOP_SCORERS: 'id="tab_3-3"',
  REFEREES: 'id="tab_4-4"',
  REGULATIONS: 'id="tab_5-5"',
  JOINT_STANDINGS: 'id="tab_9-9"',
} as const

const STANDINGS_PANE_PREFIX = 'cfase_'
const JOINT_STANDINGS_PANE_PREFIX = 'cjfase_'
const LABEL_PATTERN = /id="ctl00_ContentPlaceHolder1_lblCompeticao"[^>]*>([\s\S]*?)<\/span>/
const COMPETITION_FOLDER_PATTERN = /ArquivosCompeticao\/(\d+)\//

export type CompetitionPage = {
  label: string
  fmfCompetitionId: number | null
  matches: TableMatch[]
  standings: StandingRow[]
  jointStandings: StandingRow[]
  topScorers: TopScorerRow[]
}

const readLabel = (html: string): string => decodeHtmlText(LABEL_PATTERN.exec(html)?.[1] ?? '')

export const parseCompetitionPage = (html: string): CompetitionPage => {
  const folderMatch = COMPETITION_FOLDER_PATTERN.exec(sliceBetween(html, TAB_MARKERS.REGULATIONS, TAB_MARKERS.JOINT_STANDINGS))

  return {
    label: readLabel(html),
    fmfCompetitionId: folderMatch ? Number(folderMatch[1]) : null,
    matches: parseTableTab(sliceBetween(html, TAB_MARKERS.TABLE, TAB_MARKERS.STANDINGS)),
    standings: parseStandingsTab(sliceBetween(html, TAB_MARKERS.STANDINGS, TAB_MARKERS.TOP_SCORERS), STANDINGS_PANE_PREFIX),
    jointStandings: parseStandingsTab(sliceBetween(html, TAB_MARKERS.JOINT_STANDINGS, null), JOINT_STANDINGS_PANE_PREFIX),
    topScorers: parseTopScorersTab(sliceBetween(html, TAB_MARKERS.TOP_SCORERS, TAB_MARKERS.REFEREES)),
  }
}
