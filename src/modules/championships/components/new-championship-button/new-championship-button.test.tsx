import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CATEGORY } from '../../categories'
import { categoryClubsFixture } from '../club-picker/club-picker.fixtures'
import { NewChampionshipProvider } from '../new-championship-provider/new-championship-provider'
import { NewChampionshipButton } from './new-championship-button'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

describe('NewChampionshipButton', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('names the category it creates a championship for', () => {
    render(
      <NewChampionshipProvider year={2025} clubs={categoryClubsFixture}>
        <NewChampionshipButton category={CATEGORY.SUB14} />
      </NewChampionshipProvider>,
    )

    expect(screen.getByRole('button', { name: 'Novo campeonato SUB-14' })).toBeInTheDocument()
  })

  it('opens the new championship form for its category when clicked', async () => {
    render(
      <NewChampionshipProvider year={2025} clubs={categoryClubsFixture}>
        <NewChampionshipButton category={CATEGORY.SUB14} />
      </NewChampionshipProvider>,
    )

    await userEvent.click(screen.getByRole('button', { name: 'Novo campeonato SUB-14' }))

    expect(screen.getByRole('heading', { name: 'Novo campeonato' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'SUB-14' })).toHaveAttribute('aria-pressed', 'true')
  })
})
