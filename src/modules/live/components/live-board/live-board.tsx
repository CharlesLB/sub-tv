'use client'

import type { LiveMatchSnapshot } from '@/modules/matches/client'
import { LiveMatchProvider } from '../../state/live-context'
import { LiveScreen } from '../live-screen/live-screen'
import type { OfficialsStripItem } from '../officials-strip/officials-strip-items'

type LiveBoardProps = { snapshot: LiveMatchSnapshot; officialsItems: OfficialsStripItem[] }

export function LiveBoard({ snapshot, officialsItems }: LiveBoardProps) {
  return (
    <LiveMatchProvider snapshot={snapshot}>
      <LiveScreen officialsItems={officialsItems} />
    </LiveMatchProvider>
  )
}
