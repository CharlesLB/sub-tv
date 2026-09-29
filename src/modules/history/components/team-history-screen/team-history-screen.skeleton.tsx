import { BackToOverviewLinkSkeleton } from '../back-to-overview-link/back-to-overview-link.skeleton'
import { CompetitionPresenceListSkeleton } from '../competition-presence-list/competition-presence-list.skeleton'
import { HistoryFiltersSkeleton } from '../history-filters/history-filters.skeleton'
import { HistoryFrame } from '../history-frame/history-frame'
import { KpiGridSkeleton } from '../kpi-grid/kpi-grid.skeleton'
import { SeasonBarChartSkeleton } from '../season-bar-chart/season-bar-chart.skeleton'
import { TeamCampaignSkeleton } from '../team-campaign/team-campaign.skeleton'
import { TeamHeroSkeleton } from '../team-hero/team-hero.skeleton'
import { TeamScorersSkeleton } from '../team-scorers/team-scorers.skeleton'
import { teamHistoryScreenStyles as styles } from './team-history-screen.styles'

const SEASON_BAR_COUNT = 8

export function TeamHistoryScreenSkeleton() {
  return (
    <HistoryFrame>
      <HistoryFiltersSkeleton />
      <div aria-hidden className={styles.content}>
        <BackToOverviewLinkSkeleton />
        <TeamHeroSkeleton />
        <KpiGridSkeleton variant="detail" />
        <SeasonBarChartSkeleton barCount={SEASON_BAR_COUNT} trackHeightClass={styles.seasonChartTrack} />
        <TeamCampaignSkeleton />
        <div className={styles.sideBySide}>
          <TeamScorersSkeleton />
          <CompetitionPresenceListSkeleton />
        </div>
      </div>
    </HistoryFrame>
  )
}
