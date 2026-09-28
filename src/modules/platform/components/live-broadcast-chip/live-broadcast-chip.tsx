import { connection } from 'next/server'
import { closeBroadcast, getActiveBroadcast } from '@/modules/matches'
import { LiveChip } from '../live-chip/live-chip'

export async function LiveBroadcastChip() {
  await connection()
  const broadcast = await getActiveBroadcast()
  if (!broadcast) return null

  return <LiveChip matchId={broadcast.matchId} matchup={`${broadcast.homeName} × ${broadcast.awayName}`} closeBroadcast={closeBroadcast.bind(null, broadcast.matchId)} />
}
