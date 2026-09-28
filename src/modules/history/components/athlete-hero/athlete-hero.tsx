import { categoryLabel, categoryTextClass } from '@/modules/championships/client'
import { cn } from '@/lib/utils/cn'
import { pluralize } from '../../stat-format/stat-format'
import type { AthleteHistoryVM } from '../../types'

const FALLBACK_COLOR_CLASS = 'border-tx4 text-tx4'
const MISSING_VALUE = '–'

export function AthleteHero({ history }: { history: AthleteHistoryVM }) {
  const teamColor = history.team?.color
  const teamLine =
    history.team && history.category
      ? `${history.team.name} · ${categoryLabel[history.category]}`
      : null
  const subtitle = `${pluralize(history.seasons.length, 'Temporada', 'Temporadas')} No filtro · ${history.games} Jogos`

  return (
    <div className="rounded-card border-bd bg-pan flex items-center gap-[14px] border px-[18px] py-4">
      <span
        className={cn(
          'nums flex size-[54px] flex-none items-center justify-center border-2 text-[21.6px] font-bold',
          teamColor ? null : FALLBACK_COLOR_CLASS,
        )}
        style={teamColor ? { borderColor: teamColor, color: teamColor } : undefined}
      >
        {history.shirtNumber ?? MISSING_VALUE}
      </span>
      <div className="flex min-w-0 flex-col gap-[5px]">
        <div className="flex flex-wrap items-baseline gap-[11px]">
          <span className="text-tx text-[24.3px] leading-[1.05] font-bold tracking-[-.01em]">
            {history.name}
          </span>
          {history.nickname ? (
            <span className="text-tx3 text-[11.5px] tracking-[.08em]">{`“${history.nickname}”`}</span>
          ) : null}
        </div>
        {history.position || teamLine ? (
          <div className="flex flex-wrap items-baseline gap-[11px]">
            {history.position ? (
              <span
                className={cn(
                  'text-[10px] tracking-[.05em]',
                  history.category ? categoryTextClass[history.category] : 'text-tx3',
                )}
              >
                {history.position}
              </span>
            ) : null}
            {teamLine ? (
              <span className="text-tx2 text-[12.6px] font-bold tracking-[-.01em]">{teamLine}</span>
            ) : null}
          </div>
        ) : null}
        <span className="text-tx4 text-[10px] tracking-[.1em]">{subtitle}</span>
      </div>
    </div>
  )
}
