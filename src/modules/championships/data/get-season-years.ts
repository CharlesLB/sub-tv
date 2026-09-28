import 'server-only'
import { count, desc } from 'drizzle-orm'
import { cacheLife, cacheTag } from 'next/cache'
import { tags } from '@/lib/cache/tags'
import { db, tables } from '@/lib/db'
import type { SeasonYearVM } from '../types'

const FALLBACK_YEAR = 2026

export const getSeasonYears = async (): Promise<SeasonYearVM[]> => {
  'use cache'
  cacheLife('hours')
  cacheTag(tags.seasons(), tags.fmfData())

  return db
    .select({ year: tables.seasons.year, championshipCount: count() })
    .from(tables.seasons)
    .groupBy(tables.seasons.year)
    .orderBy(desc(tables.seasons.year))
}

export const resolveYear = (requestedYear: string | undefined, years: SeasonYearVM[]): number => {
  const parsedYear = Number(requestedYear)
  const knownYear = years.find((seasonYear) => seasonYear.year === parsedYear)

  return knownYear?.year ?? years[0]?.year ?? FALLBACK_YEAR
}
