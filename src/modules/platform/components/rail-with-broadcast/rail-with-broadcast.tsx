import { connection } from 'next/server'
import { getActiveBroadcast } from '@/modules/matches'
import { PlatformRail } from '../platform-rail/platform-rail'

export async function RailWithBroadcast() {
  await connection()
  const broadcast = await getActiveBroadcast()

  return <PlatformRail liveMatchId={broadcast?.matchId ?? null} />
}
