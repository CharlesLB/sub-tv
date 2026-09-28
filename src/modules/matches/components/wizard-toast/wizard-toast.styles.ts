export const wizardToastStyles = {
  toast: 'fixed right-5 bottom-5 z-[74] flex w-[min(370px,calc(100vw-40px))] animate-toast-in items-start gap-[11px] border border-pan3 bg-pan2 py-[13px] pr-[13px] pl-[18px]',
  accent: 'absolute inset-y-0 left-0 w-[3px] bg-am',
  icon: 'mt-px text-am',
  content: 'flex min-w-0 flex-1 flex-col gap-[2px]',
  title: 'text-[12.2px] font-bold tracking-[-.01em] text-pretty text-tx',
  description: 'text-[12.5px] leading-[1.35] text-pretty text-tx3',
  closeButton: 'flex size-[22px] flex-none items-center justify-center bg-transparent p-0 text-tx5 transition-colors duration-[140ms] hover:text-tx',
} as const
