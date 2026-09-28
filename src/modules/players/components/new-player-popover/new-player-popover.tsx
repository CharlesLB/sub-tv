'use client'

import * as Popover from '@radix-ui/react-popover'
import { useActionState, useId, useState } from 'react'
import type { ActionResult } from '@/lib/actions/result'
import { categoryLabel } from '@/modules/championships/client'
import { createManualPlayer } from '../../actions/player-actions'
import { FULL_NAME_MAX_LENGTH, SHIRT_NUMBER_MAX, SHIRT_NUMBER_MIN } from '../../schemas'
import type { TeamSquadVM } from '../../types'
import { newPlayerPopoverStyles as styles } from './new-player-popover.styles'

type PlayerResult = ActionResult<{ playerId: string }>

type NewPlayerPopoverProps = {
  squad: TeamSquadVM
  onPlayerCreated: (playerId: string) => void
}

export function NewPlayerPopover({ squad, onPlayerCreated }: NewPlayerPopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const category = categoryLabel[squad.category]
  const titleId = useId()

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
      <Popover.Trigger aria-label={`Cadastrar novo jogador ${category}`} className={styles.trigger}>
        <span className={styles.triggerFullLabel}>+ novo jogador {category}</span>
        <span className={styles.triggerCompactLabel}>+ novo</span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content side="bottom" align="end" sideOffset={7} aria-labelledby={titleId} className={styles.content}>
          <form action={formAction} className={styles.form}>
            <div className={styles.header}>
              <span id={titleId} className={styles.title}>
                Novo jogador {category}
              </span>
              <span className={styles.subtitle}>cadastro manual</span>
            </div>
            <input type="hidden" name="year" value={squad.year} />
            <input type="hidden" name="category" value={squad.category} />
            <input type="hidden" name="clubId" value={squad.clubId} />
            <div className={styles.fields}>
              <label>
                <span className={styles.label}>Número</span>
                <input name="shirtNumber" type="number" inputMode="numeric" min={SHIRT_NUMBER_MIN} max={SHIRT_NUMBER_MAX} required className={styles.input} />
              </label>
              <label>
                <span className={styles.label}>Nome completo</span>
                <input name="fullName" required maxLength={FULL_NAME_MAX_LENGTH} autoComplete="off" className={styles.input} />
              </label>
            </div>
            {state?.ok === false ? (
              <p role="alert" className={styles.error}>
                {fieldErrors?.fullName?.[0] ?? fieldErrors?.shirtNumber?.[0] ?? state.error}
              </p>
            ) : null}
            <p className={styles.hint}>Até a súmula da FMF chegar, o atleta fica como cadastro provisório neste elenco.</p>
            <div className={styles.actions}>
              <Popover.Close className={styles.cancelButton}>Cancelar</Popover.Close>
              <button type="submit" disabled={isPending} className={styles.submitButton}>
                {isPending ? 'Salvando…' : 'Cadastrar'}
              </button>
            </div>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
