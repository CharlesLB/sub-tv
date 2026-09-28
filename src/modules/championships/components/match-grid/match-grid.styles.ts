export const matchGridStyles = {
  section: 'animate-fade-up',
  header: 'mb-[14px] flex flex-wrap items-center gap-3',
  title: 'text-[13.5px] font-bold tracking-[-.01em]',
  emptyState: 'rounded-card border border-bd bg-pan px-4 py-6 text-center text-[12.5px] text-tx4',
  groups: 'flex flex-col gap-6',
  group: 'flex flex-col gap-[10px]',
  groupTitle: 'text-[11px] tracking-[.1em] text-tx4 uppercase',
  cards: 'grid grid-cols-[repeat(auto-fill,minmax(min(100%,344px),1fr))] gap-[14px]',
} as const
