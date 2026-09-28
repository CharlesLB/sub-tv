import { readFileSync } from 'node:fs'
import * as R from 'remeda'
import ts from 'typescript'
import type { Plugin } from 'vite'

const SERVER_MODULE_PATTERN = /\/src\/modules\/[^/]+\/(actions|data|services)\/[^/]+\.ts$/

export const MOCK_FUNCTION_IMPORT = {
  STORYBOOK: "import { fn } from 'storybook/test'",
  VITEST: "import { vi } from 'vitest'\nconst fn = vi.fn",
} as const

type MockFunctionImport = (typeof MOCK_FUNCTION_IMPORT)[keyof typeof MOCK_FUNCTION_IMPORT]
const PLUGIN_NAME = 'sub-tv-server-module-mocks'
const NEXT_SERVER_MODULE = 'next/server'
const NEXT_SERVER_STUB_ID = '\0sub-tv-next-server-stub'
const NEXT_SERVER_STUB_SOURCE = 'export const connection = () => Promise.resolve()\nexport const after = () => undefined'
const SOURCE_DIRECTORY_SEGMENT = '/src/'

export type MockedExport = { name: string; source: string }

const isFunctionLike = (expression: ts.Expression): boolean => ts.isArrowFunction(expression) || ts.isFunctionExpression(expression)

const mockFunctionSource = (name: string): string => `fn().mockName('${name}')`

const unwrapExpression = (expression: ts.Expression): ts.Expression =>
  ts.isAsExpression(expression) || ts.isSatisfiesExpression(expression) || ts.isParenthesizedExpression(expression) ? unwrapExpression(expression.expression) : expression

const objectMemberSource = (qualifiedName: string, member: ts.ObjectLiteralElementLike, sourceFile: ts.SourceFile): string | null => {
  const memberName = member.name && ts.isIdentifier(member.name) ? member.name.text : null
  if (!memberName) return null

  const isMethod = ts.isMethodDeclaration(member) || (ts.isPropertyAssignment(member) && isFunctionLike(unwrapExpression(member.initializer)))
  const isLiteralProperty = ts.isPropertyAssignment(member) && isLiteralValue(member.initializer)
  const valueSource = isLiteralProperty && !isMethod ? member.initializer.getText(sourceFile) : mockFunctionSource(`${qualifiedName}.${memberName}`)

  return `${memberName}: ${valueSource}`
}

const LITERAL_KINDS: ReadonlySet<ts.SyntaxKind> = new Set([
  ts.SyntaxKind.StringLiteral,
  ts.SyntaxKind.NumericLiteral,
  ts.SyntaxKind.NoSubstitutionTemplateLiteral,
  ts.SyntaxKind.TrueKeyword,
  ts.SyntaxKind.FalseKeyword,
  ts.SyntaxKind.NullKeyword,
])

const isLiteralValue = (initializer: ts.Expression): boolean => {
  const expression = unwrapExpression(initializer)
  if (LITERAL_KINDS.has(expression.kind)) return true
  if (ts.isArrayLiteralExpression(expression)) return expression.elements.every(isLiteralValue)

  return ts.isObjectLiteralExpression(expression) && expression.properties.every((property) => ts.isPropertyAssignment(property) && isLiteralValue(property.initializer))
}

const initializerSource = (name: string, initializer: ts.Expression, sourceFile: ts.SourceFile): string => {
  const expression = unwrapExpression(initializer)
  if (isLiteralValue(expression)) return expression.getText(sourceFile)

  if (ts.isObjectLiteralExpression(expression)) {
    const members = R.pipe(
      [...expression.properties],
      R.map((member) => objectMemberSource(name, member, sourceFile)),
      R.filter(R.isNonNullish),
    )

    return `{ ${members.join(', ')} }`
  }

  return mockFunctionSource(name)
}

const hasExportModifier = (statement: ts.Statement): boolean => ts.canHaveModifiers(statement) && (ts.getModifiers(statement) ?? []).some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)

const exportsOfStatement = (statement: ts.Statement, sourceFile: ts.SourceFile): MockedExport[] => {
  if (!hasExportModifier(statement)) return []
  if (ts.isFunctionDeclaration(statement) && statement.name) return [{ name: statement.name.text, source: mockFunctionSource(statement.name.text) }]
  if (!ts.isVariableStatement(statement)) return []

  return R.pipe(
    [...statement.declarationList.declarations],
    R.filter((declaration) => ts.isIdentifier(declaration.name) && declaration.initializer !== undefined),
    R.map((declaration) => {
      const name = declaration.name.getText(sourceFile)

      return { name, source: declaration.initializer ? initializerSource(name, declaration.initializer, sourceFile) : 'undefined' }
    }),
  )
}

export const mockedExportsOf = (fileName: string, sourceText: string): MockedExport[] => {
  const sourceFile = ts.createSourceFile(fileName, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)

  return [...sourceFile.statements].flatMap((statement) => exportsOfStatement(statement, sourceFile))
}

export const mockModuleSource = (mockFunctionImport: MockFunctionImport, mockedExports: MockedExport[]): string =>
  [mockFunctionImport, ...mockedExports.map((mockedExport) => `export const ${mockedExport.name} = ${mockedExport.source}`)].join('\n')

export const serverModuleMocks = (mockFunctionImport: MockFunctionImport): Plugin => ({
  name: PLUGIN_NAME,
  enforce: 'pre',
  resolveId: (source, importer) => (source === NEXT_SERVER_MODULE && importer?.includes(SOURCE_DIRECTORY_SEGMENT) ? NEXT_SERVER_STUB_ID : null),
  load: (id) => {
    if (id === NEXT_SERVER_STUB_ID) return NEXT_SERVER_STUB_SOURCE

    const filePath = id.split('?')[0] ?? id
    if (!SERVER_MODULE_PATTERN.test(filePath)) return null

    // eslint-disable-next-line security/detect-non-literal-fs-filename -- o caminho vem do grafo de módulos do Vite e já casou com SERVER_MODULE_PATTERN
    return mockModuleSource(mockFunctionImport, mockedExportsOf(filePath, readFileSync(filePath, 'utf8')))
  },
})
