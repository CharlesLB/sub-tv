export const playerSheetStyles = {
  sheet: 'flex flex-col gap-[14px] px-5 py-[18px]',
  closeButton: 'hidden h-[34px] items-center gap-[6px] self-end rounded-card border border-bd2 px-3 text-[10.5px] tracking-[.05em] text-tx3 mobile:flex',
  header: 'flex flex-wrap items-center gap-3',
  title: 'text-[14.4px] font-bold tracking-[-.01em]',
  categoryTag: 'text-[12.5px]',
  identityFields: 'grid grid-cols-[90px_minmax(0,1fr)] gap-3',
  label: 'mb-[6px] block text-[10.3px] font-semibold tracking-[-.01em] text-tx4',
  readOnlyInput: 'h-10 w-full cursor-not-allowed rounded-card border border-bd2 bg-bg px-3 text-[13px] text-tx2',
  shirtNumber: 'nums',
  siblingLink: 'mt-1 inline-flex h-[34px] items-center self-start rounded-card border px-3 text-[10.3px] font-bold tracking-[-.01em]',
  curiosityNote: 'text-[12.5px] leading-[1.5] text-pretty text-tx4',
} as const
