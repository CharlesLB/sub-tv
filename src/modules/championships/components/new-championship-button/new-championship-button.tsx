'use client'

import { Icon } from '@/components/ui/icon/icon'
import { type Category, categoryLabel } from '../../categories'
import { useNewChampionshipLauncher } from '../new-championship-provider/new-championship-provider'
import { newChampionshipButtonStyles as styles } from './new-championship-button.styles'

export function NewChampionshipButton({ category }: { category: Category }) {
  const { openFor } = useNewChampionshipLauncher()

  return (
    <button type="button" onClick={() => openFor(category)} className={styles.button}>
      <Icon name="add" size={14} />
      Novo campeonato {categoryLabel[category]}
    </button>
  )
}
