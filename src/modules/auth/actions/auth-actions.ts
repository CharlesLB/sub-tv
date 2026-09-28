'use server'

import type { Route } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { type ActionResult, fail } from '@/lib/actions/result'
import { createSessionToken, SESSION_COOKIE, SESSION_DURATION_SECONDS } from '@/lib/auth/session-token/session-token'
import { env } from '@/lib/env'
import { routes } from '@/lib/routes'
import { AUDIT_ACTION, AUDIT_ENTITY, recordAudit } from '@/modules/audit'
import { SignInInput } from '../schemas'
import { getCurrentUser } from '../services/current-user'
import { userService } from '../services/user-service'

const FAILED_ATTEMPT_DELAY_MS = 700

const isInternalRoute = (path: string): path is Route => path.startsWith('/') && !path.startsWith('//')

const wait = (milliseconds: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, milliseconds))

export async function signIn(_previous: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = SignInInput.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
    returnTo: formData.get('returnTo') ?? undefined,
  })

  if (!parsed.success) return fail('Preencha usuário e senha.', z.flattenError(parsed.error).fieldErrors)

  const user = await userService.authenticate(parsed.data.username, parsed.data.password)

  if (!user) {
    await wait(FAILED_ATTEMPT_DELAY_MS)

    return fail('Usuário ou senha incorretos.')
  }

  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, await createSessionToken(user.id, env.SESSION_SECRET, Math.floor(Date.now() / 1000)), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  })

  await recordAudit({ userId: user.id, action: AUDIT_ACTION.SIGN_IN, entityType: AUDIT_ENTITY.USER, entityId: user.id })
  redirect(isInternalRoute(parsed.data.returnTo) ? parsed.data.returnTo : routes.championships())
}

export async function signOut(): Promise<void> {
  const user = await getCurrentUser()
  if (user) await recordAudit({ userId: user.id, action: AUDIT_ACTION.SIGN_OUT, entityType: AUDIT_ENTITY.USER, entityId: user.id })

  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect(routes.login())
}
