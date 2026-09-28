'use client'

import { useActionState } from 'react'
import { createUser } from '../../actions/user-admin-actions'
import { FormMessage } from '../form-message/form-message'
import { createUserFormStyles as styles } from './create-user-form.styles'

export function CreateUserForm() {
  const [state, action, isPending] = useActionState(createUser, null)
  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined
  const formKey = state?.ok === true ? state.data.username : 'new-user'

  return (
    <form key={formKey} action={action} aria-label="Novo usuário" className={styles.form}>
      <span className={styles.title}>Novo usuário</span>
      <div className={styles.fields}>
        <label className={styles.label}>
          Nome
          <input name="username" type="text" autoComplete="off" required className={styles.field} />
          {fieldErrors?.username ? <span className={styles.fieldError}>{fieldErrors.username[0]}</span> : null}
        </label>
        <label className={styles.label}>
          Senha
          <input name="password" type="password" autoComplete="new-password" required minLength={8} className={styles.field} />
          {fieldErrors?.password ? <span className={styles.fieldError}>{fieldErrors.password[0]}</span> : null}
        </label>
        <label className={styles.label}>
          Confirmação
          <input name="confirmation" type="password" autoComplete="new-password" required className={styles.field} />
          {fieldErrors?.confirmation ? <span className={styles.fieldError}>{fieldErrors.confirmation[0]}</span> : null}
        </label>
        <button type="submit" disabled={isPending} className={styles.submitButton}>
          {isPending ? 'Criando…' : 'Criar usuário'}
        </button>
      </div>
      <FormMessage state={state} successMessage={state?.ok === true ? `Usuário “${state.data.username}” criado.` : undefined} />
    </form>
  )
}
