import { MARK_TONE } from './marks-of'

export const playerMarksStyles = {
  mark: 'pointer-events-none absolute flex flex-none items-center justify-center overflow-hidden border-[1.5px] p-0',
  cardMark: 'rounded-[2px]',
  badgeMark: 'rounded-full',
  tone: {
    [MARK_TONE.GOAL]: 'bg-tx text-bg',
    [MARK_TONE.ASSIST]: 'bg-ac text-bg',
    [MARK_TONE.YELLOW]: 'bg-am text-bg',
    [MARK_TONE.RED]: 'bg-vm',
    [MARK_TONE.SECOND_YELLOW]: 'bg-am',
    [MARK_TONE.SUBBED_OUT]: 'bg-vm text-tx',
    [MARK_TONE.SUBBED_IN]: 'bg-ac text-bg',
  },
  pitchBorder: 'border-bg',
  pitchIcon: 'size-[clamp(6px,1.5cqw,11px)]',
  pitchCount: 'text-[clamp(6px,1.4cqw,10px)]',
  benchBorder: 'border-pan',
  benchIcon: 'size-[9px]',
  benchCount: 'text-[9px]',
  secondYellowHalf: 'absolute inset-0 bg-vm [clip-path:polygon(100%_0,100%_100%,0_100%)]',
  count: 'relative leading-none font-bold',
} as const
