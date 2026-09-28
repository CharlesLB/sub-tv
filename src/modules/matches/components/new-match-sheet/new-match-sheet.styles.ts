export const newMatchSheetStyles = {
  overlay: 'fixed inset-0 z-[70] animate-fade-in bg-scrim',
  sheet: 'fixed inset-x-0 bottom-0 z-[71] flex max-h-[92vh] animate-sheet-up flex-col border-t-2 border-ac bg-bg font-sans text-tx outline-none mobile:max-h-[96dvh]',
  handleArea: 'flex flex-none flex-col items-center bg-pan2 pt-2',
  handle: 'h-1 w-[52px] rounded-[2px] bg-bd2',
  header: 'flex flex-none flex-wrap items-center gap-[14px] border-b border-bd bg-pan2 px-5 pt-[10px] pb-3 mobile:gap-[10px] mobile:px-3',
  title: 'text-[15.3px] font-bold tracking-[-.01em]',
  closeButton: 'ml-auto flex size-[34px] flex-none items-center justify-center rounded-card border border-bd2 bg-transparent text-tx2 transition-colors hover:border-tx hover:text-tx',
  body: 'flex min-h-0 flex-1 flex-col overflow-hidden',
} as const
