'use client'

import { type FormEvent, startTransition, useActionState, useId } from 'react'
import type { ActionResult } from '@/lib/actions/result'
import { createUser } from '../../actions/user-admin-actions'
import { PASSWORD_MIN_LENGTH } from '../../schemas'
import { FormMessage } from '../form-message/form-message'
import { createUserFormStyles as styles } from './create-user-form.styles'

const USERNAME_FIELD = 'username'
const PASSWORD_FIELD = 'password'
const CONFIRMATION_FIELD = 'confirmation'

type CreatedUser = { username: string }

type CreateUserFormState = { result: ActionResult<CreatedUser> | null; createdCount: number }

const INITIAL_STATE: CreateUserFormState = { result: null, createdCount: 0 }

const submitNewUser = async (previous: CreateUserFormState, formData: FormData): Promise<CreateUserFormState> => {
  const result = await createUser(previous.result, formData)

  return { result, createdCount: result.ok ? previous.createdCount + 1 : previous.createdCount }
}

type FieldErrorProps = { id: string; message: string | undefined }

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null

  return (
    <span id={id} className={styles.fieldError}>
      {message}
    </span>
  )
}

export function CreateUserForm() {
  const [{ result, createdCount }, action, isPending] = useActionState(submitNewUser, INITIAL_STATE)
  const fieldErrors = result?.ok === false ? result.fieldErrors : undefined
  const usernameError = fieldErrors?.[USERNAME_FIELD]?.[0]
  const passwordError = fieldErrors?.[PASSWORD_FIELD]?.[0]
  const confirmationError = fieldErrors?.[CONFIRMATION_FIELD]?.[0]
  const errorIdPrefix = useId()
  const usernameErrorId = `${errorIdPrefix}-${USERNAME_FIELD}`
  const passwordErrorId = `${errorIdPrefix}-${PASSWORD_FIELD}`
  const confirmationErrorId = `${errorIdPrefix}-${CONFIRMATION_FIELD}`

  const submitKeepingTypedValues = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    startTransition(() => action(formData))
  }

  return (
    <form key={createdCount} action={action} onSubmit={submitKeepingTypedValues} aria-label="Novo usuário" className={styles.form}>
      <span className={styles.title}>Novo usuário</span>
      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Nome
            <input
              name={USERNAME_FIELD}
              type="text"
              autoComplete="off"
              required
              aria-invalid={usernameError ? true : undefined}
              aria-describedby={usernameError ? usernameErrorId : undefined}
              className={styles.field}
            />
          </label>
          <FieldError id={usernameErrorId} message={usernameError} />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Senha
            <input
              name={PASSWORD_FIELD}
              type="password"
              autoComplete="new-password"
              required
              minLength={PASSWORD_MIN_LENGTH}
              aria-invalid={passwordError ? true : undefined}
              aria-describedby={passwordError ? passwordErrorId : undefined}
              className={styles.field}
            />
          </label>
          <FieldError id={passwordErrorId} message={passwordError} />
        </div>
        <div className={styles.fieldGroup}>
          <label className={styles.label}>
            Confirmação
            <input
              name={CONFIRMATION_FIELD}
              type="password"
              autoComplete="new-password"
              required
              aria-invalid={confirmationError ? true : undefined}
              aria-describedby={confirmationError ? confirmationErrorId : undefined}
              className={styles.field}
            />
          </label>
          <FieldError id={confirmationErrorId} message={confirmationError} />
        </div>
        <button type="submit" disabled={isPending} className={styles.submitButton}>
          {isPending ? 'Criando…' : 'Criar usuário'}
        </button>
      </div>
      <FormMessage state={result} successMessage={result?.ok === true ? `Usuário “${result.data.username}” criado.` : undefined} />
    </form>
  )
}
