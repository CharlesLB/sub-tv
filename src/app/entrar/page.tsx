import type { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from '@/modules/auth'
import { BrandLogo } from '@/modules/platform'

export const metadata: Metadata = { title: 'Entrar' }

export default function LoginPage({ searchParams }: PageProps<'/entrar'>) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg p-4 text-tx">
      <div className="flex w-full max-w-[360px] flex-col gap-5 rounded-card border border-bd bg-pan p-6">
        <BrandLogo />
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-[19px] font-bold tracking-[-.01em]">Acesso da equipe</h1>
          <p className="text-[12.5px] text-tx4">Entre com seu usuário. Toda alteração fica registrada em seu nome.</p>
        </div>
        <Suspense fallback={<div className="h-[140px]" />}>
          {searchParams.then(({ para }) => (
            <LoginForm returnTo={typeof para === 'string' ? para : undefined} />
          ))}
        </Suspense>
      </div>
    </main>
  )
}
