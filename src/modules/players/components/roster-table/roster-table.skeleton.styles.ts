export const rosterTableSkeletonStyles = {
  textBar: 'inline-block h-[0.8em] max-w-full align-middle',
  rowsWithoutScroll: 'overflow-y-hidden',
  columnLabelWidths: {
    number: 'w-[14px]',
    name: 'w-[34px]',
    position: 'w-[52px]',
    games: 'w-[8px]',
    goals: 'w-[8px]',
    curiosities: 'w-[42px] @max-[430px]:w-[22px]',
  },
  cellWidths: {
    number: 'w-[16px]',
    name: 'w-[150px]',
    position: 'w-[58px] @max-[430px]:w-[28px]',
    games: 'w-[12px]',
    goals: 'w-[8px]',
    curiosities: 'w-[8px]',
  },
  nameWidths: ['w-[168px]', 'w-[132px]', 'w-[184px]', 'w-[146px]', 'w-[158px]', 'w-[120px]', 'w-[176px]', 'w-[140px]', 'w-[162px]', 'w-[128px]', 'w-[170px]', 'w-[150px]'],
} as const
