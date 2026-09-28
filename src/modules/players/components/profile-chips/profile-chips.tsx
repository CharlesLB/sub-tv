import { useFormStatus } from 'react-dom'
import { type Category, categoryLabel } from '@/modules/championships/client'
import { footLabel, positionLabel } from '../../labels'
import { PLAYER_POSITIONS, PREFERRED_FEET } from '../../schemas'
import type { PlayerPosition, PreferredFoot } from '../../types'

type ProfileChipsProps = {
  position: PlayerPosition | null
  preferredFoot: PreferredFoot | null
  teamName: string
  category: Category
}

const readPendingChoice = <TValue extends string>(data: FormData | null, name: string, options: readonly TValue[], fallback: TValue | null): TValue | null => {
  if (!data) return fallback
  const submitted = data.get(name)

  return options.find((option) => option === submitted) ?? null
}

export function ProfileChips({ position, preferredFoot, teamName, category }: ProfileChipsProps) {
  const { data } = useFormStatus()
  const shownPosition = readPendingChoice(data, 'position', PLAYER_POSITIONS, position)
  const shownFoot = readPendingChoice(data, 'preferredFoot', PREFERRED_FEET, preferredFoot)

  const chips = [shownPosition ? positionLabel[shownPosition].toUpperCase() : null, shownFoot ? footLabel[shownFoot].toUpperCase() : null, `${teamName} · ${categoryLabel[category]}`].filter(
    (chip) => chip !== null,
  )

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <div key={chip} className="-skew-x-12 rounded-card border border-bd2 px-3 py-1">
          <div className="skew-x-12 text-[10.8px] font-semibold tracking-[-.01em] whitespace-nowrap text-tx">{chip}</div>
        </div>
      ))}
    </div>
  )
}
