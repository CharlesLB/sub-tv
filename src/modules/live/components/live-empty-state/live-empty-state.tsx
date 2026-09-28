import Link from 'next/link'
import { Icon } from '@/components/ui/icon/icon'
import { routes } from '@/lib/routes'

type LiveEmptyStateProps = { seasonId: string }

export function LiveEmptyState({ seasonId }: LiveEmptyStateProps) {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-bg p-5">
      <div className="flex max-w-[440px] animate-fade-up flex-col items-center gap-3 rounded-card border border-bd bg-pan px-7 py-8 text-center">
        <span aria-hidden className="hexagon relative block h-[34px] w-7 bg-bd2">
          <span className="hexagon absolute inset-px bg-pan" />
        </span>
        <h2 className="text-[15.3px] font-bold tracking-[-.01em] text-tx">Partida sem escalação</h2>
        <p className="text-[12.5px] leading-[1.45] text-pretty text-tx3">
          Esta partida ainda não tem titulares definidos, então a prancheta não abre. Crie a transmissão pelo botão “Nova partida” do campeonato e escolha os 11 de cada
          time.
        </p>
        <Link
          href={routes.newMatch(seasonId)}
          className="mt-1 flex h-9 items-center gap-2 rounded-card bg-ac px-4 text-[11.7px] font-bold tracking-[-.01em] text-bg transition-transform hover:-translate-y-px"
        >
          <Icon name="add" size={16} />
          Nova partida
        </Link>
      </div>
    </div>
  )
}
