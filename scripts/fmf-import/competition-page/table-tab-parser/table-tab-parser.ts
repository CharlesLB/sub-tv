import { decodeHtmlText, parseInteger } from '../../html-text/html-text'
import { type TeamReference, readCrestReference, splitPhasePanes } from '../page-sections/page-sections'
import { parseLongPortugueseDate } from '../portuguese-date/portuguese-date'

const PHASE_PANE_PREFIX = 'fase_'
const ROUND_BOX_MARKER = '<h3 class="box-title_es">'
const ROUND_PATTERN = /^RODADA\s+(\d+)/i
const ROW_PATTERN = /<td colspan="4"><b>([^<]*)<\/b><\/td>|<td align=center>(\d{1,2}:\d{2})?<br>Jogo (\d+)<\/td>/g
const TEAM_PATTERN = /<img src="([^"]+)"[^>]*><br>([^<]*)<\/small>/g
const SCORE_PATTERN = /<td nowrap>([^<]*)<\/td>/
const SCORE_VALUES_PATTERN = /^(\d+)\s*X\s*(\d+)$/i
const VENUE_PATTERN = /<td colspan=4><small>([^<]*)<br>([^<]*)<\/small>/
const OFFICIAL_PATTERN = /([^<>]*RBITRO[^<>]*)<br><font[^>]*>([^<]*)<\/font>/g
const SUMULA_LINK_PATTERN = /href="(https?:\/\/sge\.fmf\.com\.br\/sumulas\/[^"]+\.pdf)"/i

export const OFFICIAL_ROLE = {
  ARBITRO: 'arbitro',
  ASSISTENTE_1: 'assistente_1',
  ASSISTENTE_2: 'assistente_2',
  QUARTO_ARBITRO: 'quarto_arbitro',
  QUINTO_ARBITRO: 'quinto_arbitro',
} as const

export type OfficialRole = (typeof OFFICIAL_ROLE)[keyof typeof OFFICIAL_ROLE]

const OFFICIAL_LABELS: Readonly<Record<string, OfficialRole>> = {
  'ÁRBITRO': OFFICIAL_ROLE.ARBITRO,
  'ÁRBITRO ASSISTENTE 1': OFFICIAL_ROLE.ASSISTENTE_1,
  'ÁRBITRO ASSISTENTE 2': OFFICIAL_ROLE.ASSISTENTE_2,
  'QUARTO ÁRBITRO': OFFICIAL_ROLE.QUARTO_ARBITRO,
  'QUINTO ÁRBITRO': OFFICIAL_ROLE.QUINTO_ARBITRO,
}

export type MatchOfficial = { role: OfficialRole; name: string }

export type TableMatch = {
  phase: string
  round: number | null
  matchNumber: number
  date: string | null
  time: string | null
  home: TeamReference
  away: TeamReference
  homeScore: number | null
  awayScore: number | null
  venue: string | null
  city: string | null
  officials: MatchOfficial[]
  sumulaUrl: string | null
}

type RowToken = { start: number; end: number; date: string | null; time: string | null; matchNumber: number | null }

const readTeams = (segment: string): TeamReference[] =>
  [...segment.matchAll(TEAM_PATTERN)].flatMap((match) => {
    const crest = readCrestReference(match[1] ?? '')

    return crest ? [{ ...crest, shortName: decodeHtmlText(match[2] ?? '') }] : []
  })

const readScore = (segment: string): { homeScore: number | null; awayScore: number | null } => {
  const scoreText = decodeHtmlText(SCORE_PATTERN.exec(segment)?.[1] ?? '')
  const values = SCORE_VALUES_PATTERN.exec(scoreText)

  return { homeScore: values ? Number(values[1]) : null, awayScore: values ? Number(values[2]) : null }
}

const readOfficials = (segment: string): MatchOfficial[] =>
  [...segment.matchAll(OFFICIAL_PATTERN)].flatMap((match) => {
    const role = OFFICIAL_LABELS[decodeHtmlText(match[1] ?? '').toUpperCase()]
    const name = decodeHtmlText(match[2] ?? '')

    return role && name ? [{ role, name }] : []
  })

const emptyToNull = (text: string): string | null => (text.length > 0 ? text : null)

const tokenizeRows = (boxHtml: string): RowToken[] =>
  [...boxHtml.matchAll(ROW_PATTERN)].map((match) => ({
    start: match.index,
    end: match.index + match[0].length,
    date: match[1] === undefined ? null : parseLongPortugueseDate(decodeHtmlText(match[1])),
    time: match[2] ?? null,
    matchNumber: match[3] === undefined ? null : Number(match[3]),
  }))

const parseRoundBox = (phase: string, boxHtml: string): TableMatch[] => {
  const round = parseInteger(ROUND_PATTERN.exec(decodeHtmlText(boxHtml.slice(0, boxHtml.indexOf('</h3>'))))?.[1] ?? '')
  const tokens = tokenizeRows(boxHtml)

  return tokens.flatMap((token, index) => {
    if (token.matchNumber === null) return []
    const segment = boxHtml.slice(token.end, tokens[index + 1]?.start ?? boxHtml.length)
    const [home, away] = readTeams(segment)
    if (!home || !away) return []
    const date = tokens.slice(0, index).findLast((candidate) => candidate.date !== null)?.date ?? null
    const venue = VENUE_PATTERN.exec(segment)

    return [
      {
        phase,
        round,
        matchNumber: token.matchNumber,
        date,
        time: token.time,
        home,
        away,
        ...readScore(segment),
        venue: emptyToNull(decodeHtmlText(venue?.[1] ?? '')),
        city: emptyToNull(decodeHtmlText(venue?.[2] ?? '')),
        officials: readOfficials(segment),
        sumulaUrl: SUMULA_LINK_PATTERN.exec(segment)?.[1] ?? null,
      },
    ]
  })
}

export const parseTableTab = (sectionHtml: string): TableMatch[] =>
  splitPhasePanes(sectionHtml, PHASE_PANE_PREFIX).flatMap((pane) =>
    pane.html
      .split(ROUND_BOX_MARKER)
      .slice(1)
      .flatMap((boxHtml) => parseRoundBox(pane.name, boxHtml)),
  )
