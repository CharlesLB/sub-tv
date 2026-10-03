import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { IntentLink } from '@/components/ui/intent-link/intent-link'
import { CATEGORIES, type Category, categoryBackgroundClass, categoryLabel } from '@/modules/championships/client'
import { parseTeamKey, toTeamKey } from '../../lib/team-key/team-key'
import { categoryFilterStyles as styles } from './category-filter.styles'

const ALL_CATEGORIES_LABEL = 'Todas'

type CategoryFilterProps = {
  year: number
  activeCategory: Category | undefined
  activeTeamKey: string | null
}

type FilterOption = { key: string; label: string; category: Category | undefined; activeClass: string }

const FILTER_OPTIONS: FilterOption[] = [
  { key: 'all', label: ALL_CATEGORIES_LABEL, category: undefined, activeClass: styles.allCategoriesActive },
  ...CATEGORIES.map((category) => ({ key: category, label: categoryLabel[category], category, activeClass: categoryBackgroundClass[category] })),
]

const teamKeyInCategory = (activeTeamKey: string | null, category: Category | undefined): string | undefined => {
  const activeTeam = parseTeamKey(activeTeamKey)
  if (!activeTeam) return undefined

  return category === undefined ? toTeamKey(activeTeam.category, activeTeam.clubId) : toTeamKey(category, activeTeam.clubId)
}

export function CategoryFilter({ year, activeCategory, activeTeamKey }: CategoryFilterProps) {
  return (
    <nav aria-label="Filtro de categoria" className={styles.nav}>
      {FILTER_OPTIONS.map((option) => {
        const isActive = option.category === activeCategory

        return (
          <IntentLink
            key={option.key}
            href={routes.squads({ year, category: option.category, teamKey: teamKeyInCategory(activeTeamKey, option.category) })}
            scroll={false}
            aria-current={isActive ? 'true' : undefined}
            className={cn(styles.option, isActive ? cn(styles.optionActive, option.activeClass) : styles.optionIdle)}
          >
            {option.label}
          </IntentLink>
        )
      })}
    </nav>
  )
}
