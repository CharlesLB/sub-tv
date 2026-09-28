import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { ProfileChips } from './profile-chips'

describe('ProfileChips', () => {
  it('shows the position, the preferred foot and the team with category in upper case', () => {
    render(<ProfileChips position="volante" preferredFoot="destro" teamName="Estrela do Vale" category={CATEGORY.SUB13} />)

    expect(screen.getByText('VOLANTE')).toBeInTheDocument()
    expect(screen.getByText('DESTRO')).toBeInTheDocument()
    expect(screen.getByText('Estrela do Vale · SUB-13')).toBeInTheDocument()
  })

  it('shows only the team chip when position and preferred foot are missing', () => {
    const { container } = render(<ProfileChips position={null} preferredFoot={null} teamName="Estrela do Vale" category={CATEGORY.SUB13} />)

    expect(screen.getByText('Estrela do Vale · SUB-13')).toBeInTheDocument()
    expect(container.firstElementChild?.children).toHaveLength(1)
  })
})
