export const rowsSkeletonStyles = {
  section: 'flex min-w-0 flex-col gap-[10px]',
  title: 'h-[15px]',
  rows: 'flex flex-col overflow-hidden rounded-card border border-bd bg-pan',
  row: 'flex h-[41px] items-center gap-[10px] px-3',
  rowOdd: 'bg-pan0',
  rowEven: 'bg-pan',
  position: 'h-[10px] w-5 flex-none',
  colorSwatch: 'size-[9px] flex-none',
  name: 'h-3 w-[38%]',
  value: 'ml-auto h-3 w-[22%]',
} as const
