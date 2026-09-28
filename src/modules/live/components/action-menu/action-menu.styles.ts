export const actionMenuStyles = {
  scrim: 'fixed inset-0 z-[75] bg-scrim-leve',
  menu: 'fixed z-[78] flex max-h-[calc(100vh-16px)] w-[242px] -translate-x-1/2 animate-fade-in flex-col gap-[3px] overflow-y-auto border border-bd2 bg-pan2 px-[10px] py-3 [clip-path:polygon(0_0,calc(100%_-_12px)_0,100%_12px,100%_100%,12px_100%,0_calc(100%_-_12px))]',
  header: 'flex items-center gap-[10px] border-b border-bd px-1 pb-[9px]',
  shirtNumber: 'text-[23.4px] leading-[.9] font-bold nums',
  identity: 'min-w-0',
  name: 'truncate text-[13.5px] font-bold tracking-[-.01em] whitespace-nowrap text-tx',
  subtitle: 'truncate text-[8.6px] font-semibold tracking-[-.01em] whitespace-nowrap text-tx4',
  actions: 'flex flex-col gap-[3px]',
  goalMarker: 'bg-ac',
  assistMarker: 'bg-az',
  yellowCardMarker: 'bg-am',
  redCardMarker: 'bg-vm',
} as const
