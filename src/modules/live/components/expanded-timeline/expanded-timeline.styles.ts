export const expandedTimelineStyles = {
  panel: 'flex min-h-0 flex-[1_1_auto] animate-fade-up flex-col overflow-x-hidden overflow-y-auto border-b border-bd bg-pan px-6 pt-[14px] pb-4 mobile:px-[13px] mobile:pt-3 mobile:pb-[14px]',
  header: 'grid grid-cols-[minmax(0,1fr)_92px_minmax(0,1fr)] items-center gap-[14px] border-b border-bd pb-[10px] mobile:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] mobile:gap-2',
  teamName: 'truncate text-[14.4px] font-bold tracking-[-.01em] whitespace-nowrap mobile:text-[12.6px]',
  homeTeamName: 'text-right',
  title: 'text-center text-[10.8px] font-bold tracking-[-.01em] text-tx4',
  empty: 'flex flex-col items-center gap-2 pt-[22px] pb-2 text-center',
  hexagon: 'relative block h-[29px] w-6 bg-bd2 hexagon',
  hexagonInner: 'absolute inset-px bg-pan hexagon',
  emptyTitle: 'text-[11.7px] font-bold tracking-[-.01em] text-tx3',
  emptyDescription: 'text-[12px] text-tx4',
} as const
