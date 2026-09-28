import { cn } from '@/lib/utils/cn'
import { menuActionStyles as styles } from './menu-action.styles'

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
    <button type="button" role="menuitem" onClick={onSelect} aria-keyshortcuts={shortcut} className={styles.button}>
      <span className={cn(styles.marker, marker === MENU_MARKER.CARD ? styles.cardMarker : styles.roundMarker, colorClass)} />
      <span className={styles.label}>{label}</span>
      <span className={styles.meta}>{meta}</span>
    </button>
  )
}
