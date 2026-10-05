'use client'

import type { ReactNode } from 'react'
import { useCanEdit } from '../editor-access-provider/editor-access-provider'

export function EditorOnly({ children }: { children: ReactNode }) {
  return useCanEdit() ? children : null
}
