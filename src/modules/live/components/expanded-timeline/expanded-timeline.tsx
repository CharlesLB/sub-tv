import { cn } from '@/lib/utils/cn'
import { type LiveTeamVM, SIDE, type Side } from '@/modules/matches/client'
import type { TimelineItem } from '../../state/timeline'
import { HEXAGON_MARK_SIZE, HexagonMark } from '../hexagon-mark/hexagon-mark'
import { RotateNotice } from '../rotate-notice/rotate-notice'
import { TimelineRow } from '../timeline-row/timeline-row'
import { expandedTimelineStyles as styles } from './expanded-timeline.styles'

type ExpandedTimelineProps = { items: TimelineItem[]; teams: Record<Side, LiveTeamVM>; showRotateNotice: boolean }

export function ExpandedTimeline({ items, teams, showRotateNotice }: ExpandedTimelineProps) {
  const home = teams[SIDE.HOME]
  const away = teams[SIDE.AWAY]

  return (
    <div data-screen-label="Linha do tempo expandida" className={styles.panel}>
      {showRotateNotice ? <RotateNotice /> : null}
      <div className={styles.header}>
        <span className={cn(styles.teamName, styles.homeTeamName)} style={{ color: home.color }}>
          {home.name}
        </span>
        <span className={styles.title}>Timeline</span>
        <span className={styles.teamName} style={{ color: away.color }}>
          {away.name}
        </span>
      </div>
      {items.map((item) => (
        <TimelineRow key={item.key} item={item} teams={teams} />
      ))}
      {items.length === 0 ? (
        <div className={styles.empty}>
          <HexagonMark size={HEXAGON_MARK_SIZE.SMALL} />
          <span className={styles.emptyTitle}>Nada registrado ainda</span>
          <span className={styles.emptyDescription}>Gols, cartões e substituições entram aqui em ordem de minuto.</span>
        </div>
      ) : null}
    </div>
  )
}
