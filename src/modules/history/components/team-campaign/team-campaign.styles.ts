export const teamCampaignStyles = {
  table: 'flex flex-col overflow-x-auto rounded-card border border-bd bg-pan',
  row: 'flex w-full animate-fade-up items-center gap-3 px-3 py-[11px] text-left transition-colors duration-150 hover:bg-pan2',
  rowOdd: 'bg-pan0',
  rowEven: 'bg-pan',
  year: 'w-[46px] flex-none text-[15.3px] font-bold text-tx nums',
  championships: 'min-w-0 flex-1 truncate text-[10px] tracking-[.07em] text-tx4',
  record: 'w-[132px] flex-none text-right text-[10px] tracking-[.06em] text-tx3 nums mobile:hidden',
  points: 'w-16 flex-none text-right text-[13.5px] font-bold text-tx nums',
} as const
