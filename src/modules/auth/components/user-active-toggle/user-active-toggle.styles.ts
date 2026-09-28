export const userActiveToggleStyles = {
  form: 'flex flex-col items-end gap-1',
  toggleButton: 'flex h-8 w-[92px] flex-none items-center justify-center rounded-card border px-[10px] text-[10.8px] font-bold tracking-[-.01em] disabled:cursor-not-allowed disabled:opacity-45',
  deactivateButton: 'border-vm/50 text-vm hover:border-vm',
  activateButton: 'border-ac2/60 text-ac2 hover:border-ac2',
} as const
