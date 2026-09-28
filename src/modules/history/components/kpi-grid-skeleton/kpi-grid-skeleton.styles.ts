import { kpiGridStyles } from '../kpi-grid/kpi-grid.styles'

export const kpiGridSkeletonStyles = {
  grid: kpiGridStyles.grid,
  gridVariant: kpiGridStyles.columns,
  card: 'flex flex-col gap-[7px] rounded-card border border-bd bg-pan',
  cardVariant: { overview: 'px-4 py-[14px]', detail: 'px-[15px] py-[13px]', highlight: 'px-4 py-[14px]' },
  value: 'w-[46%]',
  valueVariant: { overview: 'h-[31px]', detail: 'h-[25px]', highlight: 'h-7' },
  label: 'h-[10px] w-[62%]',
} as const
