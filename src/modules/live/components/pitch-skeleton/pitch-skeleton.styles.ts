import { pitchStyles } from '../pitch/pitch.styles'

export const pitchSkeletonStyles = {
  frame: pitchStyles.frame,
  field: `${pitchStyles.field} animate-[skeleton_2.2s_ease-in-out_infinite]`,
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
