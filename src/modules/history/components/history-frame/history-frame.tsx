import type { ReactNode } from 'react'

export function HistoryFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative z-[1] min-h-0 flex-1 animate-fade-in overflow-y-auto">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-[26px] px-5 pt-[22px] pb-10 leading-[normal] mobile:gap-5 mobile:px-3 mobile:pt-4 mobile:pb-[30px]">{children}</div>
    </div>
  )
}
