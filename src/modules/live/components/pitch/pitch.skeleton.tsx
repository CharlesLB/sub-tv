import * as R from 'remeda'
import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { layoutStarters, PitchMarkings, type PitchPlayer, SIDE, SIDES, type Side, STARTERS_PER_TEAM } from '@/modules/matches/client'
import { playerDotStyles } from '../player-dot/player-dot.styles'
import { pitchSkeletonStyles as styles } from './pitch.skeleton.styles'
import { pitchStyles } from './pitch.styles'

const DOT_DELAY_STEP_MS = 30
const FIRST_SHIRT_NUMBER = 1

const PLACEHOLDER_STARTERS: PitchPlayer[] = R.range(FIRST_SHIRT_NUMBER, FIRST_SHIRT_NUMBER + STARTERS_PER_TEAM).map((shirtNumber) => ({ key: String(shirtNumber), shirtNumber, position: null }))

const placeholderDotsOf = (side: Side) => Object.entries(layoutStarters(PLACEHOLDER_STARTERS, side === SIDE.HOME)).map(([key, point]) => ({ key: `${side}-${key}`, side, point }))

const PLACEHOLDER_DOTS = SIDES.flatMap(placeholderDotsOf).map((dot, order) => ({ ...dot, delayMs: order * DOT_DELAY_STEP_MS }))

export function PitchSkeleton() {
  return (
    <div aria-hidden className={pitchStyles.frame}>
      <div className={cn(pitchStyles.field, styles.fieldPulse)}>
        <PitchMarkings />
        {PLACEHOLDER_DOTS.map((dot) => (
          <div key={dot.key} className={playerDotStyles.wrapper} style={{ left: `${dot.point.x}%`, top: `${dot.point.y}%` }}>
            <Skeleton className={cn(styles.dot, dot.side === SIDE.AWAY && styles.awayDot)} delayMs={dot.delayMs} />
            <Skeleton className={cn(styles.name, dot.side === SIDE.AWAY && styles.awayDot)} delayMs={dot.delayMs + DOT_DELAY_STEP_MS} />
          </div>
        ))}
      </div>
    </div>
  )
}
