import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { championshipRibbonStyles as ribbonStyles } from '../championship-ribbon/championship-ribbon.styles'
import { yearAxisStyles } from '../year-axis/year-axis.styles'
import { seasonRailSkeletonStyles as skeletonStyles } from './season-rail.skeleton.styles'
import { seasonRailStyles as styles } from './season-rail.styles'

const YEAR_COUNT = 5
const CHIP_COUNT = 5
const DELAY_STEP_MS = 40
const CHIP_DELAY_OFFSET_MS = 280

export function SeasonRailSkeleton() {
  const years = skeletonSlots(YEAR_COUNT)
  const lastYearOrder = years.length - 1

  return (
    <div aria-hidden className={styles.rail}>
      <div className={styles.seasonControls}>
        <Skeleton className={skeletonStyles.seasonButton} />
        <Skeleton className={skeletonStyles.yearArrow} delayMs={DELAY_STEP_MS} />
        <div className={yearAxisStyles.years}>
          {years.map((slot) => {
            const isActive = slot.order === lastYearOrder
            const delayMs = (slot.order + 2) * DELAY_STEP_MS

            return (
              <span key={slot.slotId} className={cn(yearAxisStyles.yearSlot, skeletonStyles.yearSlotVisibility[slot.order])}>
                {slot.order > 0 ? <span className={cn(yearAxisStyles.connector, skeletonStyles.connectorVisibility[slot.order])} /> : null}
                <span className={cn(yearAxisStyles.yearBox, yearAxisStyles.yearLinkIdle)}>
                  <Skeleton className={isActive ? skeletonStyles.yearDotActive : skeletonStyles.yearDot} delayMs={delayMs} />
                  <Skeleton className={isActive ? skeletonStyles.yearActive : skeletonStyles.year} delayMs={delayMs} />
                </span>
              </span>
            )
          })}
        </div>
      </div>
      <span className={styles.divider} />
      <div className={ribbonStyles.ribbon}>
        {skeletonSlots(CHIP_COUNT).map((slot) => {
          const delayMs = CHIP_DELAY_OFFSET_MS + slot.order * DELAY_STEP_MS

          return (
            <span key={slot.slotId} className={cn(ribbonStyles.chipBox, ribbonStyles.chipIdle)}>
              <Skeleton className={skeletonStyles.chipDot} delayMs={delayMs} />
              <Skeleton className={cn(skeletonStyles.chipName, skeletonStyles.chipNameWidths[slot.order])} delayMs={delayMs} />
              <Skeleton className={skeletonStyles.chipCategory} delayMs={delayMs} />
              <Skeleton className={skeletonStyles.chipLastActivity} delayMs={delayMs} />
            </span>
          )
        })}
      </div>
      <span className={ribbonStyles.forwardSlot}>
        <Skeleton className={skeletonStyles.ribbonArrow} delayMs={CHIP_DELAY_OFFSET_MS + CHIP_COUNT * DELAY_STEP_MS} />
      </span>
    </div>
  )
}
