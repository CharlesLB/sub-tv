import { Suspense } from 'react'
import { pluralize } from '@/lib/utils/pluralize/pluralize'
import { EditorOnly } from '@/modules/auth'
import { CATEGORIES, categoryBorderClass, categoryLabel } from '../../lib/categories/categories'
import type { CategoryClubsVM, ChampionshipCardVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'
import { ChampionshipCard } from '../championship-card/championship-card'
import { NewChampionshipButton } from '../new-championship-button/new-championship-button'
import { NewChampionshipProvider } from '../new-championship-provider/new-championship-provider'
import { championshipListStyles as styles } from './championship-list.styles'

type ChampionshipListProps = {
  championships: ChampionshipCardVM[]
  year: number
  clubs: CategoryClubsVM
}

export function ChampionshipList({ championships, year, clubs }: ChampionshipListProps) {
  const columns = CATEGORIES.map((category) => ({
    category,
    championships: championships.filter((championship) => championship.category === category),
  }))

  return (
    <div className={styles.scroller}>
      <NewChampionshipProvider year={year} clubs={clubs}>
        <div className={styles.columns}>
          {columns.map((column) => {
            const teamCount = column.championships.reduce((total, championship) => total + championship.teamCount, 0)
            const athleteCount = column.championships.reduce((total, championship) => total + championship.athleteCount, 0)

            return (
              <section key={column.category} aria-label={`Campeonatos ${categoryLabel[column.category]}`} className={styles.column}>
                <div className={`${styles.columnHeader} ${categoryBorderClass[column.category]}`}>
                  <CategoryTag category={column.category} size="extraLarge" />
                  <span className={styles.columnSummary}>
                    {[pluralize(column.championships.length, 'campeonato', 'campeonatos'), pluralize(teamCount, 'time', 'times'), pluralize(athleteCount, 'atleta', 'atletas')].join(' · ')}
                  </span>
                </div>
                {column.championships.map((championship, index) => (
                  <ChampionshipCard key={championship.id} championship={championship} index={index} />
                ))}
                {column.championships.length === 0 ? <div className={styles.emptyColumn}>Nenhum campeonato nesta temporada</div> : null}
                <Suspense fallback={null}>
                  <EditorOnly>
                    <NewChampionshipButton category={column.category} />
                  </EditorOnly>
                </Suspense>
              </section>
            )
          })}
        </div>
      </NewChampionshipProvider>
    </div>
  )
}
