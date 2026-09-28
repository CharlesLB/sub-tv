export const standingsPanelStyles = {
  panel: 'flex min-w-0 flex-[1_1_560px] flex-col gap-[10px]',
  header: 'flex flex-wrap items-center gap-3',
  title: 'text-[13.5px] font-bold tracking-[-.01em]',
  roundsPlayed: 'text-[10.5px] text-tx4',
  hint: 'text-[12.5px] text-tx4',
  emptyState: 'rounded-card border border-bd bg-pan px-4 py-6 text-center text-[12.5px] text-tx4',
  phase: 'flex flex-col gap-2',
  phaseTitle: 'text-[11.3px] font-bold text-tx2',
  phaseTitleSpaced: 'mt-3 text-[11.3px] font-bold text-tx2',
  legend: 'flex flex-wrap gap-[18px] text-[12px] text-tx4',
  legendResults: 'flex items-center gap-[10px]',
  legendEntry: 'flex items-center gap-[5px]',
} as const
