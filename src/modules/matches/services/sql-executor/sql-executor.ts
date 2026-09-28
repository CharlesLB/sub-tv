import type { SQL } from 'drizzle-orm'

export type SqlExecutor = { execute: (query: SQL) => Promise<unknown> }
