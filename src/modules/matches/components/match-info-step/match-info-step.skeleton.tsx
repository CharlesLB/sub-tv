import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { WizardNoticeSkeleton } from '../wizard-notice/wizard-notice.skeleton'
import { matchInfoStepSkeletonStyles as skeletonStyles } from './match-info-step.skeleton.styles'
import { matchInfoStepStyles as styles } from './match-info-step.styles'

const FIELD_DELAY_MS = 80

const labelWidthOf = (order: number): string => skeletonStyles.labelWidths[order] ?? skeletonStyles.labelWidths[0]

type MatchInfoStepSkeletonProps = { hasNotice: boolean }

export function MatchInfoStepSkeleton({ hasNotice }: MatchInfoStepSkeletonProps) {
  const fieldSlots = skeletonSlots(skeletonStyles.labelWidths.length)
  const wideFieldOrder = fieldSlots.length - 1

  return (
    <div aria-hidden className={styles.step}>
      <div className={styles.fields}>
        {fieldSlots.map(({ slotId, order }) => (
          <div key={slotId} className={cn(order === wideFieldOrder && styles.fieldWide)}>
            <span className={styles.label}>
              <Skeleton className={cn(skeletonStyles.textBar, labelWidthOf(order))} delayMs={order * FIELD_DELAY_MS} />
            </span>
            <Skeleton className={skeletonStyles.input} delayMs={order * FIELD_DELAY_MS} />
          </div>
        ))}
      </div>
      {hasNotice ? <WizardNoticeSkeleton /> : null}
    </div>
  )
}
