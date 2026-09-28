'use client'

import { useActionState } from 'react'
import { cn } from '@/lib/utils/cn'
import { setUserActive } from '../../actions/user-admin-actions'
import { FormMessage } from '../form-message/form-message'

type UserActiveToggleProps = { userId: string; isActive: boolean; isCurrentUser: boolean }

export function UserActiveToggle({ userId, isActive, isCurrentUser }: UserActiveToggleProps) {
  const [state, action, isPending] = useActionState(setUserActive, null)
  const isLocked = isActive && isCurrentUser

  return (
    <form action={action} className="flex flex-col items-end gap-1">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="isActive" value={isActive ? 'false' : 'true'} />
      <button
        type="submit"
        disabled={isPending || isLocked}
        title={isLocked ? 'Você não pode desativar o seu próprio usuário' : undefined}
        className={cn(
          'flex h-8 w-[92px] flex-none items-center justify-center rounded-card border px-[10px] text-[10.8px] font-bold tracking-[-.01em] disabled:cursor-not-allowed disabled:opacity-45',
          isActive ? 'border-vm/50 text-vm hover:border-vm' : 'border-ac2/60 text-ac2 hover:border-ac2',
        )}
      >
        {isActive ? 'Desativar' : 'Ativar'}
      </button>
      {state?.ok === false ? <FormMessage state={state} /> : null}
    </form>
  )
}
