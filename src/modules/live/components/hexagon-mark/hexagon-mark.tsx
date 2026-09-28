import { cn } from '@/lib/utils/cn'
import { hexagonMarkStyles as styles } from './hexagon-mark.styles'

export const HEXAGON_MARK_SIZE = { LARGE: 'large', SMALL: 'small' } as const

type HexagonMarkSize = (typeof HEXAGON_MARK_SIZE)[keyof typeof HEXAGON_MARK_SIZE]

type HexagonMarkProps = { size: HexagonMarkSize }

export function HexagonMark({ size }: HexagonMarkProps) {
  return (
    <span aria-hidden className={cn(styles.outline, styles.size[size])}>
      <span className={styles.inner} />
    </span>
  )
}
