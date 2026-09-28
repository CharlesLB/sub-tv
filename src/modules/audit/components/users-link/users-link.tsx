import Link from 'next/link'
import { routes } from '@/lib/routes'
import { Icon } from '@/components/ui/icon/icon'

export function UsersLink() {
  return (
    <Link
      href={routes.users()}
      className="flex h-8 flex-none items-center gap-[6px] rounded-card border border-bd2 px-[10px] text-[10.8px] font-bold tracking-[-.01em] text-tx3 hover:border-tx hover:text-tx"
    >
      <Icon name="groups" size={16} />
      Usuários
    </Link>
  )
}
