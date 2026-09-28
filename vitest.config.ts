import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    projects: [
      {
        extends: true,
        test: { name: 'app', include: ['src/**/*.test.{ts,tsx}'], environment: 'jsdom' },
      },
      {
        extends: true,
        test: { name: 'scripts', include: ['scripts/**/*.test.ts'], environment: 'node' },
      },
    ],
  },
})
