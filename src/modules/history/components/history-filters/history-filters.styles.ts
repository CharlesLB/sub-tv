import { CATEGORY, type Category } from '@/modules/championships/client'

const categoryChipStyles: Record<Category, { active: string; idle: string }> = {
  [CATEGORY.SUB13]: { active: 'border-sub13/80 bg-sub13/22 text-sub13', idle: 'border-sub13/38 text-sub13' },
  [CATEGORY.SUB14]: { active: 'border-sub14/80 bg-sub14/22 text-sub14', idle: 'border-sub14/38 text-sub14' },
}

export const historyFiltersStyles = {
  filters: 'flex flex-col gap-[11px]',
  categoryRow: 'flex flex-wrap items-center gap-[11px]',
  categoryChips: 'flex flex-none items-center gap-[6px]',
  seasonRow: 'flex items-start gap-[11px]',
  seasonChips: 'flex min-w-0 flex-wrap gap-[5px]',
  filterLabel: 'w-[66px] flex-none text-[9.5px] tracking-[.05em] text-tx5',
  seasonLabel: 'pt-2',
  categoryChip: 'flex h-[30px] flex-none items-center rounded-card border px-[13px] text-[10.8px] font-bold tracking-[-.01em] transition-[background,color,border-color] duration-150 hover:text-tx',
  categoryChipByCategory: categoryChipStyles,
  allCategoriesChip: { active: 'border-bd3 bg-pan3 text-tx', idle: 'border-bd text-tx4' },
  seasonChip: 'flex h-[27px] flex-none items-center rounded-card border px-[10px] text-[10.5px] tracking-[.06em] transition-[background,color,border-color] duration-150',
  seasonChipActive: 'border-ac bg-ac text-bg',
  seasonChipIdle: 'border-bd2 text-tx3 hover:border-bd3',
} as const
