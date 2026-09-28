import 'server-only'
import { z } from 'zod'

const MINIMUM_SECRET_LENGTH = 32

const Env = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DATABASE_URL: z.url(),
  SESSION_SECRET: z.string().min(MINIMUM_SECRET_LENGTH),
  CRON_SECRET: z.string().min(MINIMUM_SECRET_LENGTH).optional(),
})

export const env = Env.parse(process.env)
