import { STANDINGS_GRID_CLASS } from './standings-grid'

export const standingsTableStyles = {
  table: 'overflow-hidden rounded-card border border-bd bg-pan',
  groupName: 'border-b border-bd px-[14px] py-2 text-[11.3px] font-bold tracking-[-.01em] text-tx2',
  grid: STANDINGS_GRID_CLASS,
  headerRow: 'border-b border-bd bg-pan2 py-[9px] compact:py-2',
  headerCell: 'text-[10px] font-semibold tracking-[.14em] whitespace-nowrap text-tx4 compact:text-[9px] compact:tracking-[.1em]',
  headerAlignStart: 'text-left',
  headerAlignCenter: 'text-center',
  headerAlignCenterWideOnly: 'text-center compact:hidden',
  headerAlignEndWideOnly: 'text-right compact:hidden',
} as const
