import { cn } from '@/lib/utils/cn'
import type { LivePlayerVM } from '@/modules/matches/client'
import { dragGhostStyles as styles } from './drag-ghost.styles'

type DragGhostProps = { player: LivePlayerVM; teamColor: string; clientX: number; clientY: number; hasTarget: boolean }

export function DragGhost({ player, teamColor, clientX, clientY, hasTarget }: DragGhostProps) {
  return (
    <div aria-hidden className={cn(styles.ghost, hasTarget ? styles.ghostOverTarget : styles.ghostWithoutTarget)} style={{ left: clientX, top: clientY }}>
      <span className={styles.shirtNumber} style={{ color: teamColor }}>
        {player.shirtNumber}
      </span>
      <span className={styles.name}>{player.name}</span>
    </div>
  )
}
