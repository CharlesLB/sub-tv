import { connection } from 'next/server'
import { getCurrentUser } from '@/modules/auth'
import { FmfSyncForm } from '@/modules/fmf-sync/client'

export async function FmfSyncButton() {
  await connection()
  const user = await getCurrentUser()

  return user ? <FmfSyncForm /> : null
}
