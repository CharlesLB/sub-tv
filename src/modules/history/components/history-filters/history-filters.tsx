import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import { CATEGORIES, CATEGORY, type Category, categoryLabel } from '@/modules/championships/client'
import { type HistoryFilter, toggleSeasonYear } from '../../history-filter/history-filter'
import { type HistoryTarget, historyHref } from '../../history-href/history-href'

const ALL_LABEL = 'Todas'
const OVERVIEW_TARGET = { kind: 'overview' } as const

const CATEGORY_CHIP_CLASS: Record<Category, { active: string; idle: string }> = {
  [CATEGORY.SUB13]: { active: 'border-sub13/80 bg-sub13/22 text-sub13', idle: 'border-sub13/38 text-sub13' },
  [CATEGORY.SUB14]: { active: 'border-sub14/80 bg-sub14/22 text-sub14', idle: 'border-sub14/38 text-sub14' },
}

const ALL_CATEGORIES_CHIP_CLASS = { active: 'border-bd3 bg-pan3 text-tx', idle: 'border-bd text-tx4' } as const

const CATEGORY_CHIP_BASE =
  'flex h-[30px] flex-none items-center rounded-card border px-[13px] text-[10.8px] font-bold tracking-[-.01em] transition-[background,color,border-color] duration-150 hover:text-tx'

const SEASON_CHIP_BASE = 'flex h-[27px] flex-none items-center rounded-card border px-[10px] text-[10.5px] tracking-[.06em] transition-[background,color,border-color] duration-150'
const FILTER_LABEL = 'w-[66px] flex-none text-[9.5px] tracking-[.05em] text-tx5'

type HistoryFiltersProps = { filter: HistoryFilter; availableYears: number[]; target: HistoryTarget }

export function HistoryFilters({ filter, availableYears, target }: HistoryFiltersProps) {
  const categoryChips = [
    { key: ALL_LABEL, label: ALL_LABEL, category: null, className: filter.category === null ? ALL_CATEGORIES_CHIP_CLASS.active : ALL_CATEGORIES_CHIP_CLASS.idle },
    ...CATEGORIES.map((category) => ({
      key: category,
      label: categoryLabel[category],
      category,
      className: filter.category === category ? CATEGORY_CHIP_CLASS[category].active : CATEGORY_CHIP_CLASS[category].idle,
    })),
  ]

  const seasonChips = [
    { key: ALL_LABEL, label: ALL_LABEL, years: [], isActive: filter.years.length === 0 },
    ...availableYears.map((year) => ({ key: String(year), label: String(year), years: toggleSeasonYear(filter.years, year, availableYears), isActive: filter.years.includes(year) })),
  ]

  return (
    <div className="flex flex-col gap-[11px]">
      <div className="flex flex-wrap items-center gap-[11px]">
        <span className={FILTER_LABEL}>Categoria</span>
        <div className="flex flex-none items-center gap-[6px]">
          {categoryChips.map((chip) => (
            <Link
              key={chip.key}
              href={historyHref(OVERVIEW_TARGET, { category: chip.category, years: filter.years })}
              aria-current={chip.category === filter.category ? 'true' : undefined}
              className={cn(CATEGORY_CHIP_BASE, chip.className)}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-start gap-[11px]">
        <span className={cn(FILTER_LABEL, 'pt-2')}>Temporadas</span>
        <div className="flex min-w-0 flex-wrap gap-[5px]">
          {seasonChips.map((chip) => (
            <Link
              key={chip.key}
              href={historyHref(target, { category: filter.category, years: chip.years })}
              aria-current={chip.isActive ? 'true' : undefined}
              className={cn(SEASON_CHIP_BASE, chip.isActive ? 'border-ac bg-ac text-bg' : 'border-bd2 text-tx3 hover:border-bd3')}
            >
              {chip.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
