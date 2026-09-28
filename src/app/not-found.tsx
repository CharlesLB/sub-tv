import Link from 'next/link'

export default function RootNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-bg p-6 text-center text-tx">
      <span className="text-[19px] font-bold tracking-[-.01em]">Página não encontrada</span>
      <Link href="/campeonatos" className="text-[12.5px] text-ac underline underline-offset-[3px]">
        Ver campeonatos
      </Link>
    </main>
  )
}
