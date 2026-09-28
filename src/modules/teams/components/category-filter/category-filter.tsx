import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { CATEGORIES, categoryBackgroundClass, categoryLabel, type Category } from '@/modules/championships/client'

const ALL_CATEGORIES_LABEL = 'Todas'

type CategoryFilterProps = {
  year: number
  activeCategory: Category | undefined
  activeTeamKey: string | null
}

type FilterOption = { key: string; label: string; category: Category | undefined; activeClass: string }

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: ALL_CATEGORIES_LABEL, category: undefined, activeClass: 'bg-tx' },
  ...CATEGORIES.map((category) => ({ key: category, label: categoryLabel[category], category, activeClass: categoryBackgroundClass[category] })),
]

export function CategoryFilter({ year, activeCategory, activeTeamKey }: CategoryFilterProps) {
  return (
    <nav aria-label="Filtro de categoria" className="flex flex-wrap gap-[6px] px-4 pb-3 mobile:no-scrollbar mobile:flex-nowrap mobile:overflow-x-auto mobile:px-3 mobile:pb-[9px]">
      {FILTER_OPTIONS.map((option) => {
        const isActive = option.category === activeCategory

        return (
          <Link
            key={option.key}
            href={routes.squads({ year, category: option.category, teamKey: activeTeamKey ?? undefined })}
            scroll={false}
            aria-current={isActive ? 'true' : undefined}
            className={cn(
              'inline-flex h-[30px] flex-none items-center rounded-card border px-[11px] text-[9.9px] font-bold tracking-[-.01em] transition-[background,border-color,color] duration-[140ms]',
              isActive ? cn('border-transparent text-bg', option.activeClass) : 'border-bd2 text-tx2 hover:border-bd3 hover:text-tx',
            )}
          >
            {option.label}
          </Link>
        )
      })}
    </nav>
  )
}
