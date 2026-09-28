'use client'

import type { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SEASON_PARAMETER } from '@/lib/routes'
import type { ChampionshipRibbonItemVM, SeasonYearVM } from '@/modules/championships/client'
import { ChampionshipRibbon } from '../championship-ribbon/championship-ribbon'
import { SeasonPanel } from '../season-panel/season-panel'
import { YearAxis } from '../year-axis/year-axis'

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
    <div className="relative z-20 flex h-[52px] flex-none items-center gap-[2px] overflow-visible border-b border-bd bg-pan0 px-[14px] mobile:h-[46px] mobile:px-2">
      <div className="relative flex flex-none items-center gap-[2px]">
        <SeasonPanel years={years} activeYear={activeYear} hrefForYear={hrefForYear} onSelectYear={rememberYear} />
        <YearAxis key={activeYear} years={years} activeYear={activeYear} hrefForYear={hrefForYear} onSelectYear={rememberYear} />
      </div>
      <span className="mx-[6px] my-[7px] w-px flex-none self-stretch bg-bd" />
      <ChampionshipRibbon championships={championships} activeChampionshipId={activeChampionshipId} />
    </div>
  )
}
