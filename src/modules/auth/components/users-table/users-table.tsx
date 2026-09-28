import { cn } from '@/lib/utils/cn'
import { formatAuditTime } from '@/modules/audit'
import type { UserRowVM } from '../../data/get-users'
import { ResetPasswordForm } from '../reset-password-form/reset-password-form'
import { UserActiveToggle } from '../user-active-toggle/user-active-toggle'

const NEVER_SIGNED_IN = 'Nunca entrou'

type UsersTableProps = { users: UserRowVM[]; currentUserId: string }

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-card border border-bd bg-pan" role="table" aria-label="Usuários">
      <div role="row" className="flex items-center gap-3 border-b border-bd2 px-3 pt-[9px] pb-2 text-[10px] tracking-[.05em] text-tx4 mobile:hidden">
        <span role="columnheader" className="min-w-0 flex-1">Nome</span>
        <span role="columnheader" className="w-[70px] flex-none">Situação</span>
        <span role="columnheader" className="w-[118px] flex-none">Último acesso</span>
        <span role="columnheader" className="w-[260px] flex-none text-right">Ações</span>
      </div>
      {users.map((user, index) => {
        const isCurrentUser = user.id === currentUserId

        return (
          <div
            key={user.id}
            role="row"
            aria-label={user.username}
            className={cn('flex items-center gap-3 px-3 py-[10px] mobile:flex-wrap', index % 2 === 1 ? 'bg-pan0' : 'bg-pan')}
          >
            <span role="cell" className="flex min-w-0 flex-1 items-baseline gap-2">
              <span className="truncate text-[13.5px] font-bold tracking-[-.01em] text-tx">{user.username}</span>
              {isCurrentUser ? <span className="flex-none text-[9.5px] tracking-[.06em] text-tx5">você</span> : null}
            </span>
            <span role="cell" className={cn('w-[70px] flex-none text-[10.5px] font-bold tracking-[.04em]', user.isActive ? 'text-ac2' : 'text-tx5')}>
              {user.isActive ? 'Ativo' : 'Inativo'}
            </span>
            <span role="cell" className="w-[118px] flex-none text-[11px] tracking-[.04em] text-tx3 nums">
              {user.lastSignInAt ? formatAuditTime(user.lastSignInAt) : NEVER_SIGNED_IN}
            </span>
            <span role="cell" className="flex w-[260px] flex-none items-start justify-end gap-2 mobile:w-full mobile:justify-start">
              <ResetPasswordForm userId={user.id} username={user.username} />
              <UserActiveToggle userId={user.id} isActive={user.isActive} isCurrentUser={isCurrentUser} />
            </span>
          </div>
        )
      })}
    </div>
  )
}
