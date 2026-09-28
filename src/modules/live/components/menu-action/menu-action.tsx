import { cn } from '@/lib/utils/cn'

export const MENU_MARKER = { ROUND: 'round', CARD: 'card' } as const

type MenuActionProps = {
  label: string
  meta: string
  colorClass: string
  marker: (typeof MENU_MARKER)[keyof typeof MENU_MARKER]
  shortcut: string
  onSelect: () => void
}

export function MenuAction({ label, meta, colorClass, marker, shortcut, onSelect }: MenuActionProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      aria-keyshortcuts={shortcut}
      className="flex h-9 w-full items-center gap-[10px] border-0 bg-transparent px-2 text-left transition-colors duration-150 hover:bg-bd focus-visible:bg-bd"
    >
      <span className={cn('flex-none', marker === MENU_MARKER.CARD ? 'h-[15px] w-[11px] rounded-[2px]' : 'size-[10px] rounded-full', colorClass)} />
      <span className="text-[11.3px] font-bold tracking-[-.01em] text-tx">{label}</span>
      <span className="ml-auto text-[10.5px] text-tx5">{meta}</span>
    </button>
  )
}
