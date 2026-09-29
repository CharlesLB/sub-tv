import { cn } from '@/lib/utils/cn'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table/data-table'
import { formatAuditTime } from '@/modules/audit'
import type { UserRowVM } from '../../data/get-users'
import { ResetPasswordForm } from '../reset-password-form/reset-password-form'
import { UserActiveToggle } from '../user-active-toggle/user-active-toggle'
import { usersTableStyles as styles } from './users-table.styles'

const NEVER_SIGNED_IN = 'Nunca entrou'

export const USERS_TABLE_LABEL = 'Usuários'

export const USERS_TABLE_COLUMNS: readonly DataTableColumn[] = [
  { id: 'name', label: 'Nome', className: styles.nameHeader },
  { id: 'status', label: 'Situação', className: styles.statusHeader },
  { id: 'last-sign-in', label: 'Último acesso', className: styles.lastSignInHeader },
  { id: 'actions', label: 'Ações', className: styles.actionsHeader },
]

type UsersTableProps = { users: UserRowVM[]; currentUserId: string }

export function UsersTable({ users, currentUserId }: UsersTableProps) {
  return (
    <DataTable label={USERS_TABLE_LABEL} columns={USERS_TABLE_COLUMNS}>
      {users.map((user, index) => {
        const isCurrentUser = user.id === currentUserId

        return (
          <tr key={user.id} aria-label={user.username} className={cn(styles.row, index % 2 === 1 ? styles.rowOdd : styles.rowEven)}>
            <td className={styles.nameCell}>
              <span className={styles.username}>{user.username}</span>
              {isCurrentUser ? <span className={styles.currentUserTag}>você</span> : null}
            </td>
            <td className={cn(styles.statusCell, user.isActive ? styles.statusActive : styles.statusInactive)}>{user.isActive ? 'Ativo' : 'Inativo'}</td>
            <td className={styles.lastSignInCell}>{user.lastSignInAt ? formatAuditTime(user.lastSignInAt) : NEVER_SIGNED_IN}</td>
            <td className={styles.actionsCell}>
              <ResetPasswordForm userId={user.id} username={user.username} />
              <UserActiveToggle userId={user.id} isActive={user.isActive} isCurrentUser={isCurrentUser} />
            </td>
          </tr>
        )
      })}
    </DataTable>
  )
}
