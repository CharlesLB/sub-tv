import { cn } from '@/lib/utils/cn'
import type { LivePlayerVM } from '@/modules/matches/client'

type DragGhostProps = { player: LivePlayerVM; teamColor: string; clientX: number; clientY: number; hasTarget: boolean }

export function DragGhost({ player, teamColor, clientX, clientY, hasTarget }: DragGhostProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed z-[90] flex -translate-x-1/2 -translate-y-[130%] items-center gap-2 rounded-card border bg-pan2 px-3 py-2',
        hasTarget ? 'border-az' : 'border-bd2',
      )}
      style={{ left: clientX, top: clientY }}
    >
      <span className="text-[13.5px] font-bold nums" style={{ color: teamColor }}>
        {player.shirtNumber}
      </span>
      <span className="text-[11.7px] font-bold tracking-[-.01em] whitespace-nowrap text-tx">{player.name}</span>
    </div>
  )
}
