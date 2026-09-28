'use client'

import { SIDE } from '@/modules/matches/client'
import type { BoardInteractions } from '../../interaction/use-board-interactions'
import { BenchColumn } from '../bench-column/bench-column'
import { Pitch } from '../pitch/pitch'

type BoardAreaProps = { interactions: BoardInteractions; isCompact: boolean }

export function BoardArea({ interactions, isCompact }: BoardAreaProps) {
  return (
    <div className="grid min-h-[150px] flex-[1_1_0] grid-cols-[120px_minmax(0,1fr)_120px] grid-rows-[minmax(0,1fr)] items-stretch gap-px overflow-hidden bg-bg compact:grid-cols-[64px_minmax(0,1fr)_64px] mobile:grid-cols-[66px_minmax(0,1fr)_66px]">
      <BenchColumn side={SIDE.HOME} interactions={interactions} />
      <Pitch interactions={interactions} isCompact={isCompact} />
      <BenchColumn side={SIDE.AWAY} interactions={interactions} />
    </div>
  )
}
