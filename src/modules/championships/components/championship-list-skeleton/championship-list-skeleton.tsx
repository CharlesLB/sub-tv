import { Skeleton } from '@/components/ui/skeleton/skeleton'

const COLUMN_KEYS = ['first', 'second'] as const
const CARD_KEYS = ['first', 'second'] as const
const COLUMN_DELAY_MS = 100
const CARD_DELAY_MS = 400

export function ChampionshipListSkeleton() {
  return (
    <div aria-hidden className="min-h-0 flex-1 overflow-hidden p-5">
      <div className="mx-auto grid max-w-[1240px] grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-[18px]">
        {COLUMN_KEYS.map((columnKey, columnIndex) => (
          <div key={columnKey} className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center gap-[10px] border-b-2 border-bd pb-[9px]">
              <Skeleton className="h-[26px] w-[84px]" delayMs={columnIndex * COLUMN_DELAY_MS} />
              <Skeleton className="h-[11px] w-[200px] max-w-[60%]" delayMs={columnIndex * COLUMN_DELAY_MS + 100} />
            </div>
            {CARD_KEYS.map((cardKey, cardIndex) => {
              const baseDelay = columnIndex * COLUMN_DELAY_MS + cardIndex * CARD_DELAY_MS

              return (
                <div key={cardKey} className="flex flex-col gap-3 rounded-card border border-t-2 border-bd bg-pan p-4">
                  <div className="flex items-start gap-[10px]">
                    <div className="flex flex-1 flex-col gap-[5px]">
                      <Skeleton className="h-[22px] w-[74%]" delayMs={baseDelay + 50} />
                      <Skeleton className="h-[10px] w-[52%]" delayMs={baseDelay + 100} />
                    </div>
                    <Skeleton className="h-5 w-[62px]" delayMs={baseDelay + 150} />
                  </div>
                  <div className="flex flex-col gap-[9px] bg-pan2 px-[10px] py-2">
                    <Skeleton className="h-3" delayMs={baseDelay + 200} />
                    <Skeleton className="h-3" delayMs={baseDelay + 250} />
                    <Skeleton className="h-3" delayMs={baseDelay + 300} />
                  </div>
                  <Skeleton className="h-[35px] rounded-card border border-bd bg-pan2" delayMs={baseDelay + 350} />
                  <Skeleton className="h-9 bg-pan2" delayMs={baseDelay + 400} />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
