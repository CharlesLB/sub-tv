export const wizardFooterStyles = {
  footer: 'flex flex-none flex-wrap items-center gap-[14px] border-t border-bd bg-pan px-5 py-3 mobile:gap-[10px] mobile:px-3',
  summaryToggle: 'flex h-[34px] flex-none items-center gap-[7px] rounded-card border px-[13px] text-[10.8px] font-bold tracking-[-.01em] transition-colors',
  summaryToggleOpen: 'border-ac bg-pan2 text-ac',
  summaryToggleClosed: 'border-bd2 bg-transparent text-tx2',
  summaryToggleIcon: 'transition-transform duration-[180ms]',
  summaryToggleIconOpen: 'rotate-180',
  hint: 'min-w-[150px] flex-1 text-[10.3px] font-semibold tracking-[-.01em] text-pretty text-tx4 mobile:order-first mobile:basis-full',
  backButton: 'h-11 rounded-card border border-bd2 bg-transparent px-[18px] text-[11.7px] font-bold tracking-[-.01em] text-tx2 transition-colors hover:border-tx hover:text-tx',
  submitButton:
    'inline-flex h-12 items-center justify-center gap-[10px] bg-ac px-6 text-[13.5px] font-bold tracking-[-.01em] whitespace-nowrap text-bg disabled:cursor-not-allowed disabled:opacity-70 mobile:flex-1 mobile:px-4',
  nextButton: 'h-12 px-[26px] text-[13.5px] font-bold tracking-[-.01em] mobile:flex-1',
  nextButtonReady: 'cursor-pointer bg-ac text-bg',
  nextButtonBlocked: 'cursor-not-allowed bg-bd2 text-tx4',
} as const
