import Link from 'next/link'
import { routes } from '@/lib/routes'
import { Icon } from '@/components/ui/icon/icon'
import { usersLinkStyles as styles } from './users-link.styles'

export function UsersLink() {
  return (
    <Link href={routes.users()} className={styles.link}>
      <Icon name="groups" size={16} />
      Usuários
    </Link>
  )
}
