import type { Decorator, Preview } from '@storybook/nextjs-vite'
import { type ReactNode, useEffect } from 'react'
import { barlowCondensed, geist } from '../src/app/fonts'
import '../src/app/globals.css'

const THEME = { LIGHT: 'claro', DARK: 'escuro' } as const
const THEME_ATTRIBUTE = 'data-tema'
const COLOR_CONTRAST_RULE = 'color-contrast'

type Theme = (typeof THEME)[keyof typeof THEME]

const ThemeFrame = ({ theme, children }: { theme: Theme; children: ReactNode }) => {
  useEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme)
    document.documentElement.classList.add(geist.variable, barlowCondensed.variable)
  }, [theme])

  return children
}

const withTheme: Decorator = (Story, context) => (
  <ThemeFrame theme={context.globals['theme'] === THEME.DARK ? THEME.DARK : THEME.LIGHT}>
    <Story />
  </ThemeFrame>
)

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Tema do design',
      toolbar: {
        title: 'Tema',
        icon: 'mirror',
        items: [
          { value: THEME.LIGHT, title: 'Claro' },
          { value: THEME.DARK, title: 'Escuro' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: THEME.LIGHT },
  parameters: {
    layout: 'padded',
    nextjs: { appDirectory: true },
    a11y: { test: 'error', config: { rules: [{ id: COLOR_CONTRAST_RULE, enabled: false }] } },
  },
  tags: ['autodocs'],
}

export default preview
