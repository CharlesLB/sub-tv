export const resetPasswordFormStyles = {
  container: 'flex flex-col items-end gap-1',
  fields: 'flex flex-wrap items-center justify-end gap-[6px]',
  field: 'h-8 w-[150px] min-w-0 rounded-card border border-bd2 bg-bg px-[9px] text-[12px] text-tx mobile:w-full',
  secondaryButton: 'flex h-8 flex-none items-center rounded-card border border-bd2 px-[10px] text-[10.8px] font-bold tracking-[-.01em] text-tx3 hover:border-tx hover:text-tx',
  submitButton: 'h-8 flex-none rounded-card bg-ac px-3 text-[10.8px] font-bold tracking-[-.01em] text-bg disabled:bg-bd2',
  passwordError: 'text-[10.5px] text-vm',
} as const
