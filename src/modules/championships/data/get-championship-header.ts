import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache/tags'
import { describeSeasonStatus, summarizeSeasonMatches } from '../lib/season-summary/season-summary'
import type { ChampionshipHeaderVM } from '../types'
import { getSeasonMatches } from './get-season-matches'
import { getSeasonRows } from './get-season-rows'

export const getChampionshipHeader = async (seasonId: string): Promise<ChampionshipHeaderVM | null> => {
  'use cache'
  cacheLife('minutes')
  cacheTag(tags.season(seasonId), tags.fmfData())

  const [season] = await getSeasonRows({ seasonId })
  if (!season) return null

  const matchSummary = summarizeSeasonMatches(await getSeasonMatches(seasonId))
  const summary = { ...matchSummary, isFinished: matchSummary.isFinished && !season.isCurrent }

  return {
    id: season.id,
    name: season.name,
    category: season.category,
    year: season.year,
    label: season.label,
    statusLine: describeSeasonStatus(season.year, summary),
    teamCount: season.teamCount,
    currentRound: summary.currentRound,
    isFinished: summary.isFinished,
  }
}
