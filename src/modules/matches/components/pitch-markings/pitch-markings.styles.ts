const LINE_CLASS = 'absolute border border-gr-linha'

export const pitchMarkingsStyles = {
  halfwayLine: 'absolute inset-y-0 left-1/2 w-px bg-gr-linha',
  centerCircle: `${LINE_CLASS} top-1/2 left-1/2 aspect-square w-[17%] -translate-1/2 rounded-full`,
  centerSpot: 'absolute top-1/2 left-1/2 size-1 -translate-1/2 rounded-full bg-gr-linha',
  leftPenaltyArea: `${LINE_CLASS} top-[21%] left-0 h-[58%] w-[15%] rounded-card border-l-0`,
  leftGoalArea: `${LINE_CLASS} top-[36%] left-0 h-[28%] w-[6%] rounded-card border-l-0`,
  rightPenaltyArea: `${LINE_CLASS} top-[21%] right-0 h-[58%] w-[15%] rounded-card border-r-0`,
  rightGoalArea: `${LINE_CLASS} top-[36%] right-0 h-[28%] w-[6%] rounded-card border-r-0`,
} as const
