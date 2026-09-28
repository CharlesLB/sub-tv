'use client'

import { useSyncExternalStore } from 'react'
import { Icon } from '@/components/ui/icon/icon'
import { themeToggleStyles as styles } from './theme-toggle.styles'

const THEME_STORAGE_KEY = 'subtv-tema'
const THEME_ATTRIBUTE = 'data-tema'
const THEME = { LIGHT: 'claro', DARK: 'escuro' } as const

type Theme = (typeof THEME)[keyof typeof THEME]

const readTheme = (): Theme => (document.documentElement.getAttribute(THEME_ATTRIBUTE) === THEME.DARK ? THEME.DARK : THEME.LIGHT)

const subscribeToTheme = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: [THEME_ATTRIBUTE] })

  return () => observer.disconnect()
}

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)

  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    return
  }
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, () => THEME.LIGHT)
  const isDark = theme === THEME.DARK
  const title = isDark ? 'Mudar para o modo claro' : 'Mudar para o modo escuro'

  return (
    <button type="button" onClick={() => applyTheme(isDark ? THEME.LIGHT : THEME.DARK)} title={title} aria-label={title} className={styles.button}>
      <Icon name={isDark ? 'lightMode' : 'darkMode'} size={18} />
    </button>
  )
}
