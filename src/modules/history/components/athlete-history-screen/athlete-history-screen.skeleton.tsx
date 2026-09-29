import { AthleteHeroSkeleton } from '../athlete-hero/athlete-hero.skeleton'
import { AthleteSeasonsTableSkeleton } from '../athlete-seasons-table/athlete-seasons-table.skeleton'
import { BackToOverviewLinkSkeleton } from '../back-to-overview-link/back-to-overview-link.skeleton'
import { BestSeasonBannerSkeleton } from '../best-season-banner/best-season-banner.skeleton'
import { HistoryFiltersSkeleton } from '../history-filters/history-filters.skeleton'
import { HistoryFrame } from '../history-frame/history-frame'
import { KpiGridSkeleton } from '../kpi-grid/kpi-grid.skeleton'
import { SeasonBarChartSkeleton } from '../season-bar-chart/season-bar-chart.skeleton'
import { athleteHistoryScreenStyles as styles } from './athlete-history-screen.styles'

const SEASON_BAR_COUNT = 2

export function AthleteHistoryScreenSkeleton() {
  return (
    <HistoryFrame>
      <HistoryFiltersSkeleton />
      <div aria-hidden className={styles.content}>
        <BackToOverviewLinkSkeleton />
        <AthleteHeroSkeleton />
        <KpiGridSkeleton variant="detail" />
        <BestSeasonBannerSkeleton />
        <SeasonBarChartSkeleton barCount={SEASON_BAR_COUNT} trackHeightClass={styles.seasonChartTrack} />
        <AthleteSeasonsTableSkeleton />
      </div>
    </HistoryFrame>
  )
}
