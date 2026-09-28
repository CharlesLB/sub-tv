import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AUDIT_ENTITY } from '../../audit-action'
import { getLastChange } from '../../data/get-last-change'
import { LastChange } from './last-change'
import { lastChangeFixture } from './last-change.fixtures'

const PLAYER_ID = '5a4b3c2d-1e0f-4a9b-8c7d-6e5f4a3b2c19'

const renderLastChange = async () => render(<Suspense>{await LastChange({ entityType: AUDIT_ENTITY.PLAYER, entityId: PLAYER_ID })}</Suspense>)

describe('LastChange', () => {
  it('shows who made the last change and when, with the action as the title', async () => {
    vi.mocked(getLastChange).mockResolvedValue(lastChangeFixture)

    await renderLastChange()

    expect(screen.getByText('Última alteração: Marina Couto · 20/09/2026 10:05')).toBeInTheDocument()
    expect(screen.getByTitle('Alterou a ficha do jogador')).toBeInTheDocument()
  })

  it('renders nothing when the entity was never changed', async () => {
    vi.mocked(getLastChange).mockResolvedValue(null)

    const { container } = await renderLastChange()

    expect(container).toBeEmptyDOMElement()
  })

  it('asks for the last change of the given entity', async () => {
    vi.mocked(getLastChange).mockResolvedValue(null)

    await renderLastChange()

    expect(getLastChange).toHaveBeenCalledWith(AUDIT_ENTITY.PLAYER, PLAYER_ID)
  })
})
