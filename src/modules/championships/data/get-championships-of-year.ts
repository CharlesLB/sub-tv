import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache/tags'
import { describeSeasonStatus, summarizeSeasonMatches } from '../season-summary/season-summary'
import type { ChampionshipCardVM, ChampionshipRibbonItemVM } from '../types'
import { getSeasonMatches } from './get-season-matches'
import { getSeasonRows } from './get-season-rows'
import { getStandings } from './get-standings'

const PODIUM_SIZE = 3

export const getChampionshipsOfYear = async (year: number): Promise<ChampionshipCardVM[]> => {
  'use cache'
  cacheLife('minutes')
  cacheTag(tags.seasons(), tags.fmfData())

  const seasonRows = await getSeasonRows({ year })

  return Promise.all(
    seasonRows.map(async (season) => {
      const [matches, standings] = await Promise.all([getSeasonMatches(season.id), getStandings(season.id)])
      const matchSummary = summarizeSeasonMatches(matches)
      const summary = { ...matchSummary, isFinished: matchSummary.isFinished && !season.isCurrent }
      const leaguePhaseRows = standings[0]?.groups.flatMap((group) => group.rows) ?? []

      return {
        id: season.id,
        name: season.name,
        category: season.category,
        year: season.year,
        statusLine: describeSeasonStatus(season.year, summary),
        isFinished: summary.isFinished,
        teamCount: season.teamCount,
        athleteCount: season.athleteCount,
        podium: [...leaguePhaseRows]
          .sort((left, right) => left.position - right.position || right.points - left.points)
          .slice(0, PODIUM_SIZE)
          .map((row, index) => ({ position: index + 1, team: row.team, points: row.points })),
        nextMatch: summary.nextMatch,
        liveMatch: summary.liveMatch,
        lastActivityAt: summary.lastActivityAt,
      }
    }),
  )
}

export const toRibbonItems = (championships: ChampionshipCardVM[]): ChampionshipRibbonItemVM[] =>
  [...championships]
    .sort((left, right) => (right.lastActivityAt ?? '').localeCompare(left.lastActivityAt ?? ''))
    .map((championship) => ({
      id: championship.id,
      name: championship.name,
      category: championship.category,
      year: championship.year,
      lastActivityAt: championship.lastActivityAt,
      isFinished: championship.isFinished,
    }))
