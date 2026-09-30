import { render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ACTIVE_TEAM_ATTRIBUTE } from '../../lib/active-team/active-team'
import { ActiveTeamScroll } from './active-team-scroll'

const renderActiveTeam = () => {
  const activeTeam = document.createElement('a')
  const scrollIntoView = vi.fn()
  activeTeam.setAttribute(ACTIVE_TEAM_ATTRIBUTE, 'true')
  activeTeam.scrollIntoView = scrollIntoView
  document.body.append(activeTeam)

  return { activeTeam, scrollIntoView }
}

describe('ActiveTeamScroll', () => {
  it('scrolls the active team into view when a team is active', () => {
    const { activeTeam, scrollIntoView } = renderActiveTeam()

    const { container } = render(<ActiveTeamScroll activeTeamKey="sub14-estrela" />)

    expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' })
    expect(container).toBeEmptyDOMElement()
    activeTeam.remove()
  })

  it('does not scroll when no team is active', () => {
    const { activeTeam, scrollIntoView } = renderActiveTeam()

    render(<ActiveTeamScroll activeTeamKey={null} />)

    expect(scrollIntoView).not.toHaveBeenCalled()
    activeTeam.remove()
  })
})
