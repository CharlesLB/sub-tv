export const lineupBoardStyles = {
  board:
    'grid max-h-[min(46vh,520px)] min-h-[180px] max-w-[1400px] flex-1 animate-fade-up grid-cols-[minmax(104px,124px)_minmax(0,1fr)_minmax(104px,124px)] grid-rows-[minmax(0,1fr)] items-stretch gap-px overflow-hidden bg-bd',
  fieldArea: '[container-type:size] col-start-2 row-start-1 flex min-h-0 min-w-0 items-center justify-center overflow-hidden bg-pan p-4',
  field: 'relative aspect-[105/64] w-[min(100%,164cqh)] flex-none rounded-card border border-gr-borda turf',
  announcement: 'sr-only',
} as const
