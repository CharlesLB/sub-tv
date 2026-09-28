export const roundPanelStyles = {
  panel: 'flex min-w-[280px] flex-[0_1_340px] flex-col gap-[10px] mobile:min-w-0',
  header: 'flex items-center gap-[10px]',
  title: 'text-[13.5px] font-bold tracking-[-.01em]',
  matchCount: 'ml-auto text-[10.5px] text-tx4',
  emptyState: 'flex flex-col items-center gap-[14px] rounded-card border border-bd bg-pan px-[18px] py-[26px] text-center',
  emptyCrest: 'h-[34px] w-7 border border-bd2 bg-bd hexagon',
  emptyTitle: 'text-[13.5px] font-bold tracking-[-.01em]',
  emptyDescription: 'max-w-[260px] text-[12.5px] leading-normal text-tx3',
  createMatchLink: 'flex h-[38px] items-center bg-ac px-4 text-[10.8px] font-bold tracking-[-.01em] text-bg',
  allRoundsLink: 'flex h-9 items-center justify-center border border-dashed border-bd2 text-[10.3px] font-bold tracking-[-.01em] text-tx4 hover:border-tx hover:text-tx',
} as const
