import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import security from 'eslint-plugin-security'
import storybook from 'eslint-plugin-storybook'

const DATABASE_ACCESS_MESSAGE = 'Acesso ao banco só em data/ ou services/.'
const NO_LOOPS_MESSAGE = 'Use map/filter/reduce ou Remeda em vez de laços (regra 08).'

const RESTRICTED_SYNTAX = [
  { selector: "VariableDeclaration[kind='let']", message: 'Use const (regra 04).' },
  { selector: "VariableDeclaration[kind='var']", message: 'Use const (regra 04).' },
  { selector: 'ForStatement', message: NO_LOOPS_MESSAGE },
  { selector: 'ForOfStatement', message: NO_LOOPS_MESSAGE },
  { selector: 'ForInStatement', message: NO_LOOPS_MESSAGE },
  { selector: 'WhileStatement', message: NO_LOOPS_MESSAGE },
  { selector: 'DoWhileStatement', message: NO_LOOPS_MESSAGE },
  { selector: "CallExpression[callee.property.name='forEach']", message: NO_LOOPS_MESSAGE },
  { selector: "TSAsExpression:not([typeAnnotation.typeName.name='const'])", message: 'Não use as para forçar tipo; modele o tipo (regra 07).' },
]

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { plugins: security.configs.recommended.plugins, rules: Object.fromEntries(Object.keys(security.configs.recommended.rules).map((ruleName) => [ruleName, 'error'])) },
  ...storybook.configs['flat/recommended'],
  {
    plugins: { '@stylistic': stylistic },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
      'security/detect-object-injection': 'off',
      'no-restricted-syntax': ['error', ...RESTRICTED_SYNTAX],
      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        { blankLine: 'always', prev: '*', next: ['return', 'throw'] },
        { blankLine: 'always', prev: ['block-like', 'multiline-const', 'multiline-expression'], next: '*' },
        { blankLine: 'always', prev: '*', next: ['block-like', 'multiline-const', 'multiline-expression', 'export', 'type', 'interface'] },
        { blankLine: 'any', prev: 'export', next: 'export' },
        { blankLine: 'any', prev: 'singleline-const', next: 'singleline-const' },
      ],
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/*.stories.tsx', 'tests/**', 'e2e/**'],
    rules: { 'no-restricted-syntax': ['error', ...RESTRICTED_SYNTAX.filter((restriction) => !restriction.selector.startsWith('TSAsExpression'))] },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/modules/*/data/**', 'src/modules/*/services/**', 'src/lib/db/**', 'src/modules/*/actions/**', 'src/**/*.test.{ts,tsx}', 'src/**/*.stories.tsx', 'src/test/**'],
    rules: {
      'no-restricted-imports': ['error', { paths: [{ name: '@/lib/db', message: DATABASE_ACCESS_MESSAGE }] }],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'spec/**', '.claude/**', 'public/**', 'drizzle/**', '.data/**', 'storybook-static/**', '!.storybook']),
])

export default eslintConfig
