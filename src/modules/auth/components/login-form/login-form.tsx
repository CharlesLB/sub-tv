'use client'

import { useActionState } from 'react'
import { Icon } from '@/components/ui/icon/icon'
import { signIn } from '../../actions/auth-actions'

const FIELD_CLASS = 'h-[42px] w-full rounded-card border border-bd2 bg-bg px-3 text-[13px] text-tx'
const LABEL_CLASS = 'text-[10.3px] font-semibold tracking-[-.01em] text-tx4'

type LoginFormProps = { returnTo: string | undefined }

export function LoginForm({ returnTo }: LoginFormProps) {
  const [state, action, isPending] = useActionState(signIn, null)

  return (
    <form action={action} className="flex flex-col gap-3">
      {returnTo ? <input type="hidden" name="returnTo" value={returnTo} /> : null}
      <div className="flex flex-col gap-[6px]">
        <label htmlFor="username" className={LABEL_CLASS}>
          Usuário
        </label>
        <input id="username" name="username" type="text" autoComplete="username" autoCapitalize="words" required autoFocus className={FIELD_CLASS} />
      </div>
      <div className="flex flex-col gap-[6px]">
        <label htmlFor="password" className={LABEL_CLASS}>
          Senha
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className={FIELD_CLASS} />
      </div>
      {state?.ok === false ? (
        <p role="alert" className="flex items-center gap-2 text-[12.5px] text-vm">
          <Icon name="error" size={16} />
          {state.error}
        </p>
      ) : null}
      <button type="submit" disabled={isPending} className="mt-1 h-[46px] rounded-card bg-ac text-[12.6px] font-bold tracking-[-.01em] text-bg disabled:bg-bd2 disabled:text-tx4">
        {isPending ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}
