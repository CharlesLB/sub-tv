import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CATEGORY } from '../../lib/categories/categories'
import { categoryClubsFixture } from '../club-picker/club-picker.fixtures'
import { NewChampionshipButton } from '../new-championship-button/new-championship-button'
import { NewChampionshipProvider, useNewChampionshipLauncher } from './new-championship-provider'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))

const YEAR = 2025
const SAME_OPENING_TIME = 1000

const LauncherOutsideProvider = () => {
  useNewChampionshipLauncher()

  return null
}

const renderProvider = () =>
  render(
    <NewChampionshipProvider year={YEAR} clubs={categoryClubsFixture}>
      <NewChampionshipButton category={CATEGORY.SUB13} />
      <NewChampionshipButton category={CATEGORY.SUB14} />
    </NewChampionshipProvider>,
  )

describe('NewChampionshipProvider', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn()
  })

  it('renders its children without the new championship form until a launcher opens it', () => {
    renderProvider()

    expect(screen.getByRole('button', { name: 'Novo campeonato SUB-13' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Novo campeonato' })).not.toBeInTheDocument()
  })

  it('opens the form with the category of the launcher that was clicked', async () => {
    renderProvider()

    await userEvent.click(screen.getByRole('button', { name: 'Novo campeonato SUB-14' }))

    expect(screen.getByRole('heading', { name: 'Novo campeonato' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'SUB-14' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('restarts the form with the new category when another launcher is clicked in the same millisecond', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(SAME_OPENING_TIME)
    renderProvider()
    await userEvent.click(screen.getByRole('button', { name: 'Novo campeonato SUB-14' }))

    await userEvent.click(screen.getByRole('button', { name: 'Novo campeonato SUB-13' }))

    expect(screen.getByRole('button', { name: 'SUB-13' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('clears what was typed when the same launcher is clicked again in the same millisecond', async () => {
    vi.spyOn(Date, 'now').mockReturnValue(SAME_OPENING_TIME)
    renderProvider()
    await userEvent.click(screen.getByRole('button', { name: 'Novo campeonato SUB-13' }))
    await userEvent.type(screen.getByLabelText('Nome'), 'Copa do Vale')

    await userEvent.click(screen.getByRole('button', { name: 'Novo campeonato SUB-13' }))

    expect(screen.getByLabelText('Nome')).toHaveValue('')
  })

  it('closes the form when it is cancelled', async () => {
    renderProvider()
    await userEvent.click(screen.getByRole('button', { name: 'Novo campeonato SUB-13' }))

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(screen.queryByRole('heading', { name: 'Novo campeonato' })).not.toBeInTheDocument()
  })

  it('refuses a launcher used outside the provider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const renderOutside = () => render(<LauncherOutsideProvider />)

    expect(renderOutside).toThrow('useNewChampionshipLauncher must be used inside NewChampionshipProvider')
  })
})
