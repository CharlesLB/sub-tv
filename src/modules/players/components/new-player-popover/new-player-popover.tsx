import * as Popover from '@radix-ui/react-popover'
import { useActionState, useState } from 'react'
import type { ActionResult } from '@/lib/actions/result'
import { categoryLabel } from '@/modules/championships/client'
import { createManualPlayer } from '../../actions/player-actions'
import { FULL_NAME_MAX_LENGTH, SHIRT_NUMBER_MAX, SHIRT_NUMBER_MIN } from '../../schemas'
import type { TeamSquadVM } from '../../types'

type PlayerResult = ActionResult<{ playerId: string }>

type NewPlayerPopoverProps = {
  squad: TeamSquadVM
  onPlayerCreated: (playerId: string) => void
}

const LABEL_CLASS = 'mb-[6px] block text-[10.3px] font-semibold tracking-[-.01em] text-tx4'
const INPUT_CLASS = 'h-10 w-full rounded-card border border-bd2 bg-bg px-3 text-[13px] text-tx outline-none focus-visible:border-tx3'

export function NewPlayerPopover({ squad, onPlayerCreated }: NewPlayerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const category = categoryLabel[squad.category]

  const submitPlayer = async (previous: PlayerResult | null, formData: FormData): Promise<PlayerResult | null> => {
    const result = await createManualPlayer(previous, formData)
    if (!result.ok) return result
    setIsOpen(false)
    onPlayerCreated(result.data.playerId)

    return null
  }

  const [state, formAction, isPending] = useActionState(submitPlayer, null)
  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger className="h-[38px] flex-none rounded-card border border-ac px-[14px] text-[10.8px] font-bold tracking-[-.01em] text-ac transition-colors hover:bg-pan">
        <span className="mobile:hidden">+ novo jogador {category}</span>
        <span className="hidden mobile:inline">+ novo</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="bottom" align="end" sideOffset={7} className="z-[60] w-[min(92vw,320px)] animate-pop-in rounded-card border border-bd2 bg-pan p-4 text-tx">
          <form action={formAction} className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[13.5px] font-bold tracking-[-.01em]">Novo jogador {category}</span>
              <span className="text-[10px] tracking-[.05em] text-tx4">cadastro manual</span>
            </div>
            <input type="hidden" name="year" value={squad.year} />
            <input type="hidden" name="category" value={squad.category} />
            <input type="hidden" name="clubId" value={squad.clubId} />
            <div className="grid grid-cols-[70px_minmax(0,1fr)] gap-3">
              <label>
                <span className={LABEL_CLASS}>Número</span>
                <input name="shirtNumber" type="number" inputMode="numeric" min={SHIRT_NUMBER_MIN} max={SHIRT_NUMBER_MAX} required className={INPUT_CLASS} />
              </label>
              <label>
                <span className={LABEL_CLASS}>Nome completo</span>
                <input name="fullName" required maxLength={FULL_NAME_MAX_LENGTH} autoComplete="off" className={INPUT_CLASS} />
              </label>
            </div>
            {state?.ok === false ? (
              <p role="alert" className="text-[11.5px] text-vm">
                {fieldErrors?.fullName?.[0] ?? fieldErrors?.shirtNumber?.[0] ?? state.error}
              </p>
            ) : null}
            <p className="text-[11.5px] leading-[1.5] text-tx4">Até a súmula da FMF chegar, o atleta fica como cadastro provisório neste elenco.</p>
            <div className="flex justify-end gap-2">
              <Popover.Close className="h-[34px] rounded-card border border-bd2 px-3 text-[10.8px] font-bold text-tx3 hover:text-tx">Cancelar</Popover.Close>
              <button type="submit" disabled={isPending} className="h-[34px] rounded-card bg-ac px-[14px] text-[10.8px] font-bold text-bg disabled:opacity-60">
                {isPending ? 'Salvando…' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
