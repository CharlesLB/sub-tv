import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { WIZARD_STEPS } from '../../wizard-reducer/wizard-reducer'
import { wizardStepperSkeletonStyles as skeletonStyles } from './wizard-stepper.skeleton.styles'
import { wizardStepperStyles as styles } from './wizard-stepper.styles'

const STEP_DELAY_MS = 60
const PART_DELAY_MS = 30

const titleWidthOf = (order: number): string => skeletonStyles.titleWidths[order] ?? skeletonStyles.titleWidths[0]

export function WizardStepperSkeleton() {
  return (
    <div aria-hidden className={styles.stepper}>
      {skeletonSlots(WIZARD_STEPS.length).map(({ slotId, order }) => {
        const delay = order * STEP_DELAY_MS

        return (
          <div key={slotId} className={cn(styles.step, order > 0 && styles.stepFollowing, styles.stepInactive, styles.stepPending)}>
            <Skeleton className={skeletonStyles.badge} delayMs={delay} />
            <span className={styles.text}>
              <span className={styles.title}>
                <Skeleton className={cn(skeletonStyles.textBar, titleWidthOf(order))} delayMs={delay + PART_DELAY_MS} />
              </span>
              <span className={styles.value}>
                <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.valueWidth)} delayMs={delay + PART_DELAY_MS * 2} />
              </span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
