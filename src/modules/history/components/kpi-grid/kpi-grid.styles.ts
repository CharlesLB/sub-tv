const GRID_COLUMNS = {
  overview: 'grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))]',
  detail: 'grid-cols-[repeat(auto-fit,minmax(min(100%,160px),1fr))]',
  highlight: 'grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))]',
} as const

export const kpiGridStyles = {
  grid: 'grid gap-[10px]',
  gridVariant: { overview: GRID_COLUMNS.overview, detail: GRID_COLUMNS.detail },
  columns: GRID_COLUMNS,
} as const
