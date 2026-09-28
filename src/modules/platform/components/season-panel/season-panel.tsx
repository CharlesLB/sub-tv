'use client'

import * as Popover from '@radix-ui/react-popover'
import type { Route } from 'next'
import Link from 'next/link'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import type { SeasonYearVM } from '@/modules/championships/client'

const GRID_ITEM_DELAY_MS = 14

type SeasonPanelProps = {
  years: SeasonYearVM[]
  activeYear: number
  hrefForYear: (year: number) => Route
  onSelectYear: (year: number) => void
}

export function SeasonPanel({ years, activeYear, hrefForYear, onSelectYear }: SeasonPanelProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger
        title="Todas as temporadas"
        aria-label="Todas as temporadas"
        className={cn(
          'flex size-[30px] flex-none items-center justify-center rounded-card border hover:border-tx3 hover:text-tx',
          isOpen ? 'border-ac bg-pan2 text-ac' : 'border-bd bg-transparent text-tx4',
        )}
      >
        <Icon name="calendarMonth" size={16} />
      </Popover.Trigger>
      {isOpen ? <div aria-hidden className="fixed inset-0 z-[55] animate-fade-in bg-scrim-leve" /> : null}
      <Popover.Portal>
        <Popover.Content
          side="bottom"
          align="start"
          sideOffset={7}
          className="z-[60] flex w-[min(92vw,340px)] animate-pop-in flex-col gap-[9px] border border-bd2 bg-pan2 px-3 pt-[13px] pb-[11px] text-tx chamfer"
        >
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[11.3px] font-bold tracking-[-.01em] text-tx1">Temporadas</span>
            <span className="text-[9.5px] tracking-[.1em] text-tx4">Elenco próprio por ano</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {years.map((seasonYear, index) => {
              const isActive = seasonYear.year === activeYear

              return (
                <Link
                  key={seasonYear.year}
                  href={hrefForYear(seasonYear.year)}
                  onClick={() => {
                    onSelectYear(seasonYear.year)
                    setIsOpen(false)
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'flex animate-grade-in flex-col items-start gap-[2px] rounded-card border px-2 py-[7px] transition-colors hover:bg-bd',
                    isActive ? 'border-ac bg-bd' : 'border-transparent bg-transparent',
                  )}
                  style={{ animationDelay: `${index * GRID_ITEM_DELAY_MS}ms` }}
                >
                  <span className={cn('text-[12.6px] font-bold tracking-[-.01em]', isActive ? 'text-ac' : 'text-tx1')}>{seasonYear.year}</span>
                  <span className="text-[9px] tracking-[.08em] text-tx4">{seasonYear.championshipCount} Camp.</span>
                </Link>
              )
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
