import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MatchInfoStep } from './match-info-step'

const VALUES = { date: '2026-10-03', time: '10:00', round: '7', venue: '' }
const INFORMATION_NOTICE = 'Esta partida pertence a Mineiro SUB-14.'

describe('MatchInfoStep', () => {
  it('shows a required labeled input for each field with its current value', () => {
    render(<MatchInfoStep values={VALUES} notice={null} onChange={vi.fn()} />)

    expect(screen.getByLabelText('Data')).toHaveValue('2026-10-03')
    expect(screen.getByLabelText('Horário')).toHaveValue('10:00')
    expect(screen.getByLabelText('Rodada')).toHaveValue('7')
    expect(screen.getByLabelText('Local')).toHaveAttribute('placeholder', 'Arena do vale · campo 2')
    expect(screen.getByLabelText('Local')).toBeRequired()
  })

  it('limits the round to two characters and the other fields to 120', () => {
    render(<MatchInfoStep values={VALUES} notice={null} onChange={vi.fn()} />)

    expect(screen.getByLabelText('Rodada')).toHaveAttribute('maxlength', '2')
    expect(screen.getByLabelText('Rodada')).toHaveAttribute('inputmode', 'numeric')
    expect(screen.getByLabelText('Local')).toHaveAttribute('maxlength', '120')
  })

  it('calls onChange with the field and the typed value', async () => {
    const onChange = vi.fn()
    render(<MatchInfoStep values={VALUES} notice={null} onChange={onChange} />)

    await userEvent.type(screen.getByLabelText('Local'), 'A')

    expect(onChange).toHaveBeenCalledWith('venue', 'A')
  })

  it('shows the notice only when one is given', () => {
    const { rerender } = render(<MatchInfoStep values={VALUES} notice={INFORMATION_NOTICE} onChange={vi.fn()} />)

    expect(screen.getByText(INFORMATION_NOTICE)).toBeInTheDocument()

    rerender(<MatchInfoStep values={VALUES} notice={null} onChange={vi.fn()} />)

    expect(screen.queryByText(INFORMATION_NOTICE)).not.toBeInTheDocument()
  })
})
