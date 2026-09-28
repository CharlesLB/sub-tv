import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { formatRatio } from '../../stat-format/stat-format'
import type { AthleteSeasonVM } from '../../types'
import { HistorySection } from '../history-section/history-section'
import { RowChevron } from '../row-chevron/row-chevron'

const ROW_DELAY_STEP_MS = 35
const MAX_ROW_DELAY_MS = 400
const AVERAGE_DIGITS = 2
const CHAMPIONSHIP_SEPARATOR = ' · '

export function AthleteSeasonsTable({ seasons }: { seasons: AthleteSeasonVM[] }) {
  return (
    <HistorySection title="Temporada por temporada">
      <div className="flex flex-col overflow-x-auto rounded-card border border-bd bg-pan">
        {seasons.map((season, index) => (
          <Link
            key={season.year}
            href={routes.championships(season.year)}
            title={`Abrir a temporada ${season.year}`}
            className={cn('flex w-full animate-fade-up items-center gap-3 px-3 py-[11px] text-left transition-colors duration-150 hover:bg-pan2', index % 2 === 1 ? 'bg-pan0' : 'bg-pan')}
            style={{ animationDelay: `${Math.min(MAX_ROW_DELAY_MS, index * ROW_DELAY_STEP_MS)}ms` }}
          >
            <span className="w-[46px] flex-none text-[15.3px] font-bold text-tx nums">{season.year}</span>
            <span className="min-w-0 flex-1 truncate text-[10px] tracking-[.07em] text-tx4">{season.championships.join(CHAMPIONSHIP_SEPARATOR)}</span>
            <span className="w-[52px] flex-none text-right text-[10px] text-tx3 nums">{`${season.games}J`}</span>
            <span className="w-14 flex-none text-right text-[10px] text-tx4 nums">{formatRatio(season.goals, season.games, AVERAGE_DIGITS)}</span>
            <span className="w-11 flex-none text-right text-[15.3px] font-bold text-tx nums">{season.goals}</span>
            <RowChevron />
          </Link>
        ))}
      </div>
    </HistorySection>
  )
}
