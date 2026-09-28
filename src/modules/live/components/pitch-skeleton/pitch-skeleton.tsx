import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { PitchLines } from '../pitch-lines/pitch-lines'
import { pitchSkeletonStyles as styles } from './pitch-skeleton.styles'

const LINE_COLUMNS = [
  { key: 'home-keeper', className: styles.lineColumnPlacement.homeKeeper, delays: [0], isFaint: false },
  { key: 'home-defense', className: styles.lineColumnPlacement.homeDefense, delays: [80, 140, 200], isFaint: false },
  { key: 'home-attack', className: styles.lineColumnPlacement.homeAttack, delays: [260, 320, 380], isFaint: false },
  { key: 'away-attack', className: styles.lineColumnPlacement.awayAttack, delays: [440, 500, 560], isFaint: true },
  { key: 'away-defense', className: styles.lineColumnPlacement.awayDefense, delays: [620, 680, 740], isFaint: true },
  { key: 'away-keeper', className: styles.lineColumnPlacement.awayKeeper, delays: [800], isFaint: true },
] as const

export function PitchSkeleton() {
  return (
    <div className={styles.frame}>
      <div className={styles.field}>
        <PitchLines />
        {LINE_COLUMNS.map((column) => (
          <div key={column.key} className={cn(styles.lineColumn, column.className)}>
            {column.delays.map((delayMs) => (
              <Skeleton key={delayMs} className={cn(styles.dot, column.isFaint && styles.faintDot)} delayMs={delayMs} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
