'use client'

import type { Dispatch } from 'react'
import { useMediaQuery } from '@/lib/hooks/use-media-query/use-media-query'
import { type Category, categoryLabel } from '@/modules/championships/client'
import { LINEUP_VIEW, type LineupView, type WizardAction } from '../../lib/wizard-reducer/wizard-reducer'
import { type BoardSideVM, LineupBoard } from '../lineup-board/lineup-board'
import { LineupViewToolbar } from '../lineup-view-toolbar/lineup-view-toolbar'
import { LineupsStep } from '../lineups-step/lineups-step'

const MOBILE_QUERY = '(max-width: 619px), (max-height: 479px) and (max-width: 999px)'

type LineupEditorProps = {
  sides: BoardSideVM[]
  view: LineupView
  category: Category
  year: number
  dispatch: Dispatch<WizardAction>
}

export function LineupEditor({ sides, view, category, year, dispatch }: LineupEditorProps) {
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const isFieldView = !isMobile && view === LINEUP_VIEW.FIELD

  return (
    <>
      {isMobile ? null : <LineupViewToolbar view={view} onChange={(nextView) => dispatch({ type: 'view/changed', view: nextView })} />}
      {isFieldView ? (
        <LineupBoard sides={sides} categoryLabel={categoryLabel[category]} dispatch={dispatch} />
      ) : (
        <LineupsStep sides={sides} category={category} year={year} onToggle={(side, playerId) => dispatch({ type: 'starter/toggled', side, playerId })} />
      )}
    </>
  )
}
