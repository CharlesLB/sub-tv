import { CATEGORIES, categoryBorderClass } from '../../categories'
import type { CategoryClubsVM, ChampionshipCardVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'
import { ChampionshipCard } from '../championship-card/championship-card'
import { NewChampionshipButton } from '../new-championship-button/new-championship-button'
import { NewChampionshipProvider } from '../new-championship-provider/new-championship-provider'

const pluralize = (count: number, singular: string, plural: string): string =>
  `${count} ${count === 1 ? singular : plural}`

type ChampionshipListProps = {
  championships: ChampionshipCardVM[]
  year: number
  clubs: CategoryClubsVM
  canEdit: boolean
}

export function ChampionshipList({ championships, year, clubs, canEdit }: ChampionshipListProps) {
  const columns = CATEGORIES.map((category) => ({
    category,
    championships: championships.filter((championship) => championship.category === category),
  }))

  return (
    <div className="animate-fade-in mobile:px-3 mobile:pt-[14px] mobile:pb-[26px] min-h-0 flex-1 overflow-y-auto p-5">
      <NewChampionshipProvider year={year} clubs={clubs}>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-[18px]">
          {columns.map((column) => {
            const teamCount = column.championships.reduce(
              (total, championship) => total + championship.teamCount,
              0,
            )
            const athleteCount = column.championships.reduce(
              (total, championship) => total + championship.athleteCount,
              0,
            )

            return (
              <section
                key={column.category}
                aria-label={`Campeonatos ${column.category}`}
                className="flex min-w-0 flex-col gap-3"
              >
                <div
                  className={`flex items-center gap-[10px] border-b-2 pb-[9px] ${categoryBorderClass[column.category]}`}
                >
                  <CategoryTag category={column.category} size="extraLarge" />
                  <span className="text-tx4 text-[11px]">
                    {[
                      pluralize(column.championships.length, 'campeonato', 'campeonatos'),
                      pluralize(teamCount, 'time', 'times'),
                      pluralize(athleteCount, 'atleta', 'atletas'),
                    ].join(' · ')}
                  </span>
                </div>
                {column.championships.map((championship, index) => (
                  <ChampionshipCard
                    key={championship.id}
                    championship={championship}
                    index={index}
                  />
                ))}
                {column.championships.length === 0 ? (
                  <div className="border-bd2 text-tx4 flex h-11 items-center justify-center border border-dashed text-[10.8px] font-bold tracking-[-.01em]">
                    Nenhum campeonato nesta temporada
                  </div>
                ) : null}
                {canEdit ? <NewChampionshipButton category={column.category} /> : null}
              </section>
            )
          })}
        </div>
      </NewChampionshipProvider>
    </div>
  )
}
