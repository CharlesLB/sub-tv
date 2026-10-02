import { cn } from '@/lib/utils/cn'
import { IntentLink } from '@/components/ui/intent-link/intent-link'
import { CATEGORIES, categoryLabel } from '@/modules/championships/client'
import { type HistoryFilter, toggleSeasonYear } from '../../lib/history-filter/history-filter'
import { type HistoryTarget, historyHref } from '../../lib/history-href/history-href'
import { historyFiltersStyles as styles } from './history-filters.styles'

const ALL_LABEL = 'Todas'
const OVERVIEW_TARGET = { kind: 'overview' } as const

type HistoryFiltersProps = { filter: HistoryFilter; availableYears: number[]; target: HistoryTarget }

export function HistoryFilters({ filter, availableYears, target }: HistoryFiltersProps) {
  const categoryChips = [
    { key: ALL_LABEL, label: ALL_LABEL, category: null, className: filter.category === null ? styles.allCategoriesChip.active : styles.allCategoriesChip.idle },
    ...CATEGORIES.map((category) => ({
      key: category,
      label: categoryLabel[category],
      category,
      className: filter.category === category ? styles.categoryChipByCategory[category].active : styles.categoryChipByCategory[category].idle,
    })),
  ]

  const seasonChips = [
    { key: ALL_LABEL, label: ALL_LABEL, years: [], isActive: filter.years.length === 0 },
    ...availableYears.map((year) => ({ key: String(year), label: String(year), years: toggleSeasonYear(filter.years, year, availableYears), isActive: filter.years.includes(year) })),
  ]

  return (
    <div className={styles.filters}>
      <div className={styles.categoryRow}>
        <span className={styles.filterLabel}>Categoria</span>
        <div className={styles.categoryChips}>
          {categoryChips.map((chip) => (
            <IntentLink
              key={chip.key}
              href={historyHref(OVERVIEW_TARGET, { category: chip.category, years: filter.years })}
              aria-current={chip.category === filter.category ? 'true' : undefined}
              className={cn(styles.categoryChip, chip.className)}
            >
              {chip.label}
            </IntentLink>
          ))}
        </div>
      </div>
      <div className={styles.seasonRow}>
        <span className={cn(styles.filterLabel, styles.seasonLabel)}>Temporadas</span>
        <div className={styles.seasonChips}>
          {seasonChips.map((chip) => (
            <IntentLink
              key={chip.key}
              href={historyHref(target, { category: filter.category, years: chip.years })}
              aria-current={chip.isActive ? 'true' : undefined}
              className={cn(styles.seasonChip, chip.isActive ? styles.seasonChipActive : styles.seasonChipIdle)}
            >
              {chip.label}
            </IntentLink>
          ))}
        </div>
      </div>
    </div>
  )
}
