import { cn } from '@/lib/utils/cn'
import { skeletonSlots } from '@/lib/utils/skeleton-slots/skeleton-slots'
import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { categoryFilterStyles } from '../category-filter/category-filter.styles'
import { teamListItemStyles } from '../team-list-item/team-list-item.styles'
import { teamListSkeletonStyles as skeletonStyles } from './team-list.skeleton.styles'
import { teamListStyles as styles } from './team-list.styles'

const TEAM_PLACEHOLDER_COUNT = 8
const ITEM_DELAY_MS = 80
const PART_DELAY_MS = 40
const FILTER_DELAY_MS = 60

const nameWidthOf = (order: number): string => skeletonStyles.nameWidths[order % skeletonStyles.nameWidths.length] ?? skeletonStyles.nameWidths[0]

export function TeamListSkeleton() {
  return (
    <div aria-hidden className={styles.list}>
      <div className={styles.columnLabel}>
        <Skeleton className={cn(skeletonStyles.columnLabelBar, skeletonStyles.filtersLabelWidth)} />
      </div>
      <div className={categoryFilterStyles.nav}>
        {skeletonSlots(skeletonStyles.filterOptionWidths.length).map(({ slotId, order }) => (
          <Skeleton
            key={slotId}
            className={cn(skeletonStyles.filterOption, skeletonStyles.filterOptionWidths[order], order > 0 && skeletonStyles.filterOptionIdle)}
            delayMs={order * FILTER_DELAY_MS}
          />
        ))}
      </div>
      <div className={styles.columnLabelDivided}>
        <Skeleton className={cn(skeletonStyles.columnLabelBar, skeletonStyles.teamsLabelWidth)} delayMs={FILTER_DELAY_MS} />
      </div>
      <div className={styles.teams}>
        {skeletonSlots(TEAM_PLACEHOLDER_COUNT).map(({ slotId, order }) => {
          const delay = order * ITEM_DELAY_MS
          const isActive = order === 0

          return (
            <div
              key={slotId}
              className={cn(teamListItemStyles.item, teamListItemStyles.itemMobile, isActive ? cn(teamListItemStyles.itemActive, skeletonStyles.itemActive) : teamListItemStyles.itemIdle)}
            >
              <Skeleton className={skeletonStyles.crest} delayMs={delay} />
              <span className={teamListItemStyles.details}>
                <span className={teamListItemStyles.name}>
                  <Skeleton className={cn(skeletonStyles.textBar, nameWidthOf(order))} delayMs={delay + PART_DELAY_MS} />
                </span>
                <Skeleton className={skeletonStyles.categoryTag} delayMs={delay + PART_DELAY_MS * 2} />
              </span>
              <span className={teamListItemStyles.athleteCount}>
                <Skeleton className={cn(skeletonStyles.textBar, skeletonStyles.athleteCountWidth)} delayMs={delay + PART_DELAY_MS * 3} />
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
