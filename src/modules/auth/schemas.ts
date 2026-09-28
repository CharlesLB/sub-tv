import { z } from 'zod'

const SAFE_INTERNAL_PATH = /^\/(?!\/)[^\s\\]*$/
const DEFAULT_DESTINATION = '/campeonatos'

export const SignInInput = z.object({
  username: z.string().trim().min(1, 'Digite o usuário.').max(120),
  password: z.string().min(1, 'Digite a senha.').max(200),
  returnTo: z
    .string()
    .optional()
    .transform((path) => (path && SAFE_INTERNAL_PATH.test(path) ? path : DEFAULT_DESTINATION)),
})

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 200
const USERNAME_MIN_LENGTH = 2
const USERNAME_MAX_LENGTH = 120
const PASSWORD_MISMATCH = 'As senhas não conferem.'
const CONFIRMATION_FIELD = 'confirmation'
const ACTIVE_VALUE = 'true'
const INACTIVE_VALUE = 'false'

const NewPassword = z.string().min(PASSWORD_MIN_LENGTH, `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`).max(PASSWORD_MAX_LENGTH)

const passwordsMatch = (input: { password: string; confirmation: string }): boolean => input.password === input.confirmation

export const CreateUserInput = z
  .object({
    username: z
      .string()
      .trim()
      .transform((username) => username.replace(/\s+/g, ' '))
      .pipe(z.string().min(USERNAME_MIN_LENGTH, 'Digite o nome do usuário.').max(USERNAME_MAX_LENGTH)),
    password: NewPassword,
    confirmation: z.string(),
  })
  .refine(passwordsMatch, { message: PASSWORD_MISMATCH, path: [CONFIRMATION_FIELD] })

export const ResetPasswordInput = z
  .object({ userId: z.uuid(), password: NewPassword, confirmation: z.string() })
  .refine(passwordsMatch, { message: PASSWORD_MISMATCH, path: [CONFIRMATION_FIELD] })

export const SetUserActiveInput = z.object({
  userId: z.uuid(),
  isActive: z.enum([ACTIVE_VALUE, INACTIVE_VALUE]).transform((value) => value === ACTIVE_VALUE),
})
