export const kpiGridStyles = {
  grid: 'grid gap-[10px]',
  gridVariant: {
    overview: 'grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))]',
    detail: 'grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))]',
  },
} as const
