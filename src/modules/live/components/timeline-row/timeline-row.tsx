import { type LiveTeamVM, SIDE, type Side } from '@/modules/matches/client'
import type { TimelineItem } from '../../state/timeline'
import { EventIcon } from '../event-icon/event-icon'
import { timelineRowStyles as styles } from './timeline-row.styles'

type TimelineRowProps = { item: TimelineItem; teams: Record<Side, LiveTeamVM> }

export function TimelineRow({ item, teams }: TimelineRowProps) {
  const team = item.side ? teams[item.side] : null
  const isAway = item.side === SIDE.AWAY
  const icon = <EventIcon kind={item.kind} teamColor={team?.color ?? null} size={19} />

  return (
    <div className={styles.row}>
      <div className={styles.homeCell}>
        {isAway ? null : (
          <>
            <span className={styles.name}>{item.text}</span>
            {team ? <span className={styles.meta}>{team.abbreviation}</span> : null}
            {icon}
          </>
        )}
      </div>
      <span className={styles.minute}>{item.minuteLabel}</span>
      <div className={styles.awayCell}>
        {isAway ? (
          <>
            {icon}
            <span className={styles.name}>{item.text}</span>
            {team ? <span className={styles.meta}>{team.abbreviation}</span> : null}
          </>
        ) : null}
      </div>
    </div>
  )
}
