'use client'

import { useActionState } from 'react'
import { Icon } from '@/components/ui/icon/icon'
import { signIn } from '../../actions/auth-actions'
import { loginFormStyles as styles } from './login-form.styles'

type LoginFormProps = { returnTo: string | undefined }

export function LoginForm({ returnTo }: LoginFormProps) {
  const [state, action, isPending] = useActionState(signIn, null)

  return (
    <form action={action} className={styles.form}>
      {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}
      <div className={styles.fieldGroup}>
        <label htmlFor="username" className={styles.label}>
          Usuário
        </label>
        {/* biome-ignore lint/a11y/noAutofocus: a página /entrar existe só para este formulário, então o foco inicial no usuário é o único propósito dela */}
        <input id="username" name="username" type="text" autoComplete="username" autoCapitalize="words" required autoFocus className={styles.field} />
      </div>
      <div className={styles.fieldGroup}>
        <label htmlFor="password" className={styles.label}>
          Senha
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={styles.field} />
      </div>
      {state?.ok === false ? (
        <p role="alert" className={styles.error}>
          <Icon name="error" size={16} />
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={isPending} className={styles.submitButton}>
        {isPending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
