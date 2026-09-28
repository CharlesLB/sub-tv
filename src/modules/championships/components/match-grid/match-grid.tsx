import * as R from 'remeda'
import type { Category } from '../../categories'
import { toPhaseLabel } from '../../mappers'
import type { MatchCardVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'
import { MatchCard } from '../match-card/match-card'

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
    <section className="animate-fade-up">
      <div className="mb-[14px] flex flex-wrap items-center gap-3">
        <span className="text-[13.5px] font-bold tracking-[-.01em]">Partidas</span>
        <CategoryTag category={category} size="extraLarge" />
      </div>
      {groups.length === 0 ? <div className="rounded-card border border-bd bg-pan px-4 py-6 text-center text-[12.5px] text-tx4">Nenhuma partida cadastrada.</div> : null}
      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col gap-[10px]">
            <span className="text-[11px] tracking-[.1em] text-tx4 uppercase">{group.title}</span>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,344px),1fr))] gap-[14px]">
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
