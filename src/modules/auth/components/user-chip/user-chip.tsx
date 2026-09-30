import Link from 'next/link'
import { connection } from 'next/server'
import { routes } from '@/lib/routes'
import { FormPendingIndicator } from '@/components/ui/form-pending-indicator/form-pending-indicator'
import { Icon } from '@/components/ui/icon/icon'
import { LinkPendingIndicator } from '@/components/ui/link-pending-indicator/link-pending-indicator'
import { signOut } from '../../actions/auth-actions'
import { getCurrentUser } from '../../services/current-user'
import { userChipStyles as styles } from './user-chip.styles'

export async function UserChip() {
  await connection()
  const user = await getCurrentUser()

  if (!user) {
    return (
      <Link href={routes.login()} className={styles.chipButton}>
        Entrar
        <LinkPendingIndicator />
      </Link>
    )
  }

  return (
    <form action={signOut} className={styles.signedInForm}>
      <Link href={routes.auditLog()} className={styles.userLink} title="Usuário conectado · abrir o registro de alterações">
        <Icon name="person" size={16} className={styles.userIcon} />
        {user.username}
        <LinkPendingIndicator />
      </Link>
      <button type="submit" title="Sair" className={styles.chipButton}>
        Sair
      </button>
      <FormPendingIndicator />
    </form>
  )
}
