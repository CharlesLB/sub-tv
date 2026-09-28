import { ROSTER_GRID_CLASS } from '../roster-grid/roster-grid'

export const rosterRowStyles = {
  grid: ROSTER_GRID_CLASS,
  row: 'h-11 animate-rise-in items-center border-b border-bd text-tx transition-[background] duration-[140ms] hover:bg-pan',
  rowSelected: 'bg-pan',
  rowIdle: 'bg-transparent',
  shirtNumber: 'text-[13.5px] font-bold nums',
  name: 'min-w-0 truncate text-[14px] whitespace-nowrap',
  position: 'truncate text-[11px] font-semibold tracking-[.12em] whitespace-nowrap text-tx2 uppercase @max-[430px]:text-[10.5px] @max-[430px]:tracking-[.08em] @max-[430px]:normal-case',
  positionFull: '@max-[430px]:hidden',
  positionCompact: 'hidden @max-[430px]:inline',
  stat: 'text-[12.5px] text-tx4 nums @max-[430px]:text-[11.5px]',
  curiosityCount: 'text-right',
  curiosityCountFilled: 'text-ac',
  curiosityCountEmpty: 'text-bd3',
} as const
