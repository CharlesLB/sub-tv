import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { wizardNoticeSkeletonStyles as skeletonStyles } from './wizard-notice.skeleton.styles'
import { wizardNoticeStyles as styles } from './wizard-notice.styles'

const LINE_DELAY_MS = 50

export function WizardNoticeSkeleton() {
  return (
    <div aria-hidden className={styles.notice}>
      <Skeleton className={skeletonStyles.icon} />
      <p className={cn(styles.text, skeletonStyles.lines)}>
        <Skeleton className={skeletonStyles.line} delayMs={LINE_DELAY_MS} />
        <Skeleton className={skeletonStyles.lastDesktopLine} delayMs={LINE_DELAY_MS * 2} />
        <Skeleton className={skeletonStyles.mobileLine} delayMs={LINE_DELAY_MS * 3} />
        <Skeleton className={skeletonStyles.lastMobileLine} delayMs={LINE_DELAY_MS * 4} />
      </p>
    </div>
  )
}
