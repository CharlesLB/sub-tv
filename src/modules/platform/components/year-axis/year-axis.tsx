'use client'

import Link from 'next/link'
import type { Route } from 'next'
import { useState } from 'react'
import { Icon } from '@/components/ui/icon/icon'
import { useMediaQuery } from '@/lib/hooks/use-media-query/use-media-query'
import { cn } from '@/lib/utils/cn'
import type { SeasonYearVM } from '@/modules/championships/client'

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
  const arrowClassName = 'flex h-[30px] w-[26px] flex-none items-center justify-center rounded-card border border-bd bg-transparent text-tx3 hover:border-tx3 hover:text-tx'

  return (
    <>
      {windowStart > 0 ? (
        <button type="button" title="Anos anteriores" aria-label="Anos anteriores" onClick={() => setManualStart(windowStart - 1)} className={arrowClassName}>
          <Icon name="chevronLeft" size={16} />
        </button>
      ) : null}
      <div className="flex flex-none items-stretch">
        {visibleYears.map((seasonYear, index) => {
          const isActive = seasonYear.year === activeYear

          return (
            <span key={seasonYear.year} className="flex flex-none items-center">
              {index > 0 ? <span className="h-px w-4 flex-none bg-bd2" /> : null}
              <Link
                href={hrefForYear(seasonYear.year)}
                onClick={() => onSelectYear(seasonYear.year)}
                title={`${seasonYear.championshipCount} campeonatos · elenco ${seasonYear.year}`}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex h-8 flex-none animate-fade-in items-center gap-[6px] border-b-2 px-[9px] transition-colors hover:text-tx',
                  isActive ? 'border-ac' : 'border-transparent',
                )}
                style={{ animationDelay: `${index * YEAR_DELAY_STEP_MS}ms` }}
              >
                <span className={cn('flex-none rounded-full transition-all duration-200', isActive ? 'size-2 bg-ac' : 'size-[5px] bg-bd3')} />
                <span className={cn('tracking-[-.01em] transition-all duration-200', isActive ? 'text-[15px] font-extrabold text-tx' : 'text-[13px] font-bold text-tx4')}>
                  {seasonYear.year}
                </span>
              </Link>
            </span>
          )
        })}
      </div>
      {windowStart < lastStart ? (
        <button type="button" title="Anos seguintes" aria-label="Anos seguintes" onClick={() => setManualStart(windowStart + 1)} className={arrowClassName}>
          <Icon name="chevronRight" size={16} />
        </button>
      ) : null}
    </>
  )
}
