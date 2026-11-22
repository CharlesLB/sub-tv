import { describe, expect, it } from 'vitest'
import { MOCK_FUNCTION_IMPORT, mockedExportsOf, mockModuleSource } from './server-module-mocks'

const SERVER_MODULE_SOURCE = `
import 'server-only'
import { cache } from 'react'

export const PAGE_SIZE = 20
export const STATUS = { OPEN: 'open', CLOSED: 'closed' } as const
export const getRows = async (id: string) => [id]
export const getCurrentUser = cache(async () => null)
export async function recordEvent() {}
export const userService = { create: async () => null, LIMIT: 3 }
export type Row = { id: string }
const hidden = 1
`

describe('mockedExportsOf', () => {
  it('turns functions, cached functions and function declarations into mock functions', () => {
    const mockedExports = mockedExportsOf('get-rows.ts', SERVER_MODULE_SOURCE)

    expect(mockedExports).toContainEqual({ name: 'getRows', source: "fn().mockName('getRows')" })
    expect(mockedExports).toContainEqual({ name: 'getCurrentUser', source: "fn().mockName('getCurrentUser')" })
    expect(mockedExports).toContainEqual({ name: 'recordEvent', source: "fn().mockName('recordEvent')" })
  })

  it('copies literal constants and keeps literal members of service objects', () => {
    const mockedExports = mockedExportsOf('get-rows.ts', SERVER_MODULE_SOURCE)

    expect(mockedExports).toContainEqual({ name: 'PAGE_SIZE', source: '20' })
    expect(mockedExports).toContainEqual({ name: 'STATUS', source: "{ OPEN: 'open', CLOSED: 'closed' }" })
    expect(mockedExports).toContainEqual({ name: 'userService', source: "{ create: fn().mockName('userService.create'), LIMIT: 3 }" })
  })

  it('ignores types and declarations that are not exported', () => {
    const exportedNames = mockedExportsOf('get-rows.ts', SERVER_MODULE_SOURCE).map((mockedExport) => mockedExport.name)

    expect(exportedNames).not.toContain('Row')
    expect(exportedNames).not.toContain('hidden')
  })
})

describe('mockModuleSource', () => {
  it('writes the mock function import followed by one export per mocked value', () => {
    const source = mockModuleSource(MOCK_FUNCTION_IMPORT.STORYBOOK, [{ name: 'PAGE_SIZE', source: '20' }])

    expect(source).toBe("import { fn } from 'storybook/test'\nexport const PAGE_SIZE = 20")
  })
})
