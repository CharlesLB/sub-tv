'use client'

import { createPortal } from 'react-dom'

type DragGhostProps = { shirtNumber: number; name: string; color: string; left: number; top: number }

export function DragGhost({ shirtNumber, name, color, left, top }: DragGhostProps) {
  return createPortal(
    <div aria-hidden className="pointer-events-none fixed z-[90] flex -translate-x-1/2 -translate-y-[130%] items-center gap-2 rounded-card border border-bd2 bg-pan2 px-3 py-2" style={{ left, top }}>
      <span className="text-[13.5px] font-bold nums" style={{ color }}>
        {shirtNumber}
      </span>
      <span className="text-[11.7px] font-bold tracking-[-.01em] whitespace-nowrap text-tx">{name}</span>
    </div>,
    document.body,
  )
}
