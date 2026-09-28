import { boardAreaStyles } from '../board-area/board-area.styles'
import { officialsStripStyles } from '../officials-strip/officials-strip.styles'

export const liveSkeletonStyles = {
  screen: 'flex min-h-0 flex-1 flex-col overflow-hidden bg-bg',
  scoreboard: 'flex flex-none items-center justify-center gap-[14px] border-b border-bd bg-pan px-5 py-3',
  categoryTag: 'h-[21px] w-[58px] rounded-card border border-bd bg-pan2',
  scoreGroup: 'flex -skew-x-12 items-stretch',
  teamBlock: 'h-[44px] w-[62px]',
  scoreCenter: 'h-[44px] w-[210px] rounded-card border border-bd bg-pan2',
  officialsStrip: officialsStripStyles.strip,
  officialsItem: 'flex h-[18px] items-center',
  officialsItemWidth: {
    referee: 'w-[132px]',
    firstAssistant: 'w-[125px]',
    secondAssistant: 'w-[146px]',
    fourthOfficial: 'w-[128px]',
    round: 'w-[140px]',
    duration: 'w-[126px]',
  },
  officialsItemBar: 'h-[11px] w-full',
  faintBar: 'bg-pan2',
  eventsStrip: 'flex flex-none items-center gap-[10px] overflow-hidden border-b border-bd bg-bg px-[14px] py-2',
  eventsLabel: 'h-3 w-[68px] flex-none',
  eventChip: 'h-[30px] w-[150px] flex-none bg-pan2',
  expandButton: 'ml-auto h-[30px] w-[104px] flex-none rounded-card border border-bd bg-pan2',
  board: boardAreaStyles.board,
} as const
