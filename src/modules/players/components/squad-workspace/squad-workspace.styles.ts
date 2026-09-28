export const squadWorkspaceStyles = {
  roster: '@container flex max-h-full min-h-[300px] min-w-0 flex-[4_1_300px] flex-col bg-pan2 mobile:min-h-0 mobile:flex-1',
  sheetPanel: 'max-h-full min-h-[260px] max-w-[420px] min-w-0 flex-[2_1_280px] self-stretch overflow-y-auto bg-pan',
  sheetPanelMobile: 'mobile:absolute mobile:inset-x-0 mobile:bottom-0 mobile:z-40 mobile:max-h-[76%] mobile:min-h-0 mobile:max-w-none mobile:animate-fade-up mobile:border-t mobile:border-bd2',
  sheetPanelHiddenOnMobile: 'mobile:hidden',
  emptySheet: 'flex flex-col gap-2 px-5 py-[18px]',
  emptySheetTitle: 'text-[14.4px] font-bold tracking-[-.01em]',
  emptySheetMessage: 'text-[12.5px] leading-[1.5] text-tx4',
} as const
