import Link from 'next/link'
import { Crest } from '@/components/ui/crest/crest'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { CategoryTag, categoryBorderClass, type Category } from '@/modules/championships/client'
import type { SeasonTeamVM } from '../../types'
import { ACTIVE_TEAM_ATTRIBUTE } from '../../constants/active-team'

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
      className={cn(
        'flex items-center gap-[10px] border-0 border-l-[3px] px-4 py-[10px] text-tx transition-[background,border-color] duration-[140ms]',
        'mobile:flex-none mobile:gap-[7px] mobile:rounded-card mobile:border mobile:px-[10px] mobile:py-[7px]',
        isActive ? cn('bg-pan2', categoryBorderClass[team.category]) : 'border-transparent hover:bg-pan2 mobile:border-bd',
      )}
    >
      <Crest color={team.badge.color} imagePath={team.badge.crestPath} width={18} />
      <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="truncate text-[12.2px] font-bold tracking-[-.01em] whitespace-nowrap">{team.badge.name}</span>
        <CategoryTag category={team.category} className="self-start px-[7px]" />
      </span>
      <span className="text-[11px] text-tx4 nums">{team.athleteCount}</span>
    </Link>
  )
}
