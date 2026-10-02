'use client'

import { useEffect, useRef, useState } from 'react'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import { IntentLink } from '@/components/ui/intent-link/intent-link'
import { type ChampionshipRibbonItemVM, categoryBackgroundClass, categoryLabel, categoryTextClass } from '@/modules/championships/client'
import { describeWhen } from '../../lib/describe-when/describe-when'
import { championshipRibbonStyles as styles } from './championship-ribbon.styles'

const CHIP_DELAY_STEP_MS = 45
const SCROLL_TOLERANCE_PX = 2
const MINIMUM_SCROLL_STEP_PX = 180
const SCROLL_STEP_RATIO = 0.7

type ScrollState = { canScrollBack: boolean; canScrollForward: boolean }

const readScrollState = (element: HTMLElement): ScrollState => ({
  canScrollBack: element.scrollLeft > SCROLL_TOLERANCE_PX,
  canScrollForward: element.scrollLeft + element.clientWidth < element.scrollWidth - SCROLL_TOLERANCE_PX,
})

type ChampionshipRibbonProps = {
  championships: ChampionshipRibbonItemVM[]
  activeChampionshipId: string | null
}

export function ChampionshipRibbon({ championships, activeChampionshipId }: ChampionshipRibbonProps) {
  const ribbonRef = useRef<HTMLDivElement>(null)
  const [scrollState, setScrollState] = useState<ScrollState>({ canScrollBack: false, canScrollForward: false })
  const [now] = useState(() => new Date())

  useEffect(() => {
    const ribbon = ribbonRef.current
    if (!ribbon) return

    const update = () => setScrollState(readScrollState(ribbon))
    const observer = new ResizeObserver(update)
    observer.observe(ribbon)
    update()

    return () => observer.disconnect()
  }, [])

  const scrollBy = (direction: number) => {
    const ribbon = ribbonRef.current
    if (!ribbon) return
    ribbon.scrollBy({ left: direction * Math.max(MINIMUM_SCROLL_STEP_PX, ribbon.clientWidth * SCROLL_STEP_RATIO), behavior: 'smooth' })
  }

  return (
    <>
      {scrollState.canScrollBack ? (
        <button type="button" title="Campeonatos anteriores" aria-label="Campeonatos anteriores" onClick={() => scrollBy(-1)} className={styles.arrow}>
          <Icon name="chevronLeft" size={16} />
        </button>
      ) : null}
      <div ref={ribbonRef} onScroll={(event) => setScrollState(readScrollState(event.currentTarget))} className={styles.ribbon}>
        {championships.map((championship, index) => {
          const isActive = championship.id === activeChampionshipId

          return (
            <IntentLink
              key={championship.id}
              href={routes.championship(championship.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(styles.chipBox, styles.chip, isActive ? styles.chipActive : styles.chipIdle)}
              style={{ animationDelay: `${index * CHIP_DELAY_STEP_MS}ms` }}
            >
              <span className={cn(styles.categoryDot, categoryBackgroundClass[championship.category])} />
              <span className={cn(styles.name, isActive ? styles.nameActive : styles.nameIdle)}>{championship.name}</span>
              <span className={cn(styles.category, categoryTextClass[championship.category])}>{categoryLabel[championship.category]}</span>
              <span className={styles.lastActivity}>{describeWhen(championship.lastActivityAt, now)}</span>
            </IntentLink>
          )
        })}
      </div>
      {scrollState.canScrollForward ? (
        <span className={styles.forwardSlot}>
          <button type="button" title="Mais campeonatos" aria-label="Mais campeonatos" onClick={() => scrollBy(1)} className={styles.arrow}>
            <Icon name="chevronRight" size={16} />
          </button>
        </span>
      ) : null}
    </>
  )
}
