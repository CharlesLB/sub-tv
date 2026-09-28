import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SegmentedChoice } from './segmented-choice'

const FOOT_OPTIONS = [
  { value: 'destro', label: 'Destro' },
  { value: 'canhoto', label: 'Canhoto' },
]

describe('SegmentedChoice', () => {
  it('groups the options under the legend and checks the default value', () => {
    render(<SegmentedChoice name="preferredFoot" legend="Pé preferido" options={FOOT_OPTIONS} defaultValue="canhoto" onChange={vi.fn()} />)

    expect(screen.getByRole('group', { name: 'Pé preferido' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: 'Canhoto' })).toBeChecked()
    expect(screen.getByRole('radio', { name: 'Destro' })).not.toBeChecked()
  })

  it('leaves every option unchecked when there is no default value', () => {
    render(<SegmentedChoice name="preferredFoot" legend="Pé preferido" options={FOOT_OPTIONS} defaultValue={null} onChange={vi.fn()} />)

    expect(screen.getByRole('radio', { name: 'Canhoto' })).not.toBeChecked()
    expect(screen.getByRole('radio', { name: 'Destro' })).not.toBeChecked()
  })

  it('reports the change and checks the option when another option is clicked', async () => {
    const onChange = vi.fn()
    render(<SegmentedChoice name="preferredFoot" legend="Pé preferido" options={FOOT_OPTIONS} defaultValue="canhoto" onChange={onChange} />)

    await userEvent.click(screen.getByRole('radio', { name: 'Destro' }))

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('radio', { name: 'Destro' })).toBeChecked()
  })
})
