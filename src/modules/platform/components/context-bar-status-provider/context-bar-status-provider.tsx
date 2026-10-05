'use client'

import { createContext, type ReactNode, use } from 'react'

const ContextBarStatusContext = createContext<ReactNode>(null)

export const useContextBarStatus = (): ReactNode => use(ContextBarStatusContext)

type ContextBarStatusProviderProps = { status: ReactNode; children: ReactNode }

export function ContextBarStatusProvider({ status, children }: ContextBarStatusProviderProps) {
  return <ContextBarStatusContext value={status}>{children}</ContextBarStatusContext>
}
