export const wizardSummaryStyles = {
  summary: 'flex flex-none animate-rise-in flex-wrap items-start gap-6 border-t border-bd2 bg-pan2 px-5 py-4 mobile:gap-4 mobile:px-3',
  matchupSection: 'flex min-w-[200px] flex-col gap-2',
  sectionLabel: 'text-[9px] font-semibold tracking-[-.01em] text-tx4',
  side: 'flex min-w-0 items-center gap-[10px]',
  sideName: 'min-w-0 truncate text-[13.5px] font-bold tracking-[-.01em]',
  sideLineupCount: 'ml-auto text-[10.5px] whitespace-nowrap text-tx4',
  scheduleSection: 'flex min-w-[220px] flex-col gap-[7px] border-l border-bd2 pl-6 mobile:min-w-0 mobile:border-l-0 mobile:pl-0',
  scheduleLine: 'truncate text-[11.5px] whitespace-nowrap text-tx2',
  categorySection: 'flex min-w-[180px] flex-col gap-[9px] border-l border-bd2 pl-6 mobile:border-l-0 mobile:pl-0',
  categoryTag: 'self-start',
  categoryNote: 'text-[11.5px] leading-[1.45] text-pretty text-tx4',
} as const
