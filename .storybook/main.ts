import type { StorybookConfig } from '@storybook/nextjs-vite'
import { MOCK_FUNCTION_IMPORT, serverModuleMocks } from '../tools/server-module-mocks/server-module-mocks.ts'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: { name: '@storybook/nextjs-vite', options: {} },
  features: { experimentalRSC: true },
  staticDirs: ['../public'],
  viteFinal: (viteConfig) => ({ ...viteConfig, plugins: [serverModuleMocks(MOCK_FUNCTION_IMPORT.STORYBOOK), ...(viteConfig.plugins ?? [])] }),
}

export default config
