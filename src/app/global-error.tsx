'use client'

import { THEME } from '@/modules/platform/client'
import './globals.css'

export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="pt-BR" data-tema={THEME.LIGHT}>
      <body className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg p-6 text-center text-tx">
        <span className="text-[19px] font-bold tracking-[-.01em]">Algo deu errado ao abrir a sub.tv.</span>
        <button type="button" onClick={() => retry()} className="h-[38px] rounded-card bg-ac px-4 text-[11.3px] font-bold text-bg">
          Tentar de novo
        </button>
      </body>
    </html>
  )
}
