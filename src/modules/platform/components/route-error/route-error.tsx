'use client'

import { Icon } from '@/components/ui/icon/icon'

type RouteErrorProps = {
  title?: string
  description?: string
  retry: () => void
}

export function RouteError({ title = 'Não foi possível carregar esta parte.', description = 'Tente de novo. Se continuar, avise a coordenação da transmissão.', retry }: RouteErrorProps) {
  return (
    <div role="alert" className="flex flex-1 items-center justify-center p-6">
      <div className="flex max-w-[420px] flex-col items-center gap-3 rounded-card border border-bd bg-pan px-6 py-7 text-center">
        <Icon name="error" size={26} className="text-am" />
        <span className="text-[15.3px] font-bold tracking-[-.01em]">{title}</span>
        <span className="text-[12.5px] leading-normal text-tx3">{description}</span>
        <button type="button" onClick={() => retry()} className="mt-1 h-[38px] rounded-card bg-ac px-4 text-[11.3px] font-bold tracking-[-.01em] text-bg">
          Tentar de novo
        </button>
      </div>
    </div>
  )
}
