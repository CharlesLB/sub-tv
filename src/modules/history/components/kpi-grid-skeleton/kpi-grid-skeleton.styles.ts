export const kpiGridSkeletonStyles = {
  grid: 'grid gap-[10px]',
  gridVariant: {
    overview: 'grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))]',
    detail: 'grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))]',
    highlight: 'grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))]',
  },
  card: 'flex flex-col gap-[7px] rounded-card border border-bd bg-pan',
  cardVariant: { overview: 'px-4 py-[14px]', detail: 'px-[15px] py-[13px]', highlight: 'px-4 py-[14px]' },
  value: 'w-[46%]',
  valueVariant: { overview: 'h-[31px]', detail: 'h-[25px]', highlight: 'h-7' },
  label: 'h-[10px] w-[62%]',
} as const
