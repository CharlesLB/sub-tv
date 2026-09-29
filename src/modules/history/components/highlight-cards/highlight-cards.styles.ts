import { kpiGridStyles } from '../kpi-grid/kpi-grid.styles'

export const highlightCardsStyles = {
  grid: `mt-[22px] ${kpiGridStyles.grid} ${kpiGridStyles.columns.highlight}`,
  card: 'flex min-w-0 animate-fade-up flex-col items-start gap-[6px] rounded-card border border-bd bg-pan px-4 py-[14px] text-left transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-bd3',
  label: 'text-[9.5px] tracking-[.05em] text-tx5',
  value: 'text-[27.9px] leading-none font-bold text-tx nums',
  identity: 'flex max-w-full min-w-0 items-center gap-[6px]',
  name: 'min-w-0 truncate text-[12.2px] font-bold tracking-[-.01em] text-tx2',
} as const
