'use client'

import { useActionState, useState } from 'react'
import type { ActionResult } from '@/lib/actions/result'
import { resetUserPassword } from '../../actions/user-admin-actions'
import { FormMessage } from '../form-message/form-message'

const FIELD_CLASS = 'h-8 w-[150px] min-w-0 rounded-card border border-bd2 bg-bg px-[9px] text-[12px] text-tx mobile:w-full'
const BUTTON_CLASS = 'flex h-8 flex-none items-center rounded-card border border-bd2 px-[10px] text-[10.8px] font-bold tracking-[-.01em] text-tx3 hover:border-tx hover:text-tx'

type ResetPasswordFormProps = { userId: string; username: string }

export function ResetPasswordForm({ userId, username }: ResetPasswordFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isPending] = useActionState(resetUserPassword, null)
  const [acknowledgedState, setAcknowledgedState] = useState<ActionResult | null>(null)
  const hasFreshSuccess = state?.ok === true && state !== acknowledgedState
  const passwordError = state?.ok === false ? (state.fieldErrors?.password?.[0] ?? state.fieldErrors?.confirmation?.[0]) : undefined

  const openForm = () => {
    setAcknowledgedState(state)
    setIsOpen(true)
  }

  if (!isOpen || hasFreshSuccess) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button type="button" onClick={openForm} className={BUTTON_CLASS}>
          Redefinir senha
        </button>
        {hasFreshSuccess ? <FormMessage state={state} successMessage="Senha redefinida." /> : null}
      </div>
    )
  }

  return (
    <form action={action} aria-label={`Nova senha para ${username}`} className="flex flex-col items-end gap-1">
      <input type="hidden" name="userId" value={userId} />
      <div className="flex flex-wrap items-center justify-end gap-[6px]">
        <input name="password" type="password" aria-label="Nova senha" placeholder="nova senha" autoComplete="new-password" required minLength={8} className={FIELD_CLASS} />
        <input name="confirmation" type="password" aria-label="Confirmar nova senha" placeholder="confirmação" autoComplete="new-password" required className={FIELD_CLASS} />
        <button type="submit" disabled={isPending} className="h-8 flex-none rounded-card bg-ac px-3 text-[10.8px] font-bold tracking-[-.01em] text-bg disabled:bg-bd2">
          {isPending ? 'Salvando…' : 'Salvar'}
        </button>
        <button type="button" onClick={() => setIsOpen(false)} className={BUTTON_CLASS}>
          Cancelar
        </button>
      </div>
      {passwordError ? <span className="text-[10.5px] text-vm">{passwordError}</span> : <FormMessage state={state} />}
    </form>
  )
}
