'use client'

import type { Route } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { useMediaQuery } from '@/lib/hooks/use-media-query/use-media-query'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import type { SeasonYearVM } from '@/modules/championships/client'
import { yearAxisStyles as styles } from './year-axis.styles'

const YEAR_DELAY_STEP_MS = 26

const useVisibleYearCount = (): number => {
  const isPhone = useMediaQuery('(max-width: 619px)')
  const isNarrow = useMediaQuery('(max-width: 899px)')
  const isCompact = useMediaQuery('(max-width: 1149px)')
  if (isPhone) return 1
  if (isNarrow) return 3
  if (isCompact) return 4

  return 5
}

const clamp = (value: number, minimum: number, maximum: number): number => Math.min(maximum, Math.max(minimum, value))

type YearAxisProps = {
  years: SeasonYearVM[]
  activeYear: number
  hrefForYear: (year: number) => Route
  onSelectYear: (year: number) => void
}

export function YearAxis({ years, activeYear, hrefForYear, onSelectYear }: YearAxisProps) {
  const visibleCount = useVisibleYearCount()
  const ascendingYears = [...years].sort((left, right) => left.year - right.year)
  const lastStart = Math.max(0, ascendingYears.length - visibleCount)
  const activeIndex = ascendingYears.findIndex((seasonYear) => seasonYear.year === activeYear)
  const centeredStart = clamp(activeIndex - Math.floor(visibleCount / 2), 0, lastStart)
  const [manualStart, setManualStart] = useState<number | null>(null)
  const windowStart = clamp(manualStart ?? centeredStart, 0, lastStart)
  const visibleYears = ascendingYears.slice(windowStart, windowStart + visibleCount)

  return (
    <>
      {windowStart > 0 ? (
        <button type="button" title="Anos anteriores" aria-label="Anos anteriores" onClick={() => setManualStart(windowStart - 1)} className={styles.arrow}>
          <Icon name="chevronLeft" size={16} />
        </button>
      ) : null}
      <div className={styles.years}>
        {visibleYears.map((seasonYear, index) => {
          const isActive = seasonYear.year === activeYear

          return (
            <span key={seasonYear.year} className={styles.yearSlot}>
              {index > 0 ? <span className={styles.connector} /> : null}
              <Link
                href={hrefForYear(seasonYear.year)}
                onClick={() => onSelectYear(seasonYear.year)}
                title={`${seasonYear.championshipCount} campeonatos · elenco ${seasonYear.year}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(styles.yearLink, isActive ? styles.yearLinkActive : styles.yearLinkIdle)}
                style={{ animationDelay: `${index * YEAR_DELAY_STEP_MS}ms` }}
              >
                <span className={cn(styles.yearDot, isActive ? styles.yearDotActive : styles.yearDotIdle)} />
                <span className={cn(styles.year, isActive ? styles.yearActive : styles.yearIdle)}>{seasonYear.year}</span>
              </Link>
            </span>
          )
        })}
      </div>
      {windowStart < lastStart ? (
        <button type="button" title="Anos seguintes" aria-label="Anos seguintes" onClick={() => setManualStart(windowStart + 1)} className={styles.arrow}>
          <Icon name="chevronRight" size={16} />
        </button>
      ) : null}
    </>
  )
}
