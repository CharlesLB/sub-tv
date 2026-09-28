export const timelineRowStyles = {
  row: 'grid grid-cols-[minmax(0,1fr)_92px_minmax(0,1fr)] items-center gap-[14px] border-b border-pan2 py-[9px] mobile:grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] mobile:gap-2',
  homeCell: 'flex min-w-0 items-center justify-end gap-[9px]',
  awayCell: 'flex min-w-0 items-center gap-[9px]',
  name: 'min-w-0 truncate text-[13.5px] font-bold tracking-[-.01em] text-tx mobile:text-[12px]',
  meta: 'flex-none text-[10.5px] tracking-[.08em] text-tx4',
  minute: 'text-center text-[12.5px] font-semibold tracking-[.04em] text-tx nums',
} as const
