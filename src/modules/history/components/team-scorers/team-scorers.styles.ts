export const teamScorersStyles = {
  list: 'flex flex-col overflow-hidden rounded-card border border-bd bg-pan',
  row: 'flex animate-fade-up items-center gap-3 px-3 py-[9px] transition-colors duration-150 hover:bg-pan2',
  rowOdd: 'bg-pan0',
  rowEven: 'bg-pan',
  position: 'w-6 flex-none text-[11px] nums',
  positionLeader: 'text-ac',
  positionFollower: 'text-tx5',
  name: 'min-w-0 flex-1 truncate text-[12.6px] font-bold tracking-[-.01em] text-tx',
  games: 'w-10 flex-none text-right text-[10px] text-tx4 nums',
  barTrack: 'h-1 w-[84px] flex-none bg-bd',
  bar: 'block h-full',
  goals: 'w-[30px] flex-none text-right text-[15.3px] font-bold text-tx nums',
} as const
