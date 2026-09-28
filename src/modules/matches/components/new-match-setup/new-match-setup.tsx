import { notFound } from 'next/navigation'
import { requireUser } from '@/modules/auth'
import { getMatchSetup } from '../../data/get-match-setup'
import { NewMatchWizard, type WizardPresentation } from '../new-match-wizard/new-match-wizard'

type NewMatchSetupProps = { seasonId: string; prefillMatchId: string | null; presentation: WizardPresentation }

export async function NewMatchSetup({ seasonId, prefillMatchId, presentation }: NewMatchSetupProps) {
  await requireUser()
  const setup = await getMatchSetup(seasonId, prefillMatchId)
  if (!setup) notFound()

  return <NewMatchWizard setup={setup} presentation={presentation} />
}
