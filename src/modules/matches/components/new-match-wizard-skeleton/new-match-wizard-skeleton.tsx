import { Skeleton } from '@/components/ui/skeleton/skeleton'

const STEP_PLACEHOLDERS = [1, 2, 3, 4]
const FIELD_PLACEHOLDERS = ['date', 'time', 'round']

export function NewMatchWizardSkeleton() {
  return (
    <div aria-busy aria-label="Carregando nova partida" className="flex min-h-[420px] flex-1 flex-col bg-bg">
      <div className="flex flex-none overflow-hidden border-b border-bd bg-pan">
        {STEP_PLACEHOLDERS.map((step) => (
          <div key={step} className="flex min-w-[158px] flex-[1_1_0] items-center gap-[11px] border-b-2 border-bd px-4 py-[13px] [&+&]:border-l [&+&]:border-l-bd">
            <Skeleton className="size-6 rounded-card" delayMs={step * 60} />
            <span className="flex flex-col gap-[6px]">
              <Skeleton className="h-[10px] w-20" delayMs={step * 60} />
              <Skeleton className="h-2 w-24" delayMs={step * 60} />
            </span>
          </div>
        ))}
      </div>
      <div className="flex-1 px-5 py-4 mobile:px-3">
        <div className="chamfer grid max-w-[820px] grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-4 bg-pan2 p-5">
          {FIELD_PLACEHOLDERS.map((field, index) => (
            <div key={field} className="flex flex-col gap-[6px]">
              <Skeleton className="h-[10px] w-14" delayMs={index * 80} />
              <Skeleton className="h-[42px] w-full rounded-card" delayMs={index * 80} />
            </div>
          ))}
          <div className="col-span-full flex flex-col gap-[6px]">
            <Skeleton className="h-[10px] w-14" delayMs={240} />
            <Skeleton className="h-[42px] w-full rounded-card" delayMs={240} />
          </div>
        </div>
      </div>
      <div className="flex flex-none items-center gap-[14px] border-t border-bd bg-pan px-5 py-3">
        <Skeleton className="h-[34px] w-[96px] rounded-card" />
        <Skeleton className="h-[10px] w-56" />
        <Skeleton className="ml-auto h-11 w-[104px] rounded-card" />
        <Skeleton className="h-12 w-[128px]" />
      </div>
    </div>
  )
}
