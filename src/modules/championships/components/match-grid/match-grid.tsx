import * as R from 'remeda'
import type { Category } from '../../lib/categories/categories'
import { toPhaseLabel } from '../../lib/mappers/mappers'
import type { MatchCardVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'
import { MatchCard } from '../match-card/match-card'
import { matchGridStyles as styles } from './match-grid.styles'

type RoundGroup = { key: string; title: string; matches: MatchCardVM[] }

const groupByRound = (matches: MatchCardVM[]): RoundGroup[] =>
  R.pipe(
    matches,
    R.groupBy((match) => `${match.phase ?? ''}|${match.round ?? 0}`),
    R.values(),
    R.map((roundMatches) => {
      const [firstMatch] = roundMatches

      return {
        key: `${firstMatch.phase ?? ''}-${firstMatch.round ?? 0}`,
        title: [toPhaseLabel(firstMatch.phase), firstMatch.round ? `Rodada ${firstMatch.round}` : null].filter(Boolean).join(' · '),
        matches: roundMatches,
        firstKickoff: firstMatch.kickoffAt ?? '',
      }
    }),
    R.sortBy([(group) => group.firstKickoff, 'desc']),
    R.map(({ key, title, matches: roundMatches }) => ({ key, title, matches: roundMatches })),
  )

type MatchGridProps = { matches: MatchCardVM[]; seasonId: string; category: Category }

export function MatchGrid({ matches, seasonId, category }: MatchGridProps) {
  const groups = groupByRound(matches)

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>Partidas</span>
        <CategoryTag category={category} size="extraLarge" />
      </div>
      {groups.length === 0 ? <div className={styles.emptyState}>Nenhuma partida cadastrada.</div> : null}
      <div className={styles.groups}>
        {groups.map((group) => (
          <div key={group.key} className={styles.group}>
            <span className={styles.groupTitle}>{group.title}</span>
            <div className={styles.cards}>
              {group.matches.map((match) => (
                <MatchCard key={match.id} match={match} seasonId={seasonId} category={category} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
