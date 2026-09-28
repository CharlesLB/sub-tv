import { type Category, categoryLabel } from '@/modules/championships/client'
import type { MatchSide, SetupTeamVM } from '../../types'
import { LineupCard } from '../lineup-card/lineup-card'
import { lineupsStepStyles as styles } from './lineups-step.styles'

export type LineupSideVM = { side: MatchSide; team: SetupTeamVM; starterIds: string[] }

type LineupsStepProps = {
  sides: LineupSideVM[]
  category: Category
  year: number
  onToggle: (side: MatchSide, playerId: string) => void
}

export function LineupsStep({ sides, category, year, onToggle }: LineupsStepProps) {
  return (
    <div className={styles.grid}>
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
