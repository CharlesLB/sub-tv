'use client'

import { createContext, use, useState, type ReactNode } from 'react'
import type { Category } from '../../categories'
import type { CategoryClubsVM } from '../../types'
import { NewChampionshipPanel } from '../new-championship-panel/new-championship-panel'

type NewChampionshipLauncher = { openFor: (category: Category) => void }

const NewChampionshipContext = createContext<NewChampionshipLauncher | null>(null)

export const useNewChampionshipLauncher = (): NewChampionshipLauncher => {
  const launcher = use(NewChampionshipContext)
  if (!launcher) throw new Error('useNewChampionshipLauncher must be used inside NewChampionshipProvider')

  return launcher
}

type OpenForm = { category: Category; openedAt: number }

type NewChampionshipProviderProps = { year: number; clubs: CategoryClubsVM; children: ReactNode }

export function NewChampionshipProvider({ year, clubs, children }: NewChampionshipProviderProps) {
  const [openForm, setOpenForm] = useState<OpenForm | null>(null)
  const openFor = (category: Category) => {
    setOpenForm({ category, openedAt: Date.now() })
  }

  return (
    <NewChampionshipContext value={{ openFor }}>
      <div className="mx-auto flex max-w-[1240px] flex-col gap-[18px]">
        {openForm ? (
          <NewChampionshipPanel key={openForm.openedAt} initialCategory={openForm.category} defaultYear={year} clubs={clubs} onClose={() => setOpenForm(null)} />
        ) : null}
        {children}
      </div>
    </NewChampionshipContext>
  )
}
