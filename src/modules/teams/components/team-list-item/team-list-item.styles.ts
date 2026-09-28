export const teamListItemStyles = {
  item: 'flex items-center gap-[10px] border-0 border-l-[3px] px-4 py-[10px] text-tx transition-[background,border-color] duration-[140ms]',
  itemMobile: 'mobile:flex-none mobile:gap-[7px] mobile:rounded-card mobile:border mobile:px-[10px] mobile:py-[7px]',
  itemActive: 'bg-pan2',
  itemIdle: 'border-transparent hover:bg-pan2 mobile:border-bd',
  details: 'flex min-w-0 flex-1 flex-col gap-[3px]',
  name: 'truncate text-[12.2px] font-bold tracking-[-.01em] whitespace-nowrap',
  categoryTag: 'self-start px-[7px]',
  athleteCount: 'text-[11px] text-tx4 nums',
} as const
