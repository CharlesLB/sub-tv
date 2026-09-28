import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import { MOCK_FUNCTION_IMPORT, serverModuleMocks } from './tools/server-module-mocks/server-module-mocks'

const STORYBOOK_CONFIG_DIRECTORY = fileURLToPath(new URL('./.storybook', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    projects: [
      {
        extends: true,
        plugins: [serverModuleMocks(MOCK_FUNCTION_IMPORT.VITEST)],
        test: { name: 'app', include: ['src/**/*.test.{ts,tsx}'], environment: 'jsdom', setupFiles: ['./src/test/vitest-setup.ts'] },
      },
      {
        extends: true,
        test: { name: 'scripts', include: ['scripts/**/*.test.ts', 'tools/**/*.test.ts'], environment: 'node' },
      },
      {
        plugins: [storybookTest({ configDir: STORYBOOK_CONFIG_DIRECTORY })],
        test: {
          name: 'storybook',
          browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: 'chromium' }] },
        },
      },
    ],
  },
})
