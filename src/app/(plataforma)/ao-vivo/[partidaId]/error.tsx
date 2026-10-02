'use client'

import type { ErrorInfo } from 'next/error'
import Link from 'next/link'
import { routes } from '@/lib/routes'
import { Icon } from '@/components/ui/icon/icon'
import { LinkPendingIndicator } from '@/components/ui/link-pending-indicator/link-pending-indicator'

export default function LiveMatchError({ retry }: ErrorInfo) {
  return (
    <div role="alert" className="flex min-h-0 flex-1 items-center justify-center bg-bg p-5">
      <div className="flex max-w-[420px] animate-fade-up flex-col items-center gap-3 rounded-card border border-bd bg-pan px-7 py-8 text-center">
        <Icon name="error" size={26} className="text-vm" />
        <h2 className="text-[15.3px] font-bold tracking-[-.01em] text-tx">Não foi possível abrir a partida</h2>
        <p className="text-[12.5px] leading-[1.45] text-pretty text-tx3">Os lances já salvos continuam no servidor. Tente de novo ou volte para a lista de campeonatos.</p>
        <div className="mt-1 flex items-center gap-2">
          <button
            type="button"
            onClick={() => retry()}
            className="flex h-9 items-center gap-2 rounded-card bg-ac px-4 text-[11.7px] font-bold tracking-[-.01em] text-bg transition-opacity duration-150 hover:opacity-90"
          >
            <Icon name="history" size={16} />
            Tentar de novo
          </button>
          <Link href={routes.championships()} className="flex h-9 items-center rounded-card border border-bd2 px-4 text-[11.7px] font-bold tracking-[-.01em] text-tx2 hover:border-tx hover:text-tx">
            Campeonatos
            <LinkPendingIndicator />
          </Link>
        </div>
      </div>
    </div>
  )
}
