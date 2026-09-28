export const contextBarStyles = {
  bar: 'flex min-h-[60px] flex-none items-center gap-[14px] border-b border-bd bg-pan px-4 chrome-dark-only text-tx narrow:gap-[10px] mobile:min-h-[54px] mobile:gap-2 mobile:px-[10px]',
  heading: 'flex min-w-0 flex-col gap-[3px]',
  title: 'max-w-[46vw] truncate text-[19px] font-bold tracking-[-.01em] whitespace-nowrap narrow:max-w-[38vw] narrow:text-[16px] mobile:max-w-[44vw] mobile:text-[15px]',
  categoryTag: 'mobile:hidden',
  detail: 'truncate text-[11px] whitespace-nowrap text-tx4 mobile:hidden',
  actions: 'ml-auto flex flex-none items-center gap-[9px]',
} as const
