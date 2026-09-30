'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useTransition } from 'react'
import { routes } from '@/lib/routes'
import { NavigationProgress } from '@/components/ui/navigation-progress/navigation-progress'
import { readRememberedYear } from '@/modules/platform/client'

type SquadsSeasonRedirectProps = {
  knownYears: number[]
  fallbackYear: number
  query: { category: string | undefined; teamKey: string | undefined; playerId: string | undefined }
}

export function SquadsSeasonRedirect({ knownYears, fallbackYear, query }: SquadsSeasonRedirectProps) {
  const router = useRouter()
  const [isRedirecting, startRedirect] = useTransition()

  useEffect(() => {
    const rememberedYear = readRememberedYear()
    const year = rememberedYear !== null && knownYears.includes(rememberedYear) ? rememberedYear : fallbackYear

    startRedirect(() => router.replace(routes.squads({ year, ...query })))
  }, [fallbackYear, knownYears, query, router])

  return <NavigationProgress isActive={isRedirecting} />
}
