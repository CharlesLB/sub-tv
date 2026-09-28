'use client'

import type { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SEASON_PARAMETER } from '@/lib/routes'
import type { ChampionshipRibbonItemVM, SeasonYearVM } from '@/modules/championships/client'
import { ChampionshipRibbon } from '../championship-ribbon/championship-ribbon'
import { SeasonPanel } from '../season-panel/season-panel'
import { YearAxis } from '../year-axis/year-axis'
import { seasonRailStyles as styles } from './season-rail.styles'

const SEASON_STORAGE_KEY = 'futebol-temporada'
const PRESERVED_PARAMETERS = ['cat'] as const

const rememberYear = (year: number) => {
  try {
    localStorage.setItem(SEASON_STORAGE_KEY, String(year))
  } catch {
    return
  }
}

const readRememberedYear = (): number | null => {
  try {
    const saved = Number(localStorage.getItem(SEASON_STORAGE_KEY))

    return Number.isInteger(saved) && saved > 0 ? saved : null
  } catch {
    return null
  }
}

type SeasonRailProps = {
  years: SeasonYearVM[]
  activeYear: number
  championships: ChampionshipRibbonItemVM[]
  activeChampionshipId?: string | null
  basePath: '/campeonatos' | '/elencos'
}

export function SeasonRail({ years, activeYear, championships, activeChampionshipId = null, basePath }: SeasonRailProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasExplicitYear = searchParams.has(SEASON_PARAMETER)

  const hrefForYear = (year: number): Route => {
    const query = new URLSearchParams(
      PRESERVED_PARAMETERS.flatMap((parameter) => {
        const value = searchParams.get(parameter)

        return value && basePath === '/elencos' ? [[parameter, value]] : []
      }),
    )

    query.set(SEASON_PARAMETER, String(year))

    return `${basePath}?${query.toString()}`
  }

  useEffect(() => {
    const rememberedYear = readRememberedYear()
    const isKnownYear = years.some((seasonYear) => seasonYear.year === rememberedYear)

    if (!hasExplicitYear && pathname === basePath && rememberedYear !== null && rememberedYear !== activeYear && isKnownYear) {
      router.replace(hrefForYear(rememberedYear))
    }
  })

  return (
    <div className={styles.rail}>
      <div className={styles.seasonControls}>
        <SeasonPanel years={years} activeYear={activeYear} hrefForYear={hrefForYear} onSelectYear={rememberYear} />
        <YearAxis key={activeYear} years={years} activeYear={activeYear} hrefForYear={hrefForYear} onSelectYear={rememberYear} />
      </div>
      <span className={styles.divider} />
      <ChampionshipRibbon championships={championships} activeChampionshipId={activeChampionshipId} />
    </div>
  )
}
