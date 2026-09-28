import { fileURLToPath } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'
import { MOCK_FUNCTION_IMPORT, serverModuleMocks } from './tools/server-module-mocks/server-module-mocks.ts'

const INTEGRATION_TESTS = '{src,scripts}/**/*.integration.test.ts'
const EMPTY_MODULE = fileURLToPath(new URL('./tools/empty-module/empty-module.ts', import.meta.url))
const DESKTOP_VIEWPORT = { width: 1280, height: 900 }
const STORYBOOK_CONFIG_DIRECTORY = fileURLToPath(new URL('./.storybook', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    projects: [
      {
        extends: true,
        plugins: [serverModuleMocks(MOCK_FUNCTION_IMPORT.VITEST)],
        test: { name: 'app', include: ['src/**/*.test.{ts,tsx}'], exclude: [INTEGRATION_TESTS], environment: 'jsdom', setupFiles: ['./src/test/vitest-setup.ts'] },
      },
      {
        extends: true,
        resolve: { alias: { 'server-only': EMPTY_MODULE } },
        test: { name: 'integration', include: [INTEGRATION_TESTS], environment: 'node', setupFiles: ['./src/test/test-database/integration-setup.ts'] },
      },
      {
        extends: true,
        test: { name: 'scripts', include: ['scripts/**/*.test.ts', 'tools/**/*.test.ts'], exclude: [INTEGRATION_TESTS], environment: 'node' },
      },
      {
        plugins: [storybookTest({ configDir: STORYBOOK_CONFIG_DIRECTORY })],
        test: {
          name: 'storybook',
          browser: { enabled: true, headless: true, provider: playwright(), viewport: DESKTOP_VIEWPORT, instances: [{ browser: 'chromium' }] },
        },
      },
    ],
  },
})
