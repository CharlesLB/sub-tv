import { cn } from '@/lib/utils/cn'
import { formatAuditTime } from '@/modules/audit'
import type { UserRowVM } from '../../data/get-users'
import { ResetPasswordForm } from '../reset-password-form/reset-password-form'
import { UserActiveToggle } from '../user-active-toggle/user-active-toggle'
import { usersTableStyles as styles } from './users-table.styles'

const NEVER_SIGNED_IN = 'Nunca entrou'

type UsersTableProps = { users: UserRowVM[]; currentUserId: string }

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  return (
    <div className={styles.table} role="table" aria-label="Usuários">
      <div role="row" className={styles.headerRow}>
        <span role="columnheader" className={styles.nameHeader}>
          Nome
        </span>
        <span role="columnheader" className={styles.statusHeader}>
          Situação
        </span>
        <span role="columnheader" className={styles.lastSignInHeader}>
          Último acesso
        </span>
        <span role="columnheader" className={styles.actionsHeader}>
          Ações
        </span>
      </div>
      {users.map((user, index) => {
        const isCurrentUser = user.id === currentUserId

        return (
          <div key={user.id} role="row" aria-label={user.username} className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)}>
            <span role="cell" className={styles.nameCell}>
              <span className={styles.username}>{user.username}</span>
              {isCurrentUser ? <span className={styles.currentUserTag}>você</span> : null}
            </span>
            <span role="cell" className={cn(styles.statusCell, user.isActive ? styles.statusActive : styles.statusInactive)}>
              {user.isActive ? 'Ativo' : 'Inativo'}
            </span>
            <span role="cell" className={styles.lastSignInCell}>
              {user.lastSignInAt ? formatAuditTime(user.lastSignInAt) : NEVER_SIGNED_IN}
            </span>
            <span role="cell" className={styles.actionsCell}>
              <ResetPasswordForm userId={user.id} username={user.username} />
              <UserActiveToggle userId={user.id} isActive={user.isActive} isCurrentUser={isCurrentUser} />
            </span>
          </div>
        )
      })}
    </div>
  )
}
