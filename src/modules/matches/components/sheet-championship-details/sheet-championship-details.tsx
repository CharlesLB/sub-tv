import { CategoryTag, getChampionshipHeader } from '@/modules/championships'

type SheetChampionshipDetailsProps = { seasonId: string }

export async function SheetChampionshipDetails({ seasonId }: SheetChampionshipDetailsProps) {
  const header = await getChampionshipHeader(seasonId)
  if (!header) return null

  return (
    <>
      <CategoryTag category={header.category} size="medium" />
      <span className="min-w-0 truncate text-[11.3px] font-semibold tracking-[-.01em] whitespace-nowrap text-tx4">{header.name}</span>
    </>
  )
}
