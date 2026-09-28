'use client'

import { useActionState, useOptimistic, useState } from 'react'
import type { ActionResult } from '@/lib/actions/result'
import { addCuriosity, removeCuriosity } from '../../actions/player-actions'
import { CURIOSITY_MAX_LENGTH } from '../../schemas'
import type { CuriosityVM } from '../../types'
import { curiosityListStyles as styles } from './curiosity-list.styles'

type PlayerResult = ActionResult<{ playerId: string }>

type CuriosityChange = { kind: 'added'; curiosity: CuriosityVM } | { kind: 'removed'; curiosityId: string }

const PENDING_ID_PREFIX = 'pending-'

const CURIOSITY_ACTION = { ADD: 'add', REMOVE: 'remove' } as const

type CuriosityAction = (typeof CURIOSITY_ACTION)[keyof typeof CURIOSITY_ACTION]

const applyCuriosityChange = (current: CuriosityVM[], change: CuriosityChange): CuriosityVM[] =>
  change.kind === 'added' ? [...current, change.curiosity] : current.filter((curiosity) => curiosity.id !== change.curiosityId)

const readText = (formData: FormData, name: string): string => {
  const value = formData.get(name)

  return typeof value === 'string' ? value.trim() : ''
}

type CuriosityListProps = { playerId: string; curiosities: CuriosityVM[]; canEdit: boolean }

export function CuriosityList({ playerId, curiosities, canEdit }: CuriosityListProps) {
  const [shownCuriosities, showCuriosityChange] = useOptimistic(curiosities, applyCuriosityChange)
  const [latestAction, setLatestAction] = useState<CuriosityAction | null>(null)

  const submitCuriosity = async (previous: PlayerResult | null, formData: FormData): Promise<PlayerResult | null> => {
    setLatestAction(CURIOSITY_ACTION.ADD)
    const text = readText(formData, 'text')
    if (text) showCuriosityChange({ kind: 'added', curiosity: { id: `${PENDING_ID_PREFIX}${crypto.randomUUID()}`, text } })

    return addCuriosity(previous, formData)
  }

  const dropCuriosity = async (previous: PlayerResult | null, formData: FormData): Promise<PlayerResult | null> => {
    setLatestAction(CURIOSITY_ACTION.REMOVE)
    showCuriosityChange({ kind: 'removed', curiosityId: readText(formData, 'curiosityId') })

    return removeCuriosity(previous, formData)
  }

  const [addState, addAction] = useActionState(submitCuriosity, null)
  const [removeState, removeAction] = useActionState(dropCuriosity, null)
  const stateByAction: Record<CuriosityAction, PlayerResult | null> = { [CURIOSITY_ACTION.ADD]: addState, [CURIOSITY_ACTION.REMOVE]: removeState }
  const latestState = latestAction === null ? null : stateByAction[latestAction]
  const errorMessage = latestState?.ok === false ? (latestState.fieldErrors?.text?.[0] ?? latestState.error) : null

  return (
    <div>
      <div className={styles.heading}>Curiosidades</div>
      <ul className={styles.list}>
        {shownCuriosities.map((curiosity) => {
          const isPending = curiosity.id.startsWith(PENDING_ID_PREFIX)

          return (
            <li key={curiosity.id} className={styles.item}>
              <span aria-hidden className={styles.marker} />
              <span className={isPending ? styles.textPending : styles.text}>{curiosity.text}</span>
              {isPending || !canEdit ? null : (
                <form action={removeAction}>
                  <input type="hidden" name="curiosityId" value={curiosity.id} />
                  <button type="submit" title="Remover" aria-label="Remover curiosidade" className={styles.removeButton}>
                    ✕
                  </button>
                </form>
              )}
            </li>
          )
        })}
      </ul>
      {shownCuriosities.length === 0 ? <p className={styles.emptyMessage}>Sem curiosidade cadastrada.</p> : null}
      {canEdit ? (
        <form action={addAction} className={styles.addForm}>
          <input type="hidden" name="playerId" value={playerId} />
          <input name="text" required maxLength={CURIOSITY_MAX_LENGTH} autoComplete="off" placeholder="nova curiosidade" aria-label="Nova curiosidade" className={styles.textInput} />
          <button type="submit" className={styles.addButton}>
            Adicionar
          </button>
        </form>
      ) : null}
      {errorMessage ? (
        <p role="alert" className={styles.error}>
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
