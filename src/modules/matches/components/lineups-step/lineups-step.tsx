import { categoryLabel, type Category } from '@/modules/championships/client'
import type { MatchSide, SetupTeamVM } from '../../types'
import { LineupCard } from '../lineup-card/lineup-card'

export type LineupSideVM = { side: MatchSide; team: SetupTeamVM; starterIds: string[] }

type LineupsStepProps = {
  sides: LineupSideVM[]
  category: Category
  year: number
  onToggle: (side: MatchSide, playerId: string) => void
}

export function LineupsStep({ sides, category, year, onToggle }: LineupsStepProps) {
  return (
    <div className="grid max-w-[1180px] min-h-0 flex-1 animate-fade-up grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-4 overflow-hidden mobile:flex-none mobile:overflow-visible">
      {sides.map(({ side, team, starterIds }) => (
        <LineupCard
          key={side}
          team={team}
          category={category}
          sourceLine={`Elenco ${year} · ${team.players.length} Atletas vinculados ao ${categoryLabel[category]}`}
          starterIds={starterIds}
          onToggle={(playerId) => onToggle(side, playerId)}
        />
      ))}
    </div>
  )
}
