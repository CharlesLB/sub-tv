import { CategoryTag, getChampionshipHeader } from '@/modules/championships'
import { sheetChampionshipDetailsStyles as styles } from './sheet-championship-details.styles'

type SheetChampionshipDetailsProps = { seasonId: string }

export async function SheetChampionshipDetails({ seasonId }: SheetChampionshipDetailsProps) {
  const header = await getChampionshipHeader(seasonId)
  if (!header) return null

  return (
    <>
      <CategoryTag category={header.category} size="medium" />
      <span className={styles.name}>{header.name}</span>
    </>
  )
}
