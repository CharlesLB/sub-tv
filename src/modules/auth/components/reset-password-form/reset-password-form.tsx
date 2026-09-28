'use client'

import { useActionState, useId, useState } from 'react'
import type { ActionResult } from '@/lib/actions/result'
import { resetUserPassword } from '../../actions/user-admin-actions'
import { PASSWORD_MIN_LENGTH } from '../../schemas'
import { FormMessage } from '../form-message/form-message'
import { resetPasswordFormStyles as styles } from './reset-password-form.styles'

type ResetPasswordFormProps = { userId: string; username: string }

export function ResetPasswordForm({ userId, username }: ResetPasswordFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isPending] = useActionState(resetUserPassword, null)
  const [acknowledgedState, setAcknowledgedState] = useState<ActionResult | null>(null)
  const hasFreshSuccess = state?.ok === true && state !== acknowledgedState
  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined
  const newPasswordError = fieldErrors?.password?.[0]
  const confirmationError = fieldErrors?.confirmation?.[0]
  const passwordError = newPasswordError ?? confirmationError
  const passwordErrorId = useId()

  const openForm = () => {
    setAcknowledgedState(state)
    setIsOpen(true)
  }

  if (!isOpen || hasFreshSuccess) {
    return (
      <div className={styles.container}>
        <button type="button" onClick={openForm} className={styles.secondaryButton}>
          Redefinir senha
        </button>
        {hasFreshSuccess ? <FormMessage state={state} successMessage="Senha redefinida." /> : null}
      </div>
    )
  }

  return (
    <form action={action} aria-label={`Nova senha para ${username}`} className={styles.container}>
      <input type="hidden" name="userId" value={userId} />
      <div className={styles.fields}>
        <input
          name="password"
          type="password"
          aria-label="Nova senha"
          placeholder="nova senha"
          autoComplete="new-password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          aria-invalid={newPasswordError ? true : undefined}
          aria-describedby={newPasswordError ? passwordErrorId : undefined}
          className={styles.field}
        />
        <input
          name="confirmation"
          type="password"
          aria-label="Confirmar nova senha"
          placeholder="confirmação"
          autoComplete="new-password"
          required
          aria-invalid={confirmationError && !newPasswordError ? true : undefined}
          aria-describedby={confirmationError && !newPasswordError ? passwordErrorId : undefined}
          className={styles.field}
        />
        <button type="submit" disabled={isPending} className={styles.submitButton}>
          {isPending ? 'Salvando…' : 'Salvar'}
        </button>
        <button type="button" onClick={() => setIsOpen(false)} className={styles.secondaryButton}>
          Cancelar
        </button>
      </div>
      {passwordError ? (
        <span id={passwordErrorId} className={styles.passwordError}>
          {passwordError}
        </span>
      ) : (
        <FormMessage state={state} />
      )}
    </form>
  )
}
