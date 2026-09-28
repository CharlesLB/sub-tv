import type { Category } from '@/modules/championships/client'
import type { SquadPlayerVM } from '../../types'
import { ProfileChips } from '../profile-chips/profile-chips'
import { playerProfileSummaryStyles as styles } from './player-profile-summary.styles'

type PlayerProfileSummaryProps = {
  player: SquadPlayerVM
  teamName: string
  category: Category
}

export function PlayerProfileSummary({ player, teamName, category }: PlayerProfileSummaryProps) {
  return (
    <div className={styles.summary}>
      <div>
        <span className={styles.label}>Apelido (como o narrador chama)</span>
        <span className={styles.displayName}>{player.displayName ?? '—'}</span>
      </div>
      <ProfileChips position={player.position} preferredFoot={player.preferredFoot} teamName={teamName} category={category} />
    </div>
  )
}
