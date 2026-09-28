export const kpiCardStyles = {
  card: 'flex min-w-0 animate-fade-up flex-col gap-[5px] rounded-card border border-bd bg-pan',
  cardVariant: { overview: 'px-4 py-[14px]', detail: 'px-[15px] py-[13px]' },
  value: 'leading-none font-bold text-tx nums',
  valueVariant: { overview: 'text-[30.6px] tracking-[-.01em]', detail: 'text-[25.2px]' },
  label: 'text-[10px] tracking-[.05em] text-tx4',
} as const
