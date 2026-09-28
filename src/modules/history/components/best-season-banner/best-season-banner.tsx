import { Icon } from '@/components/ui/icon/icon'
import type { AthleteSeasonVM } from '../../types'

const CHAMPIONSHIP_SEPARATOR = ' · '

export function BestSeasonBanner({ season }: { season: AthleteSeasonVM }) {
  const championships = season.championships.join(CHAMPIONSHIP_SEPARATOR)

  return (
    <div className="flex items-center gap-[10px] rounded-card border border-bd2 bg-pan2 px-[14px] py-3 text-[13.5px] font-bold tracking-[-.01em] text-tx1">
      <Icon name="star" size={18} className="text-ac" />
      <span>{`${season.goals} ${season.goals === 1 ? 'Gol' : 'Gols'} em ${season.year} · ${championships}`}</span>
    </div>
  )
}
