import type { Category } from '@/modules/championships/client'
import type { SeasonTeamVM } from '../../types'
import { ActiveTeamScroll } from '../active-team-scroll/active-team-scroll'
import { CategoryFilter } from '../category-filter/category-filter'
import { TeamListItem } from '../team-list-item/team-list-item'

const COLUMN_LABEL_CLASS = 'px-4 pb-2 text-[10.3px] font-semibold tracking-[-.01em] text-tx4 mobile:hidden'

type TeamListProps = {
  teams: SeasonTeamVM[]
  year: number
  categoryFilter: Category | undefined
  activeTeamKey: string | null
}

export function TeamList({ teams, year, categoryFilter, activeTeamKey }: TeamListProps) {
  return (
    <aside
      aria-label="Times"
      className="max-h-full max-w-[250px] min-h-[260px] min-w-[190px] flex-[1_1_210px] overflow-y-auto bg-pan py-[14px] mobile:max-w-none mobile:min-h-0 mobile:min-w-0 mobile:flex-none mobile:overflow-hidden mobile:pt-[9px] mobile:pb-0"
    >
      <div className={COLUMN_LABEL_CLASS}>Filtro de categoria</div>
      <CategoryFilter year={year} activeCategory={categoryFilter} activeTeamKey={activeTeamKey} />
      <div className={`${COLUMN_LABEL_CLASS} border-t border-bd pt-3`}>Times</div>
      <div className="block mobile:no-scrollbar mobile:flex mobile:gap-[6px] mobile:overflow-x-auto mobile:overflow-y-hidden mobile:px-3 mobile:pb-[9px]">
        {teams.map((team) => (
          <TeamListItem key={team.key} team={team} year={year} categoryFilter={categoryFilter} isActive={team.key === activeTeamKey} />
        ))}
        <ActiveTeamScroll activeTeamKey={activeTeamKey} />
        {teams.length === 0 ? <p className="px-4 py-3 text-[12px] text-tx4 mobile:px-0 mobile:py-1">Nenhum time nesta categoria.</p> : null}
      </div>
    </aside>
  )
}
