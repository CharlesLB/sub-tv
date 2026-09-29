import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { wizardFooterSkeletonStyles as skeletonStyles } from './wizard-footer.skeleton.styles'
import { wizardFooterStyles as styles } from './wizard-footer.styles'

const PART_DELAY_MS = 40

export function WizardFooterSkeleton() {
  return (
    <div aria-hidden className={styles.footer}>
      <Skeleton className={skeletonStyles.summaryToggle} />
      <span className={styles.hint}>
        <Skeleton className={skeletonStyles.hintLine} delayMs={PART_DELAY_MS} />
        <Skeleton className={skeletonStyles.mobileHintLine} delayMs={PART_DELAY_MS} />
      </span>
      <Skeleton className={skeletonStyles.backButton} delayMs={PART_DELAY_MS * 2} />
      <Skeleton className={skeletonStyles.nextButton} delayMs={PART_DELAY_MS * 3} />
    </div>
  )
}
