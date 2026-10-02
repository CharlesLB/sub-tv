'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useTransition } from 'react'
import { SEASON_PARAMETER } from '@/lib/routes'
import { NavigationProgress } from '@/components/ui/navigation-progress/navigation-progress'
import type { ChampionshipRibbonItemVM, SeasonYearVM } from '@/modules/championships/client'
import { readRememberedYear, rememberYear } from '../../lib/remembered-season/remembered-season'
import { SEASON_HREF_BUILDERS, type SeasonBasePath, type SeasonHref } from '../../lib/season-href/season-href'
import { ChampionshipRibbon } from '../championship-ribbon/championship-ribbon'
import { SeasonPanel } from '../season-panel/season-panel'
import { YearAxis } from '../year-axis/year-axis'
import { seasonRailStyles as styles } from './season-rail.styles'

const listIdentityOf = (championships: readonly ChampionshipRibbonItemVM[]): string => championships.map((championship) => championship.id).join()

type SeasonRailProps = {
  years: SeasonYearVM[]
  activeYear: number
  championships: ChampionshipRibbonItemVM[]
  activeChampionshipId?: string | null
  basePath: SeasonBasePath
}

export function SeasonRail({ years, activeYear, championships, activeChampionshipId = null, basePath }: SeasonRailProps) {
  const router = useRouter()
  const [isRedirecting, startRedirect] = useTransition()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasExplicitYear = searchParams.has(SEASON_PARAMETER)

  const hrefForYear = (year: number): SeasonHref => SEASON_HREF_BUILDERS[basePath]({ searchParams, year })

  useEffect(() => {
    const rememberedYear = readRememberedYear()
    const isKnownYear = years.some((seasonYear) => seasonYear.year === rememberedYear)

    if (!hasExplicitYear && pathname === basePath && rememberedYear !== null && rememberedYear !== activeYear && isKnownYear) {
      startRedirect(() => router.replace(SEASON_HREF_BUILDERS[basePath]({ searchParams, year: rememberedYear })))
    }
  }, [activeYear, basePath, hasExplicitYear, pathname, router, searchParams, years])

  return (
    <div className={styles.rail}>
      <div className={styles.seasonControls}>
        <SeasonPanel key={activeYear} years={years} activeYear={activeYear} hrefForYear={hrefForYear} onSelectYear={rememberYear} />
        <YearAxis key={activeYear} years={years} activeYear={activeYear} hrefForYear={hrefForYear} onSelectYear={rememberYear} />
      </div>
      <span className={styles.divider} />
      <ChampionshipRibbon key={listIdentityOf(championships)} championships={championships} activeChampionshipId={activeChampionshipId} />
      <NavigationProgress isActive={isRedirecting} />
    </div>
  )
}
