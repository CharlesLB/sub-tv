import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { cache } from 'react'
import { readSessionToken, SESSION_COOKIE } from '@/lib/auth/session-token/session-token'
import { env } from '@/lib/env'
import { routes } from '@/lib/routes'
import { type AppUser, userService } from './user-service'

const nowInSeconds = (): number => Math.floor(Date.now() / 1000)

export const getCurrentUser = cache(async (): Promise<AppUser | null> => {
  const cookieStore = await cookies()
  await connection()
  const session = await readSessionToken(cookieStore.get(SESSION_COOKIE)?.value, env.SESSION_SECRET, nowInSeconds())

  return session ? userService.findActiveById(session.userId) : null
})

export const requireUser = async (): Promise<AppUser> => {
  const user = await getCurrentUser()
  if (!user) redirect(routes.login())

  return user
}
