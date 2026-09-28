export const seasonBarChartStyles = {
  chart: 'm-0 flex flex-col gap-[11px] rounded-card border border-bd bg-pan px-4 py-[15px]',
  title: 'text-[13.5px] font-bold tracking-[-.01em] text-tx2',
  bars: 'flex items-end gap-[6px]',
  column: 'flex max-w-[78px] min-w-0 flex-1 flex-col items-center gap-[5px]',
  value: 'text-[9.5px] text-tx4 nums',
  track: 'flex w-full flex-none items-end',
  bar: 'block w-full flex-none opacity-72 transition-[height] duration-300 ease-out-soft',
  year: 'text-[9.5px] text-tx5 nums',
} as const
