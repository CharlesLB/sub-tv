'use client'

import { useRouter } from 'next/navigation'
import { useReducer, useState, useSyncExternalStore, useTransition } from 'react'
import { routes } from '@/lib/routes'
import { type Category, categoryLabel, otherCategory } from '@/modules/championships/client'
import { createBroadcastMatch } from '../../actions/match-setup-actions'
import { STARTERS_PER_TEAM } from '../../default-starters/default-starters'
import { toDateInputInSaoPaulo } from '../../kickoff-time/kickoff-time'
import { SIDE, type Side } from '../../live-match/live-match'
import type { MatchSetupVM } from '../../types'
import { createInitialWizardState, LINEUP_VIEW, WIZARD_STEP, wizardReducer } from '../../wizard-reducer/wizard-reducer'
import {
  canAdvance,
  effectiveDate,
  findTeam,
  informationNotice,
  reviewSubtitle,
  starterPositionsOf,
  stepHint,
  stepValues,
  summaryLines,
  teamsNotice,
  toCreateInput,
  type WizardContext,
} from '../../wizard-selectors/wizard-selectors'
import type { BoardSideVM } from '../lineup-board/lineup-board'
import { LineupEditor } from '../lineup-editor/lineup-editor'
import { MatchInfoStep } from '../match-info-step/match-info-step'
import { ReviewStep } from '../review-step/review-step'
import { TeamsStep } from '../teams-step/teams-step'
import { WizardFooter } from '../wizard-footer/wizard-footer'
import { WizardStepper } from '../wizard-stepper/wizard-stepper'
import { WizardSummary } from '../wizard-summary/wizard-summary'
import { WizardToast } from '../wizard-toast/wizard-toast'
import { newMatchWizardStyles as styles } from './new-match-wizard.styles'

export type WizardPresentation = 'sheet' | 'page'

const categoryNameOf = (category: Category): string => {
  const label = categoryLabel[category]

  return `${label.charAt(0)}${label.slice(1).toLowerCase()}`
}

const DEFAULT_LINEUP_VIEW = { sheet: LINEUP_VIEW.FIELD, page: LINEUP_VIEW.LIST } as const satisfies Record<WizardPresentation, string>

const subscribeToNothing = () => () => undefined
const readToday = () => toDateInputInSaoPaulo(new Date())
const readNoDateOnServer = () => ''

type NewMatchWizardProps = { setup: MatchSetupVM; presentation: WizardPresentation }

export function NewMatchWizard({ setup, presentation }: NewMatchWizardProps) {
  const router = useRouter()
  const today = useSyncExternalStore(subscribeToNothing, readToday, readNoDateOnServer)
  const [state, dispatch] = useReducer(wizardReducer, { setup, defaultLineupView: DEFAULT_LINEUP_VIEW[presentation] }, createInitialWizardState)
  const [failureMessage, setFailureMessage] = useState<string | null>(null)
  const [isSubmitting, startSubmitting] = useTransition()

  const { championship } = setup
  const context: WizardContext = { setup, today, categoryLabel: categoryLabel[championship.category] }
  const isReady = canAdvance(state, today)
  const showNotices = presentation === 'page'

  const lineupSides: BoardSideVM[] = [
    { side: SIDE.HOME, team: findTeam(setup, state.homeTeamId), starterIds: state.homeStarterIds },
    { side: SIDE.AWAY, team: findTeam(setup, state.awayTeamId), starterIds: state.awayStarterIds },
  ].flatMap((entry) => (entry.team ? [{ side: entry.side, team: entry.team, starterIds: entry.starterIds, positions: starterPositionsOf(state, setup, entry.side) }] : []))

  const leave = () => (presentation === 'sheet' ? router.back() : router.push(routes.championship(championship.id)))
  const goBack = () => (state.step === WIZARD_STEP.INFORMATION ? leave() : dispatch({ type: 'step/returned' }))
  const goNext = () => (isReady ? dispatch({ type: 'step/advanced' }) : undefined)

  const submit = () =>
    startSubmitting(async () => {
      setFailureMessage(null)
      const result = await createBroadcastMatch(toCreateInput(state, context))
      if (!result.ok) setFailureMessage(result.error)
    })

  const stepContent = {
    [WIZARD_STEP.INFORMATION]: (
      <MatchInfoStep
        values={{ date: effectiveDate(state, today), time: state.time, round: state.round, venue: state.venue }}
        notice={showNotices ? informationNotice(context) : null}
        onChange={(field, value) => dispatch({ type: 'field/changed', field, value })}
      />
    ),
    [WIZARD_STEP.TEAMS]: (
      <TeamsStep
        teams={setup.teams}
        category={championship.category}
        chosenTeamIds={{ home: state.homeTeamId, away: state.awayTeamId }}
        notice={showNotices ? teamsNotice(context, categoryNameOf(otherCategory[championship.category])) : null}
        onPick={(side: Side, team) => dispatch({ type: 'team/picked', side, team })}
      />
    ),
    [WIZARD_STEP.LINEUPS]: <LineupEditor sides={lineupSides} view={state.lineupView} category={championship.category} year={championship.year} dispatch={dispatch} />,
    [WIZARD_STEP.REVIEW]: <ReviewStep championshipName={championship.name} category={championship.category} subtitle={reviewSubtitle(state, context)} sides={lineupSides} />,
  }

  return (
    <div className={styles.wizard}>
      <WizardStepper currentStep={state.step} values={stepValues(state, context)} onGoBackTo={(step) => dispatch({ type: 'step/went-back-to', step })} />
      <div className={styles.content}>{stepContent[state.step]}</div>
      {state.isSummaryOpen ? (
        <WizardSummary
          sides={lineupSides.map(({ side, team, starterIds }) => ({
            key: side,
            name: team.name,
            color: team.color,
            crestPath: team.crestPath,
            lineupCount: `${starterIds.length}/${STARTERS_PER_TEAM}`,
          }))}
          lines={summaryLines(state, context)}
          category={championship.category}
        />
      ) : null}
      <WizardFooter
        hint={stepHint(state, context)}
        isSummaryOpen={state.isSummaryOpen}
        isFirstStep={state.step === WIZARD_STEP.INFORMATION}
        isFinalStep={state.step === WIZARD_STEP.REVIEW}
        canAdvance={isReady}
        isSubmitting={isSubmitting}
        onToggleSummary={() => dispatch({ type: 'summary/toggled' })}
        onBack={goBack}
        onNext={goNext}
        onSubmit={submit}
      />
      {failureMessage ? <WizardToast key={failureMessage} message={failureMessage} onClose={() => setFailureMessage(null)} /> : null}
    </div>
  )
}
