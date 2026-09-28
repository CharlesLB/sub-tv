const USERNAME_LOCALE = 'pt-BR'

export const normalizeUsername = (username: string): string => username.trim().replace(/\s+/g, ' ').toLocaleLowerCase(USERNAME_LOCALE)
