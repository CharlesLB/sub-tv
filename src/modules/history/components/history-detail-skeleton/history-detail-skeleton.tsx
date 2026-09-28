import { Skeleton } from '@/components/ui/skeleton/skeleton'
import { HistoryFiltersSkeleton } from '../history-filters-skeleton/history-filters-skeleton'
import { HistoryFrame } from '../history-frame/history-frame'
import { KpiGridSkeleton } from '../kpi-grid-skeleton/kpi-grid-skeleton'
import { RowsSkeleton } from '../rows-skeleton/rows-skeleton'

const KPI_COUNT = 4
const BAR_HEIGHT_PERCENTS = [48, 72, 60, 86, 54, 78, 66, 92] as const
const SEASON_ROW_COUNT = 5
const BAR_DELAY_STEP_MS = 40

export function HistoryDetailSkeleton() {
  return (
    <HistoryFrame>
      <HistoryFiltersSkeleton />
      <div aria-hidden className="flex flex-col gap-[22px]">
        <Skeleton className="h-8 w-[132px] rounded-card" />
        <div className="flex items-center gap-[14px] rounded-card border border-bd bg-pan px-[18px] py-4">
          <Skeleton className="size-[54px] flex-none" />
          <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
            <Skeleton className="h-6 w-[42%]" delayMs={60} />
            <Skeleton className="h-[10px] w-[58%]" delayMs={120} />
          </div>
        </div>
        <KpiGridSkeleton count={KPI_COUNT} variant="detail" />
        <div className="flex flex-col gap-[11px] rounded-card border border-bd bg-pan px-4 py-[15px]">
          <Skeleton className="h-[14px] w-[160px]" />
          <div className="flex h-[122px] items-end gap-[6px]">
            {BAR_HEIGHT_PERCENTS.map((heightPercent, index) => (
              <Skeleton key={index} className="max-w-[78px] flex-1" delayMs={index * BAR_DELAY_STEP_MS} style={{ height: `${heightPercent}%` }} />
            ))}
          </div>
        </div>
        <RowsSkeleton rowCount={SEASON_ROW_COUNT} titleWidthClass="w-[210px]" />
      </div>
    </HistoryFrame>
  )
}
