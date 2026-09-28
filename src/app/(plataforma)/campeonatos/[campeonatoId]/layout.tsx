import { FlashToastHost } from '@/modules/championships/client'

export default function ChampionshipLayout({ children, modal }: LayoutProps<'/campeonatos/[campeonatoId]'>) {
  return (
    <>
      {children}
      {modal}
      <FlashToastHost />
    </>
  )
}
