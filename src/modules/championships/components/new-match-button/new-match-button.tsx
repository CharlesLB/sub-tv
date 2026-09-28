import Link from 'next/link'
import { routes } from '@/lib/routes'
import { Icon } from '@/components/ui/icon/icon'

type NewMatchButtonProps = { seasonId: string }

export function NewMatchButton({ seasonId }: NewMatchButtonProps) {
  return (
    <Link
      href={routes.newMatch(seasonId)}
      title="Nova partida"
      className="flex h-[34px] flex-none items-center gap-[7px] bg-ac px-[14px] text-[10.8px] font-bold tracking-[-.01em] text-bg mobile:w-[34px] mobile:justify-center mobile:px-0"
    >
      <Icon name="sportsSoccer" size={17} />
      <span className="mobile:hidden">Nova partida</span>
    </Link>
  )
}
