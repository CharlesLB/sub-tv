import { routes } from '@/lib/routes'
import { EmptyState } from '@/modules/platform'

export default function PlatformNotFound() {
  return <EmptyState title="Página não encontrada" description="O campeonato, time ou partida que você procurou não existe ou foi removido." action={{ label: 'Ver campeonatos', href: routes.championships() }} />
}
