export const eventsStripStyles = {
  strip: 'flex flex-none items-center gap-[10px] border-b border-bd bg-bg px-[14px] py-2',
  title: 'flex-none text-[11.3px] font-semibold tracking-[-.01em] text-tx4',
  viewport: 'no-scrollbar min-w-0 flex-1 overflow-x-auto scroll-smooth',
  content: 'flex w-max items-center gap-2',
  emptyMessage: 'text-[11.5px] whitespace-nowrap text-tx4',
  count: 'flex-none text-[11.5px] text-tx4 nums',
  toggle: 'flex h-[30px] flex-none items-center gap-[6px] rounded-card border px-[11px] text-[9.9px] font-bold tracking-[-.01em]',
  toggleExpanded: 'border-ac bg-pan2 text-ac',
  toggleCollapsed: 'border-bd bg-transparent text-tx3 hover:border-bd3 hover:text-tx',
  toggleIcon: 'transition-transform duration-200',
  toggleIconExpanded: 'rotate-180',
} as const
