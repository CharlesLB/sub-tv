export const liveEmptyStateStyles = {
  screen: 'flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-bg p-5',
  card: 'flex max-w-[440px] animate-fade-up flex-col items-center gap-3 rounded-card border border-bd bg-pan px-7 py-8 text-center',
  title: 'text-[15.3px] font-bold tracking-[-.01em] text-tx',
  description: 'text-[12.5px] leading-[1.45] text-pretty text-tx3',
  newMatchLink: 'mt-1 flex h-9 items-center gap-2 rounded-card bg-ac px-4 text-[11.7px] font-bold tracking-[-.01em] text-bg transition-transform hover:-translate-y-px',
} as const
