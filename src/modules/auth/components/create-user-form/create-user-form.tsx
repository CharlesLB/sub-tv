'use client'

import { useActionState } from 'react'
import { createUser } from '../../actions/user-admin-actions'
import { FormMessage } from '../form-message/form-message'

const FIELD_CLASS = 'h-[36px] w-full min-w-0 rounded-card border border-bd2 bg-bg px-[10px] text-[12.5px] text-tx'
const LABEL_CLASS = 'flex min-w-0 flex-col gap-[5px] text-[9.5px] tracking-[.05em] text-tx5'
const FIELD_ERROR_CLASS = 'text-[10.5px] tracking-normal text-vm'

export function CreateUserForm() {
  const [state, action, isPending] = useActionState(createUser, null)
  const fieldErrors = state?.ok === false ? state.fieldErrors : undefined
  const formKey = state?.ok === true ? state.data.username : 'new-user'

  return (
    <form key={formKey} action={action} aria-label="Novo usuário" className="flex flex-col gap-3 rounded-card border border-bd bg-pan p-[14px]">
      <span className="text-[13.5px] font-bold tracking-[-.01em] text-tx2">Novo usuário</span>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] items-start gap-[10px]">
        <label className={LABEL_CLASS}>
          Nome
          <input name="username" type="text" autoComplete="off" required className={FIELD_CLASS} />
          {fieldErrors?.username ? <span className={FIELD_ERROR_CLASS}>{fieldErrors.username[0]}</span> : null}
        </label>
        <label className={LABEL_CLASS}>
          Senha
          <input name="password" type="password" autoComplete="new-password" required minLength={8} className={FIELD_CLASS} />
          {fieldErrors?.password ? <span className={FIELD_ERROR_CLASS}>{fieldErrors.password[0]}</span> : null}
        </label>
        <label className={LABEL_CLASS}>
          Confirmação
          <input name="confirmation" type="password" autoComplete="new-password" required className={FIELD_CLASS} />
          {fieldErrors?.confirmation ? <span className={FIELD_ERROR_CLASS}>{fieldErrors.confirmation[0]}</span> : null}
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="mt-[14px] h-[36px] rounded-card bg-ac px-4 text-[11.8px] font-bold tracking-[-.01em] text-bg disabled:bg-bd2 disabled:text-tx4"
        >
          {isPending ? 'Criando…' : 'Criar usuário'}
        </button>
      </div>
      <FormMessage state={state} successMessage={state?.ok === true ? `Usuário “${state.data.username}” criado.` : undefined} />
    </form>
  )
}
