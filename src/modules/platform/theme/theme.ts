export const THEME = { LIGHT: 'claro', DARK: 'escuro' } as const

export type Theme = (typeof THEME)[keyof typeof THEME]

export const THEME_ATTRIBUTE = 'data-tema'

export const THEME_STORAGE_KEY = 'subtv-tema'
