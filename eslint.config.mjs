import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/modules/*/data/**', 'src/modules/*/services/**', 'src/lib/db/**', 'src/modules/*/actions/**'],
    rules: {
      'no-restricted-imports': ['error', { paths: [{ name: '@/lib/db', message: 'Acesso ao banco só em data/ ou services/.' }] }],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'spec/**', '.claude/**', 'public/**', 'drizzle/**', '.data/**']),
])

export default eslintConfig
