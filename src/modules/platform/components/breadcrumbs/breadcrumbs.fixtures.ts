import { routes } from '@/lib/routes'
import type { Crumb } from './breadcrumbs'

export const championshipCrumbsFixture: Crumb[] = [{ label: 'Campeonatos', href: routes.championships(2025) }, { label: '2025', href: routes.championships(2025) }, { label: 'Mineiro Sub-14' }]

export const dotSeparatedCrumbsFixture: Crumb[] = [
  { label: 'Histórico', href: routes.history() },
  { label: 'Atleta', separator: '·' },
]
