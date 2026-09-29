import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { RotateNotice } from '../rotate-notice/rotate-notice'
import { timelineRowStyles } from '../timeline-row/timeline-row.styles'
import { expandedTimelineSkeletonStyles as styles } from './expanded-timeline.skeleton.styles'
import { expandedTimelineStyles } from './expanded-timeline.styles'

const PLACEHOLDER_ROWS = 3
const ROW_DELAY_STEP_MS = 80
const FIRST_ROW_DELAY_MS = 120
const AWAY_ROW_PARITY = 1

type ExpandedTimelineSkeletonProps = { showRotateNotice: boolean }

export function ExpandedTimelineSkeleton({ showRotateNotice }: ExpandedTimelineSkeletonProps) {
  return (
    <div aria-hidden className={expandedTimelineStyles.panel}>
      {showRotateNotice ? <RotateNotice /> : null}
      <div className={expandedTimelineStyles.header}>
        <Skeleton className={styles.homeTeamName} />
        <Skeleton className={styles.title} delayMs={40} />
        <Skeleton className={styles.awayTeamName} delayMs={80} />
      </div>
      {skeletonSlots(PLACEHOLDER_ROWS).map(({ slotId, order }) => {
        const delayMs = FIRST_ROW_DELAY_MS + order * ROW_DELAY_STEP_MS
        const isAway = order % 2 === AWAY_ROW_PARITY

        return (
          <div key={slotId} className={timelineRowStyles.row}>
            <div className={timelineRowStyles.homeCell}>
              {isAway ? null : (
                <>
                  <Skeleton className={styles.eventName} delayMs={delayMs} />
                  <Skeleton className={styles.eventIcon} delayMs={delayMs} />
                </>
              )}
            </div>
            <Skeleton className={styles.minute} delayMs={delayMs} />
            <div className={timelineRowStyles.awayCell}>
              {isAway ? (
                <>
                  <Skeleton className={styles.eventIcon} delayMs={delayMs} />
                  <Skeleton className={styles.eventName} delayMs={delayMs} />
                </>
              ) : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
