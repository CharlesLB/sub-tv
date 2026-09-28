import Link from 'next/link'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import type { TeamSeasonVM } from '../../types'
import { FormSquares } from '../form-squares/form-squares'
import { HistorySection } from '../history-section/history-section'
import { RowChevron } from '../row-chevron/row-chevron'

const ROW_DELAY_STEP_MS = 35
const MAX_ROW_DELAY_MS = 400
const CHAMPIONSHIP_SEPARATOR = ' · '

const recordLine = (season: TeamSeasonVM): string => `${season.wins}V ${season.draws}E ${season.losses}D · ${season.goalsFor}:${season.goalsAgainst}`

export function TeamCampaign({ seasons }: { seasons: TeamSeasonVM[] }) {
  return (
    <HistorySection title="Campanha por temporada">
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
            <FormSquares form={season.form} />
            <span className="w-[132px] flex-none text-right text-[10px] tracking-[.06em] text-tx3 nums mobile:hidden">{recordLine(season)}</span>
            <span className="w-16 flex-none text-right text-[13.5px] font-bold text-tx nums">{`${season.points} PTS`}</span>
            <RowChevron />
          </Link>
        ))}
      </div>
    </HistorySection>
  )
}
