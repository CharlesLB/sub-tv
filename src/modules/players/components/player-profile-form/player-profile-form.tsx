import { useActionState, type ChangeEvent, type FocusEvent } from 'react'
import type { Category } from '@/modules/championships/client'
import { updatePlayerProfile } from '../../actions/player-actions'
import { footLabel, positionLabel } from '../../labels'
import { DISPLAY_NAME_MAX_LENGTH, PLAYER_POSITIONS, PREFERRED_FEET } from '../../schemas'
import type { SquadPlayerVM } from '../../types'
import { ProfileChips } from '../profile-chips/profile-chips'
import { SegmentedChoice } from '../segmented-choice/segmented-choice'

const POSITION_OPTIONS = PLAYER_POSITIONS.map((position) => ({ value: position, label: positionLabel[position] }))
const FOOT_OPTIONS = PREFERRED_FEET.map((foot) => ({ value: foot, label: footLabel[foot] }))
const FALLBACK_NICKNAME_HINT = 'Jota'

type PlayerProfileFormProps = {
  player: SquadPlayerVM
  teamName: string
  category: Category
}

const submitOwnerForm = (event: ChangeEvent<HTMLInputElement>) => event.currentTarget.form?.requestSubmit()

export function PlayerProfileForm({ player, teamName, category }: PlayerProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updatePlayerProfile, null)
  const savedDisplayName = player.displayName ?? ''
  const submitWhenChanged = (event: FocusEvent<HTMLInputElement>) => {
    if (event.currentTarget.value.trim() !== savedDisplayName) event.currentTarget.form?.requestSubmit()
  }
  const feedback = isPending ? 'Salvando…' : state?.ok === false ? (state.fieldErrors?.displayName?.[0] ?? state.error) : state?.ok ? 'Salvo' : ''

  return (
    <form action={formAction} className="flex flex-col gap-[14px]">
      <input type="hidden" name="playerId" value={player.id} />
      <label className="block">
        <span className="mb-[6px] flex items-baseline justify-between gap-2">
          <span className="text-[10.3px] font-semibold tracking-[-.01em] text-tx4">Apelido (como o narrador chama)</span>
          <span aria-live="polite" className={state?.ok === false && !isPending ? 'text-[10.3px] text-vm' : 'text-[10.3px] text-tx4'}>
            {feedback}
          </span>
        </span>
        <input
          name="displayName"
          defaultValue={savedDisplayName}
          onBlur={submitWhenChanged}
          maxLength={DISPLAY_NAME_MAX_LENGTH}
          autoComplete="off"
          placeholder={`ex.: ${player.nickname ?? FALLBACK_NICKNAME_HINT}`}
          className="h-10 w-full rounded-card border border-bd2 bg-bg px-3 text-[13px] text-tx outline-none placeholder:text-tx5 focus-visible:border-tx3"
        />
      </label>
      <ProfileChips position={player.position} preferredFoot={player.preferredFoot} teamName={teamName} category={category} />
      <SegmentedChoice name="position" legend="Posição" options={POSITION_OPTIONS} defaultValue={player.position} onChange={submitOwnerForm} />
      <SegmentedChoice name="preferredFoot" legend="Pé preferido" options={FOOT_OPTIONS} defaultValue={player.preferredFoot} onChange={submitOwnerForm} />
    </form>
  )
}
