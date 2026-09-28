'use client'

import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import type { Side } from '@/modules/matches/client'
import { useHorizontalScroll } from '../../hooks/use-horizontal-scroll'
import type { TimelineItem } from '../../state/timeline'
import { EventChip } from '../event-chip/event-chip'
import { ScrollArrow } from '../scroll-arrow/scroll-arrow'

type EventsStripProps = {
  items: TimelineItem[]
  teamColors: Record<Side, string>
  isExpanded: boolean
  canExpand: boolean
  onToggleExpanded: () => void
}

export function EventsStrip({ items, teamColors, isExpanded, canExpand, onToggleExpanded }: EventsStripProps) {
  const { edges, viewportRef, contentRef, onScroll, scrollBy } = useHorizontalScroll()
  const newestFirst = items.toReversed()
  const showArrows = items.length > 0 && edges.canScroll
  const toggleLabel = isExpanded ? 'Recolher' : 'Expandir'

  return (
    <div data-screen-label="Linha do tempo" className="flex flex-none items-center gap-[10px] border-b border-bd bg-bg px-[14px] py-2">
      <div className="flex-none text-[11.3px] font-semibold tracking-[-.01em] text-tx4">Eventos</div>
      {showArrows ? <ScrollArrow direction="previous" isDisabled={edges.atStart} onClick={() => scrollBy(-1)} /> : null}
      <div ref={viewportRef} onScroll={onScroll} className="no-scrollbar min-w-0 flex-1 overflow-x-auto scroll-smooth">
        <div ref={contentRef} className="flex w-max items-center gap-2">
          {newestFirst.map((item, index) => (
            <EventChip key={item.key} item={item} teamColor={item.side ? teamColors[item.side] : null} isNewest={index === 0} />
          ))}
          {items.length === 0 ? <span className="text-[11.5px] whitespace-nowrap text-tx4">gols, cartões e substituições aparecerão aqui</span> : null}
        </div>
      </div>
      {showArrows ? <ScrollArrow direction="next" isDisabled={edges.atEnd} onClick={() => scrollBy(1)} /> : null}
      {items.length > 0 ? (
        <div className="flex-none text-[11.5px] text-tx4 nums">
          {items.length} {items.length === 1 ? 'Evento' : 'Eventos'}
        </div>
      ) : null}
      {canExpand ? (
        <button
          type="button"
          onClick={onToggleExpanded}
          aria-expanded={isExpanded}
          title="Expandir a linha do tempo"
          aria-label="Expandir a linha do tempo"
          className={cn(
            'flex h-[30px] flex-none items-center gap-[6px] rounded-card border px-[11px] text-[9.9px] font-bold tracking-[-.01em]',
            isExpanded ? 'border-ac bg-pan2 text-ac' : 'border-bd bg-transparent text-tx3 hover:border-bd3 hover:text-tx',
          )}
        >
          <Icon name="unfoldMore" size={16} className={cn('transition-transform duration-200', isExpanded && 'rotate-180')} />
          {toggleLabel}
        </button>
      ) : null}
    </div>
  )
}
