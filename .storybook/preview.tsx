import type { Decorator, Preview } from '@storybook/nextjs-vite'
import { type ReactNode, useEffect } from 'react'
import { barlowCondensed, geist } from '../src/app/fonts'
import '../src/app/globals.css'
import { THEME, THEME_ATTRIBUTE, type Theme } from '../src/modules/platform/lib/theme/theme'

const COLOR_CONTRAST_RULE = 'color-contrast'

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
