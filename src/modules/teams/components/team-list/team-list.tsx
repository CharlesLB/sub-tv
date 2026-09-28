import type { Category } from '@/modules/championships/client'
import type { SeasonTeamVM } from '../../types'
import { ActiveTeamScroll } from '../active-team-scroll/active-team-scroll'
import { CategoryFilter } from '../category-filter/category-filter'
import { TeamListItem } from '../team-list-item/team-list-item'
import { teamListStyles as styles } from './team-list.styles'

type TeamListProps = {
  teams: SeasonTeamVM[]
  year: number
  categoryFilter: Category | undefined
  activeTeamKey: string | null
}

export function TeamList({ teams, year, categoryFilter, activeTeamKey }: TeamListProps) {
  return (
    <aside aria-label="Times" className={styles.list}>
      <div className={styles.columnLabel}>Filtro de categoria</div>
      <CategoryFilter year={year} activeCategory={categoryFilter} activeTeamKey={activeTeamKey} />
      <div className={styles.columnLabelDivided}>Times</div>
      <div className={styles.teams}>
        {teams.map((team) => (
          <TeamListItem key={team.key} team={team} year={year} categoryFilter={categoryFilter} isActive={team.key === activeTeamKey} />
        ))}
        <ActiveTeamScroll activeTeamKey={activeTeamKey} />
        {teams.length === 0 ? <p className={styles.emptyMessage}>Nenhum time nesta categoria.</p> : null}
      </div>
    </aside>
  )
}
