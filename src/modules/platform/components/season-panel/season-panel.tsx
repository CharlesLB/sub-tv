'use client'

import * as Popover from '@radix-ui/react-popover'
import { useId, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { IntentLink } from '@/components/ui/intent-link/intent-link'
import type { SeasonYearVM } from '@/modules/championships/client'
import type { SeasonHref } from '../../lib/season-href/season-href'
import { seasonPanelStyles as styles } from './season-panel.styles'

const GRID_ITEM_DELAY_MS = 14

type SeasonPanelProps = {
  years: SeasonYearVM[]
  activeYear: number
  hrefForYear: (year: number) => SeasonHref
  onSelectYear: (year: number) => void
}

export function SeasonPanel({ years, activeYear, hrefForYear, onSelectYear }: SeasonPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const headingId = useId()

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger title="Todas as temporadas" aria-label="Todas as temporadas" className={cn(styles.trigger, isOpen ? styles.triggerOpen : styles.triggerClosed)}>
        <Icon name="calendarMonth" size={16} />
      </Popover.Trigger>
      {isOpen ? <div aria-hidden className={styles.scrim} /> : null}
      <Popover.Portal>
        <Popover.Content side="bottom" align="start" sideOffset={7} aria-labelledby={headingId} className={styles.panel}>
          <div className={styles.header}>
            <span id={headingId} className={styles.heading}>
              Temporadas
            </span>
            <span className={styles.subheading}>Elenco próprio por ano</span>
          </div>
          <div className={styles.grid}>
            {years.map((seasonYear, index) => {
              const isActive = seasonYear.year === activeYear

              return (
                <IntentLink
                  shouldPrefetchOnView
                  key={seasonYear.year}
                  href={hrefForYear(seasonYear.year)}
                  onClick={() => {
                    onSelectYear(seasonYear.year)
                    if (isActive) setIsOpen(false)
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(styles.yearLink, isActive ? styles.yearLinkActive : styles.yearLinkIdle)}
                  style={{ animationDelay: `${index * GRID_ITEM_DELAY_MS}ms` }}
                >
                  <span className={cn(styles.year, isActive ? styles.yearActive : styles.yearIdle)}>{seasonYear.year}</span>{' '}
                  <span className={styles.championshipCount}>{seasonYear.championshipCount} Camp.</span>
                </IntentLink>
              )
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
