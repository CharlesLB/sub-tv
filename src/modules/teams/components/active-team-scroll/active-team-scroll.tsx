'use client'

import { useEffect } from 'react'
import { ACTIVE_TEAM_ATTRIBUTE } from '../../lib/active-team/active-team'

export function ActiveTeamScroll({ activeTeamKey }: { activeTeamKey: string | null }) {
  useEffect(() => {
    if (!activeTeamKey) return
    document.querySelector(`[${ACTIVE_TEAM_ATTRIBUTE}]`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [activeTeamKey])

  return null
}
