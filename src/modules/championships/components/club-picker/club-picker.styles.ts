export const clubPickerStyles = {
  emptyMessage: 'text-[12.5px] text-tx4',
  grid: 'grid max-h-[248px] grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 overflow-y-auto pr-1',
  option:
    'flex min-w-0 cursor-pointer items-center gap-[10px] rounded-card border px-[14px] py-3 text-tx transition-[border-color,background] duration-[140ms] has-focus-visible:outline-2 has-focus-visible:outline-tx',
  optionSelected: 'bg-pan',
  optionIdle: 'border-bd2 bg-transparent hover:border-bd3',
  checkbox: 'sr-only',
  clubName: 'truncate text-[11.7px] font-bold tracking-[-.01em] whitespace-nowrap',
} as const
