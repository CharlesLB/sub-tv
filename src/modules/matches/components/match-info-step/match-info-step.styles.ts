export const matchInfoStepStyles = {
  step: 'flex max-w-[820px] animate-fade-up flex-col gap-4',
  fields: 'grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-4 bg-pan2 p-5 chamfer mobile:p-4',
  fieldWide: 'col-span-full',
  label: 'mb-[6px] block text-[10.3px] font-semibold tracking-[-.01em] text-tx4',
  input: 'box-border h-[42px] w-full rounded-card border border-bd2 bg-bg px-3 text-[13px] text-tx transition-colors focus:border-tx',
} as const
