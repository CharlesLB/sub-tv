'use client'

import { createContext, type ReactNode, use } from 'react'

type EditorAccess = boolean | Promise<boolean>

const EditorAccessContext = createContext<EditorAccess>(false)

export const useCanEdit = (): boolean => {
  const access = use(EditorAccessContext)

  return typeof access === 'boolean' ? access : use(access)
}

type EditorAccessProviderProps = { canEdit: EditorAccess; children: ReactNode }

export function EditorAccessProvider({ canEdit, children }: EditorAccessProviderProps) {
  return <EditorAccessContext value={canEdit}>{children}</EditorAccessContext>
}
