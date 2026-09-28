import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { Crest } from '@/components/ui/crest/crest'
import { type Category, CategoryTag, categoryBorderClass } from '@/modules/championships/client'
import { ACTIVE_TEAM_ATTRIBUTE } from '../../constants/active-team'
import type { SeasonTeamVM } from '../../types'
import { teamListItemStyles as styles } from './team-list-item.styles'

type TeamListItemProps = {
  team: SeasonTeamVM
  year: number
  categoryFilter: Category | undefined
  isActive: boolean
}

export function TeamListItem({ team, year, categoryFilter, isActive }: TeamListItemProps) {
  return (
    <Link
      href={routes.squads({ year, category: categoryFilter, teamKey: team.key })}
      scroll={false}
      aria-current={isActive ? 'true' : undefined}
      {...(isActive ? { [ACTIVE_TEAM_ATTRIBUTE]: true } : {})}
      className={cn(styles.item, styles.itemMobile, isActive ? cn(styles.itemActive, categoryBorderClass[team.category]) : styles.itemIdle)}
    >
      <Crest color={team.badge.color} imagePath={team.badge.crestPath} width={18} />
      <span className={styles.details}>
        <span className={styles.name}>{team.badge.name}</span>
        <CategoryTag category={team.category} className={styles.categoryTag} />
      </span>
      <span className={styles.athleteCount}>{team.athleteCount}</span>
    </Link>
  )
}
