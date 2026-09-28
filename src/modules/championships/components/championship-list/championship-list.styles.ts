export const championshipListStyles = {
  scroller: 'min-h-0 flex-1 animate-fade-in overflow-y-auto p-5 mobile:px-3 mobile:pt-[14px] mobile:pb-[26px]',
  columns: 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-[18px]',
  column: 'flex min-w-0 flex-col gap-3',
  columnHeader: 'flex items-center gap-[10px] border-b-2 pb-[9px]',
  columnSummary: 'text-[11px] text-tx4',
  emptyColumn: 'flex h-11 items-center justify-center border border-dashed border-bd2 text-[10.8px] font-bold tracking-[-.01em] text-tx4',
} as const
