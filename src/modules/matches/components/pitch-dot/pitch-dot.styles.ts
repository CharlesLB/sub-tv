export const pitchDotStyles = {
  anchor: 'absolute flex w-[13%] -translate-1/2 flex-col items-center gap-[2px]',
  anchorDragging: 'z-[6]',
  anchorSwapTarget: 'z-[4]',
  anchorIdle: 'z-[2]',
  dot: 'relative flex aspect-square w-[46%] touch-none items-center justify-center rounded-full border-[3px] p-0 transition-[border-color,scale] duration-[140ms] hover:border-tx',
  dotDragging: 'cursor-grabbing opacity-85',
  dotIdle: 'cursor-grab',
  dotSwapTarget: 'scale-110 border-gr-tx',
  dotDefaultBorder: 'border-[var(--gr0)]',
  shirtNumber: 'text-[clamp(9px,2.1cqw,15px)] leading-none font-bold text-bg nums',
  label:
    'bg-gr-chip px-[5px] pt-px pb-[2px] text-[clamp(7px,2.1cqw,14px)] font-bold tracking-[-.01em] whitespace-nowrap text-gr-tx [text-shadow:0_1px_2px_rgba(0,0,0,.35)] [@container(max-height:190px)]:hidden',
} as const
