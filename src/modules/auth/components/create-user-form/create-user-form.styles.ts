export const createUserFormStyles = {
  form: 'flex flex-col gap-3 rounded-card border border-bd bg-pan p-[14px]',
  title: 'text-[13.5px] font-bold tracking-[-.01em] text-tx2',
  fields: 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] items-start gap-[10px]',
  fieldGroup: 'flex min-w-0 flex-col gap-[5px]',
  label: 'flex min-w-0 flex-col gap-[5px] text-[9.5px] tracking-[.05em] text-tx5',
  field: 'h-[36px] w-full min-w-0 rounded-card border border-bd2 bg-bg px-[10px] text-[12.5px] text-tx',
  fieldError: 'text-[10.5px] tracking-normal text-vm',
  submitButton: 'mt-[14px] h-[36px] rounded-card bg-ac px-4 text-[11.8px] font-bold tracking-[-.01em] text-bg disabled:bg-bd2 disabled:text-tx4',
} as const
