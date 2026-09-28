import { ROSTER_GRID_CLASS } from '../roster-grid/roster-grid'

export const rosterTableStyles = {
  grid: ROSTER_GRID_CLASS,
  header: 'border-b border-bd py-2',
  columnLabel: 'text-[10.5px] font-semibold tracking-[.14em] whitespace-nowrap text-tx4 @max-[430px]:text-[9.5px] @max-[430px]:tracking-[.1em]',
  lastColumnLabel: 'overflow-visible text-right',
  columnLabelAligned: 'truncate text-left',
  fullLabel: '@max-[430px]:hidden',
  compactLabel: 'hidden @max-[430px]:inline',
  rows: 'min-h-0 flex-1 overflow-x-hidden overflow-y-auto',
  emptyMessage: 'px-4 py-6 text-[12.5px] text-tx4',
} as const
