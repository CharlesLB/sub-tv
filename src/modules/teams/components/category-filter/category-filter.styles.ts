export const categoryFilterStyles = {
  nav: 'flex flex-wrap gap-[6px] px-4 pb-3 mobile:no-scrollbar mobile:flex-nowrap mobile:overflow-x-auto mobile:px-3 mobile:pb-[9px]',
  option: 'inline-flex h-[30px] flex-none items-center rounded-card border px-[11px] text-[9.9px] font-bold tracking-[-.01em] transition-[background,border-color,color] duration-[140ms]',
  optionActive: 'border-transparent text-bg',
  optionIdle: 'border-bd2 text-tx2 hover:border-bd3 hover:text-tx',
  allCategoriesActive: 'bg-tx',
} as const
