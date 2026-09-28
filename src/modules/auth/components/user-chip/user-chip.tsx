import Link from 'next/link'
import { connection } from 'next/server'
import { routes } from '@/lib/routes'
import { Icon } from '@/components/ui/icon/icon'
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
      </Link>
    )
  }

  return (
    <form action={signOut} className={styles.signedInForm}>
      <Link href={routes.auditLog()} className={styles.userLink} title="Usuário conectado · abrir o registro de alterações">
        <Icon name="person" size={16} className={styles.userIcon} />
        {user.username}
      </Link>
      <button type="submit" title="Sair" className={styles.chipButton}>
        Sair
      </button>
    </form>
  )
}
