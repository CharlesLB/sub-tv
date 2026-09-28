export const teamListStyles = {
  list: 'max-h-full min-h-[260px] max-w-[250px] min-w-[190px] flex-[1_1_210px] overflow-y-auto bg-pan py-[14px] mobile:min-h-0 mobile:max-w-none mobile:min-w-0 mobile:flex-none mobile:overflow-hidden mobile:pt-[9px] mobile:pb-0',
  columnLabel: 'px-4 pb-2 text-[10.3px] font-semibold tracking-[-.01em] text-tx4 mobile:hidden',
  columnLabelDivided: 'px-4 pb-2 text-[10.3px] font-semibold tracking-[-.01em] text-tx4 mobile:hidden border-t border-bd pt-3',
  teams: 'block mobile:no-scrollbar mobile:flex mobile:gap-[6px] mobile:overflow-x-auto mobile:overflow-y-hidden mobile:px-3 mobile:pb-[9px]',
  emptyMessage: 'px-4 py-3 text-[12px] text-tx4 mobile:px-0 mobile:py-1',
} as const
