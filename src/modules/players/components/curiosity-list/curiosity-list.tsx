import { useActionState, useOptimistic } from 'react'
import type { ActionResult } from '@/lib/actions/result'
import { addCuriosity, removeCuriosity } from '../../actions/player-actions'
import { CURIOSITY_MAX_LENGTH } from '../../schemas'
import type { CuriosityVM } from '../../types'

type PlayerResult = ActionResult<{ playerId: string }>

type CuriosityChange = { kind: 'added'; curiosity: CuriosityVM } | { kind: 'removed'; curiosityId: string }

const PENDING_ID_PREFIX = 'pending-'

const applyCuriosityChange = (current: CuriosityVM[], change: CuriosityChange): CuriosityVM[] =>
  change.kind === 'added' ? [...current, change.curiosity] : current.filter((curiosity) => curiosity.id !== change.curiosityId)

const readText = (formData: FormData, name: string): string => {
  const value = formData.get(name)

  return typeof value === 'string' ? value.trim() : ''
}

type CuriosityListProps = { playerId: string; curiosities: CuriosityVM[]; canEdit: boolean }

export function CuriosityList({ playerId, curiosities, canEdit }: CuriosityListProps) {
  const [shownCuriosities, showCuriosityChange] = useOptimistic(curiosities, applyCuriosityChange)

  const submitCuriosity = async (previous: PlayerResult | null, formData: FormData): Promise<PlayerResult | null> => {
    const text = readText(formData, 'text')
    if (text) showCuriosityChange({ kind: 'added', curiosity: { id: `${PENDING_ID_PREFIX}${crypto.randomUUID()}`, text } })

    return addCuriosity(previous, formData)
  }

  const dropCuriosity = async (previous: PlayerResult | null, formData: FormData): Promise<PlayerResult | null> => {
    showCuriosityChange({ kind: 'removed', curiosityId: readText(formData, 'curiosityId') })

    return removeCuriosity(previous, formData)
  }

  const [addState, addAction] = useActionState(submitCuriosity, null)
  const [removeState, removeAction] = useActionState(dropCuriosity, null)
  const failure = [addState, removeState].find((state) => state?.ok === false)
  const errorMessage = failure?.ok === false ? (failure.fieldErrors?.text?.[0] ?? failure.error) : null

  return (
    <div>
      <div className="mb-2 text-[10.3px] font-semibold tracking-[-.01em] text-tx4">Curiosidades</div>
      <ul className="flex flex-col gap-2">
        {shownCuriosities.map((curiosity) => {
          const isPending = curiosity.id.startsWith(PENDING_ID_PREFIX)

          return (
            <li key={curiosity.id} className="flex animate-fade-in items-start gap-[10px]">
              <span aria-hidden className="mt-[7px] size-[6px] flex-none rotate-45 bg-ac" />
              <span className={isPending ? 'min-w-0 flex-1 text-[14px] leading-[1.55] text-tx3' : 'min-w-0 flex-1 text-[14px] leading-[1.55]'}>{curiosity.text}</span>
              {isPending || !canEdit ? null : (
                <form action={removeAction}>
                  <input type="hidden" name="curiosityId" value={curiosity.id} />
                  <button type="submit" title="Remover" aria-label="Remover curiosidade" className="p-0 text-[14px] leading-[1.4] text-tx4 hover:text-vm">
                    ✕
                  </button>
                </form>
              )}
            </li>
          )
        })}
      </ul>
      {shownCuriosities.length === 0 ? <p className="text-[12.5px] text-tx4">Sem curiosidade cadastrada.</p> : null}
      {canEdit ? (
        <form action={addAction} className="mt-[10px] flex gap-2">
          <input type="hidden" name="playerId" value={playerId} />
          <input
            name="text"
            required
            maxLength={CURIOSITY_MAX_LENGTH}
            autoComplete="off"
            placeholder="nova curiosidade"
            aria-label="Nova curiosidade"
            className="h-10 min-w-0 flex-1 rounded-card border border-bd2 bg-bg px-3 text-[12.5px] text-tx outline-none placeholder:text-tx4 focus-visible:border-tx3"
          />
          <button type="submit" className="h-10 rounded-card border border-ac px-[14px] text-[10.8px] font-bold tracking-[-.01em] text-ac transition-colors hover:bg-pan2">
            Adicionar
          </button>
        </form>
      ) : null}
      {errorMessage ? (
        <p role="alert" className="mt-[6px] text-[11.5px] text-vm">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}
