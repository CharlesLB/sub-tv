'use client'

import { cn } from '@/lib/utils/cn'
import { Icon } from '@/components/ui/icon/icon'
import type { Side } from '@/modules/matches/client'
import { useHorizontalScroll } from '../../hooks/use-horizontal-scroll'
import type { TimelineItem } from '../../state/timeline'
import { EventChip } from '../event-chip/event-chip'
import { ScrollArrow } from '../scroll-arrow/scroll-arrow'
import { eventsStripStyles as styles } from './events-strip.styles'

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
    <div data-screen-label="Linha do tempo" className={styles.strip}>
      <div className={styles.title}>Eventos</div>
      {showArrows ? <ScrollArrow direction="previous" isDisabled={edges.atStart} onClick={() => scrollBy(-1)} /> : null}
      <div ref={viewportRef} onScroll={onScroll} className={styles.viewport}>
        <div ref={contentRef} className={styles.content}>
          {newestFirst.map((item, index) => (
            <EventChip key={item.key} item={item} teamColor={item.side ? teamColors[item.side] : null} isNewest={index === 0} />
          ))}
          {items.length === 0 ? <span className={styles.emptyMessage}>gols, cartões e substituições aparecerão aqui</span> : null}
        </div>
      </div>
      {showArrows ? <ScrollArrow direction="next" isDisabled={edges.atEnd} onClick={() => scrollBy(1)} /> : null}
      {items.length > 0 ? (
        <div className={styles.count}>
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
          className={cn(styles.toggle, isExpanded ? styles.toggleExpanded : styles.toggleCollapsed)}
        >
          <Icon name="unfoldMore" size={16} className={cn(styles.toggleIcon, isExpanded && styles.toggleIconExpanded)} />
          {toggleLabel}
        </button>
      ) : null}
    </div>
  )
}
