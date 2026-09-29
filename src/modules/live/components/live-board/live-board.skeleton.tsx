import { cn } from '@/lib/utils/cn'
import { SIDE } from '@/modules/matches/client'
import { BenchColumnSkeleton } from '../bench-column/bench-column.skeleton'
import { boardAreaStyles } from '../board-area/board-area.styles'
import { EventsStripSkeleton } from '../events-strip/events-strip.skeleton'
import { ExpandedTimelineSkeleton } from '../expanded-timeline/expanded-timeline.skeleton'
import { LiveScoreboardSkeleton } from '../live-scoreboard/live-scoreboard.skeleton'
import { liveScreenStyles } from '../live-screen/live-screen.styles'
import { OfficialsStripSkeleton } from '../officials-strip/officials-strip.skeleton'
import { PitchSkeleton } from '../pitch/pitch.skeleton'
import { liveBoardSkeletonStyles as styles } from './live-board.skeleton.styles'

export function LiveSkeleton() {
  return (
    <div aria-hidden className={liveScreenStyles.screen}>
      <LiveScoreboardSkeleton />
      <OfficialsStripSkeleton />
      <EventsStripSkeleton />
      <div className={cn(boardAreaStyles.board, styles.boardOutsidePortraitPhone)}>
        <BenchColumnSkeleton side={SIDE.HOME} />
        <PitchSkeleton />
        <BenchColumnSkeleton side={SIDE.AWAY} />
      </div>
      <div className={styles.timelineOnPortraitPhone}>
        <ExpandedTimelineSkeleton showRotateNotice />
      </div>
    </div>
  )
}
