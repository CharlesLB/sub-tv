import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { BrandLogo } from '../brand-logo/brand-logo'
import { platformRailSkeletonStyles as skeletonStyles } from './platform-rail.skeleton.styles'
import { platformRailStyles as styles } from './platform-rail.styles'

const DESTINATION_COUNT = 3
const DESTINATION_DELAY_STEP_MS = 80

export function PlatformRailSkeleton() {
  return (
    <div aria-hidden className={styles.rail}>
      <div className={styles.brand}>
        <BrandLogo />
      </div>
      <div className={styles.destinations}>
        {skeletonSlots(DESTINATION_COUNT).map((slot) => (
          <div key={slot.slotId} className={cn(styles.destinationBox, styles.destinationMobile)}>
            <Skeleton className={skeletonStyles.icon} delayMs={slot.order * DESTINATION_DELAY_STEP_MS} />
            <Skeleton className={cn(skeletonStyles.label, skeletonStyles.labelWidths[slot.order])} delayMs={slot.order * DESTINATION_DELAY_STEP_MS} />
          </div>
        ))}
      </div>
    </div>
  )
}
