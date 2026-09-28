export const pitchSkeletonStyles = {
  frame: '[container-type:size] col-start-2 row-start-1 flex min-h-0 min-w-0 flex-col items-center justify-start overflow-hidden bg-pan p-4 chamfer',
  field: 'relative aspect-[105/64] w-[min(100%,164cqh)] flex-[0_0_auto] animate-[skeleton_2.2s_ease-in-out_infinite] rounded-card border border-gr-borda turf',
  halfwayLine: 'absolute top-0 bottom-0 left-1/2 w-px bg-gr-linha',
  centerCircle: 'absolute top-1/2 left-1/2 aspect-square w-[17%] -translate-1/2 rounded-full border border-gr-linha',
  leftPenaltyArea: 'absolute top-[21%] left-0 h-[58%] w-[15%] rounded-card border border-l-0 border-gr-linha',
  rightPenaltyArea: 'absolute top-[21%] right-0 h-[58%] w-[15%] rounded-card border border-r-0 border-gr-linha',
  lineColumn: 'absolute top-0 bottom-0 flex flex-col',
  lineColumnPlacement: {
    homeKeeper: 'left-[8%] w-[8%] justify-center',
    homeDefense: 'left-[24%] w-[10%] justify-evenly items-center',
    homeAttack: 'left-[40%] w-[10%] justify-evenly items-center',
    awayAttack: 'right-[40%] w-[10%] justify-evenly items-center',
    awayDefense: 'right-[24%] w-[10%] justify-evenly items-center',
    awayKeeper: 'right-[8%] w-[8%] justify-center items-end',
  },
  dot: 'size-[26px] rounded-full',
  faintDot: 'bg-pan2',
} as const
