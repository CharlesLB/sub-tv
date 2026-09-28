import type { Category } from '@/modules/championships/client'
import type { SquadPlayerVM } from '../../types'
import { ProfileChips } from '../profile-chips/profile-chips'

type PlayerProfileSummaryProps = {
  player: SquadPlayerVM
  teamName: string
  category: Category
}

export function PlayerProfileSummary({ player, teamName, category }: PlayerProfileSummaryProps) {
  return (
    <div className="flex flex-col gap-[14px]">
      <div>
        <span className="mb-[6px] block text-[10.3px] font-semibold tracking-[-.01em] text-tx4">Apelido (como o narrador chama)</span>
        <span className="text-[14px]">{player.displayName ?? '—'}</span>
      </div>
      <ProfileChips position={player.position} preferredFoot={player.preferredFoot} teamName={teamName} category={category} />
    </div>
  )
}
