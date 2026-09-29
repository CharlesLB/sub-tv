import { cn } from '@/lib/utils/cn'
import { ChampionshipTabsSkeleton } from '../championship-tabs/championship-tabs.skeleton'
import { RoundPanelSkeleton } from '../round-panel/round-panel.skeleton'
import { StandingsPanelSkeleton } from '../standings-panel/standings-panel.skeleton'
import { championshipTabContentSkeletonStyles as skeletonStyles } from './championship-tab-content.skeleton.styles'
import { championshipTabContentStyles as styles } from './championship-tab-content.styles'

export function ChampionshipDetailSkeleton() {
  return (
    <>
      <ChampionshipTabsSkeleton />
      <div aria-hidden className={styles.scroller}>
        <div className={styles.content}>
          <div className={cn(styles.standingsLayout, skeletonStyles.standingsLayout)}>
            <StandingsPanelSkeleton />
            <RoundPanelSkeleton />
          </div>
        </div>
      </div>
    </>
  )
}
