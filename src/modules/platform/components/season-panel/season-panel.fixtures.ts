import { routes } from '@/lib/routes'
import type { SeasonYearVM } from '@/modules/championships/client'

export const seasonYearsFixture: SeasonYearVM[] = [
  { year: 2025, championshipCount: 4 },
  { year: 2024, championshipCount: 5 },
  { year: 2023, championshipCount: 3 },
  { year: 2022, championshipCount: 4 },
  { year: 2021, championshipCount: 2 },
  { year: 2020, championshipCount: 1 },
  { year: 2019, championshipCount: 3 },
]

export const ACTIVE_YEAR_FIXTURE = 2025

export const championshipsHrefForYear = (year: number) => routes.championships(year)
