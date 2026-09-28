import 'server-only'
import bcrypt from 'bcryptjs'
import { and, count, eq, ne } from 'drizzle-orm'
import { type ActionResult, fail, ok } from '@/lib/actions/result'
import { db, tables } from '@/lib/db'
import { normalizeUsername } from '../normalize-username/normalize-username'

const BCRYPT_COST = 12

export type ManagedUser = { id: string; username: string }

const findUser = async (userId: string): Promise<ManagedUser | null> => {
  const { appUsers } = tables
  const [user] = await db.select({ id: appUsers.id, username: appUsers.username }).from(appUsers).where(eq(appUsers.id, userId)).limit(1)

  return user ?? null
}

const countOtherActiveUsers = async (userId: string): Promise<number> => {
  const { appUsers } = tables

  const [row] = await db
    .select({ activeCount: count() })
    .from(appUsers)
    .where(and(eq(appUsers.isActive, true), ne(appUsers.id, userId)))

  return row?.activeCount ?? 0
}

export const userAdminService = {
  create: async (input: { username: string; password: string }): Promise<ActionResult<ManagedUser>> => {
    const { appUsers } = tables
    const normalizedUsername = normalizeUsername(input.username)
    const [existing] = await db.select({ id: appUsers.id }).from(appUsers).where(eq(appUsers.normalizedUsername, normalizedUsername)).limit(1)
    if (existing) return fail('Já existe um usuário com esse nome.', { username: ['Escolha outro nome.'] })

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST)
    const [created] = await db.insert(appUsers).values({ username: input.username, normalizedUsername, passwordHash }).returning({ id: appUsers.id, username: appUsers.username })
    if (!created) return fail('Não foi possível criar o usuário.')

    return ok(created)
  },
  resetPassword: async (input: { userId: string; password: string }): Promise<ActionResult<ManagedUser>> => {
    const user = await findUser(input.userId)
    if (!user) return fail('Usuário não encontrado.')

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST)
    await db.update(tables.appUsers).set({ passwordHash }).where(eq(tables.appUsers.id, user.id))

    return ok(user)
  },
  setActive: async (input: { actorId: string; userId: string; isActive: boolean }): Promise<ActionResult<ManagedUser>> => {
    const user = await findUser(input.userId)
    if (!user) return fail('Usuário não encontrado.')
    if (!input.isActive && input.userId === input.actorId) return fail('Você não pode desativar o seu próprio usuário.')
    if (!input.isActive && (await countOtherActiveUsers(input.userId)) === 0) return fail('É preciso manter pelo menos um usuário ativo.')

    await db.update(tables.appUsers).set({ isActive: input.isActive }).where(eq(tables.appUsers.id, user.id))

    return ok(user)
  },
}
