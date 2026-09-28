export const curiosityListStyles = {
  heading: 'mb-2 text-[10.3px] font-semibold tracking-[-.01em] text-tx4',
  list: 'flex flex-col gap-2',
  item: 'flex animate-fade-in items-start gap-[10px]',
  marker: 'mt-[7px] size-[6px] flex-none rotate-45 bg-ac',
  text: 'min-w-0 flex-1 text-[14px] leading-[1.55]',
  textPending: 'min-w-0 flex-1 text-[14px] leading-[1.55] text-tx3',
  removeButton: 'p-0 text-[14px] leading-[1.4] text-tx4 hover:text-vm',
  emptyMessage: 'text-[12.5px] text-tx4',
  addForm: 'mt-[10px] flex gap-2',
  textInput: 'h-10 min-w-0 flex-1 rounded-card border border-bd2 bg-bg px-3 text-[12.5px] text-tx outline-none placeholder:text-tx4 focus-visible:border-tx3',
  addButton: 'h-10 rounded-card border border-ac px-[14px] text-[10.8px] font-bold tracking-[-.01em] text-ac transition-colors hover:bg-pan2',
  error: 'mt-[6px] text-[11.5px] text-vm',
} as const
