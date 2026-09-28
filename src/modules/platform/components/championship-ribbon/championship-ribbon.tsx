'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Icon } from '@/components/ui/icon/icon'
import { cn } from '@/lib/utils/cn'
import { routes } from '@/lib/routes'
import { categoryBackgroundClass, categoryLabel, categoryTextClass, type ChampionshipRibbonItemVM } from '@/modules/championships/client'
import { describeWhen } from '../../describe-when/describe-when'

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
  }, [championships])

  const scrollBy = (direction: number) => {
    const ribbon = ribbonRef.current
    if (!ribbon) return
    ribbon.scrollBy({ left: direction * Math.max(MINIMUM_SCROLL_STEP_PX, ribbon.clientWidth * SCROLL_STEP_RATIO), behavior: 'smooth' })
  }
  const arrowClassName = 'flex size-[26px] flex-none animate-fade-in items-center justify-center rounded-card border border-bd bg-transparent text-tx4 hover:border-tx3 hover:text-tx'

  return (
    <>
      {scrollState.canScrollBack ? (
        <button type="button" title="Campeonatos anteriores" aria-label="Campeonatos anteriores" onClick={() => scrollBy(-1)} className={arrowClassName}>
          <Icon name="chevronLeft" size={16} />
        </button>
      ) : null}
      <div
        ref={ribbonRef}
        onScroll={(event) => setScrollState(readScrollState(event.currentTarget))}
        className="no-scrollbar flex min-w-0 flex-[1_1_auto] items-center gap-[6px] overflow-x-auto overflow-y-hidden p-[2px]"
      >
        {championships.map((championship, index) => {
          const isActive = championship.id === activeChampionshipId

          return (
            <Link
              key={championship.id}
              href={routes.championship(championship.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex h-[30px] flex-none animate-chip-in items-center gap-2 rounded-card border px-[11px] text-tx transition-[border-color,background,transform] duration-150 hover:-translate-y-px hover:border-bd3',
                isActive ? 'border-ac bg-pan2' : 'border-bd bg-transparent',
              )}
              style={{ animationDelay: `${index * CHIP_DELAY_STEP_MS}ms` }}
            >
              <span className={cn('size-[7px] flex-none', categoryBackgroundClass[championship.category])} />
              <span className={cn('text-[11.3px] font-bold tracking-[-.01em] whitespace-nowrap', isActive ? 'text-tx' : 'text-tx1')}>{championship.name}</span>
              <span className={cn('text-[9.5px] tracking-[.08em] whitespace-nowrap', categoryTextClass[championship.category])}>
                {categoryLabel[championship.category]}
              </span>
              <span className="text-[9.5px] tracking-[.08em] whitespace-nowrap text-tx4">{describeWhen(championship.lastActivityAt, now)}</span>
            </Link>
          )
        })}
      </div>
      {scrollState.canScrollForward ? (
        <span className="flex flex-none items-center pl-[6px]">
          <button type="button" title="Mais campeonatos" aria-label="Mais campeonatos" onClick={() => scrollBy(1)} className={arrowClassName}>
            <Icon name="chevronRight" size={16} />
          </button>
        </span>
      ) : null}
    </>
  )
}
