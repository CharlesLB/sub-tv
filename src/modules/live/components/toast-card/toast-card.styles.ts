import { TOAST_TONE } from '../../state/live-state'

export const toastCardStyles = {
  card: 'pointer-events-auto relative box-border flex w-[min(370px,calc(100vw-40px))] animate-toast-in items-start gap-[11px] rounded-[2px] border border-pan3 bg-pan2 py-[13px] pr-[13px] pl-[18px]',
  stripe: 'absolute top-0 bottom-0 left-0 w-[3px]',
  toneStripe: {
    [TOAST_TONE.OK]: 'bg-ac',
    [TOAST_TONE.WARN]: 'bg-am',
    [TOAST_TONE.INFO]: 'bg-az',
  },
  icon: 'mt-px',
  toneIcon: {
    [TOAST_TONE.OK]: 'text-ac',
    [TOAST_TONE.WARN]: 'text-am',
    [TOAST_TONE.INFO]: 'text-az',
  },
  texts: 'flex min-w-0 flex-1 flex-col gap-[2px]',
  title: 'text-[12.2px] font-bold tracking-[-.01em] text-pretty text-tx',
  description: 'text-[12.5px] leading-[1.35] text-pretty text-tx3',
  undoButton:
    'h-7 flex-none self-center rounded-card border border-bd2 bg-transparent px-[11px] text-[9.9px] font-bold tracking-[-.01em] text-tx2 transition-colors duration-150 hover:bg-bd hover:text-tx',
  closeButton: 'flex size-[22px] flex-none items-center justify-center border-0 bg-transparent p-0 text-tx5 transition-colors duration-150 hover:text-tx',
} as const
