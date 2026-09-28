export const auditFiltersStyles = {
  form: 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] items-end gap-[10px] rounded-card border border-bd bg-pan p-[14px]',
  label: 'flex min-w-0 flex-col gap-[5px] text-[9.5px] tracking-[.05em] text-tx5',
  field: 'h-[34px] w-full min-w-0 rounded-card border border-bd2 bg-pan px-[10px] text-[12px] text-tx',
  actions: 'flex items-center gap-2',
  submitButton: 'h-[34px] flex-1 rounded-card bg-ac px-4 text-[11.5px] font-bold tracking-[-.01em] text-bg',
  clearLink: 'flex h-[34px] flex-none items-center rounded-card border border-bd2 px-3 text-[11px] font-bold tracking-[-.01em] text-tx3 hover:border-tx3 hover:text-tx',
} as const
