import Link from 'next/link'
import { connection } from 'next/server'
import { Icon } from '@/components/ui/icon/icon'
import { routes } from '@/lib/routes'
import { signOut } from '../../actions/auth-actions'
import { getCurrentUser } from '../../services/current-user'

export async function UserChip() {
  await connection()
  const user = await getCurrentUser()
  if (!user) {
    return (
      <Link
        href={routes.login()}
        className="flex h-8 flex-none items-center rounded-card border border-bd2 bg-transparent px-[10px] text-[10.3px] font-bold tracking-[-.01em] text-tx3 hover:border-tx hover:text-tx"
      >
        Entrar
      </Link>
    )
  }

  return (
    <form action={signOut} className="flex flex-none items-center gap-2 mobile:hidden">
      <Link
        href={routes.auditLog()}
        className="flex items-center gap-[6px] text-[11.3px] font-bold tracking-[-.01em] whitespace-nowrap text-tx2 hover:text-ac"
        title="Usuário conectado · abrir o registro de alterações"
      >
        <Icon name="person" size={16} className="text-tx4" />
        {user.username}
      </Link>
      <button
        type="submit"
        title="Sair"
        className="flex h-8 flex-none items-center rounded-card border border-bd2 bg-transparent px-[10px] text-[10.3px] font-bold tracking-[-.01em] text-tx3 hover:border-tx hover:text-tx"
      >
        Sair
      </button>
    </form>
  )
}
