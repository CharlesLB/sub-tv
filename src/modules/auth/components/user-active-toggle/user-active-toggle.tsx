'use client'

import { useActionState } from 'react'
import { cn } from '@/lib/utils/cn'
import { setUserActive } from '../../actions/user-admin-actions'
import { FormMessage } from '../form-message/form-message'
import { userActiveToggleStyles as styles } from './user-active-toggle.styles'

type UserActiveToggleProps = { userId: string; isActive: boolean; isCurrentUser: boolean }

export function UserActiveToggle({ userId, isActive, isCurrentUser }: UserActiveToggleProps) {
  const [state, action, isPending] = useActionState(setUserActive, null)
  const isLocked = isActive && isCurrentUser

  return (
    <form action={action} className={styles.form}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="isActive" value={isActive ? 'false' : 'true'} />
      <button
        type="submit"
        disabled={isPending || isLocked}
        title={isLocked ? 'Você não pode desativar o seu próprio usuário' : undefined}
        className={cn(styles.toggleButton, isActive ? styles.deactivateButton : styles.activateButton)}
      >
        {isActive ? 'Desativar' : 'Ativar'}
      </button>
      {state?.ok === false ? <FormMessage state={state} /> : null}
    </form>
  )
}
