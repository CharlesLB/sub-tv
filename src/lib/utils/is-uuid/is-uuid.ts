import { z } from 'zod'

const Uuid = z.uuid()

export const isUuid = (value: string): boolean => Uuid.safeParse(value).success
