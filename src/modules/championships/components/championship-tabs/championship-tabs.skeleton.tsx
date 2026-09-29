import { cn } from '@/lib/utils/cn'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { CHAMPIONSHIP_TABS } from '../../championship-tab'
import { championshipTabsSkeletonStyles as skeletonStyles } from './championship-tabs.skeleton.styles'
import { championshipTabsStyles as styles } from './championship-tabs.styles'

const TAB_DELAY_STEP_MS = 80

export function ChampionshipTabsSkeleton() {
  return (
    <div aria-hidden className={styles.navigation}>
      {CHAMPIONSHIP_TABS.map((entry, index) => (
        <span key={entry.tab} className={cn(styles.tab, styles.tabIdle)}>
          <Skeleton className={cn(skeletonStyles.label, skeletonStyles.labelWidth[entry.tab])} delayMs={index * TAB_DELAY_STEP_MS} />
        </span>
      ))}
    </div>
  )
}
