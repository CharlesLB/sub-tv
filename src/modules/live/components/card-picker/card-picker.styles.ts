export const cardPickerStyles = {
  dialog: 'fixed inset-0 z-[60] flex animate-fade-in flex-col items-center justify-center gap-6 bg-scrim-forte',
  options: 'flex gap-5 mobile:gap-3',
  option: 'flex h-[150px] w-[230px] flex-col items-center justify-center gap-3 border-[3px] bg-pan text-tx chamfer mobile:h-[120px] mobile:w-[150px]',
  optionYellowBorder: 'border-am',
  optionRedBorder: 'border-vm',
  swatch: 'block h-10 w-[30px] rounded-[4px]',
  swatchYellow: 'bg-am',
  swatchRed: 'bg-vm',
  optionLabel: 'text-[21.6px] font-bold tracking-[-.01em]',
  cancel: 'rounded-card border border-bd2 bg-transparent px-6 py-[10px] text-[11.7px] font-semibold tracking-[-.01em] text-tx2 hover:border-tx hover:text-tx',
} as const
