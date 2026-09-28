'use client'

import { Icon } from '@/components/ui/icon/icon'
import { type Category, categoryLabel } from '../../categories'
import { useNewChampionshipLauncher } from '../new-championship-provider/new-championship-provider'

export function NewChampionshipButton({ category }: { category: Category }) {
  const { openFor } = useNewChampionshipLauncher()

  return (
    <button
      type="button"
      onClick={() => openFor(category)}
      className="flex h-11 items-center justify-center gap-2 border border-dashed border-bd2 bg-transparent text-[10.8px] font-bold tracking-[-.01em] text-tx4 transition-colors duration-[140ms] hover:border-tx hover:text-tx"
    >
      <Icon name="add" size={14} />
      Novo campeonato {categoryLabel[category]}
    </button>
  )
}
