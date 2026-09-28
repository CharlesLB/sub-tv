import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { SUMMARY_LINE } from '../../wizard-selectors/wizard-selectors'
import { WizardSummary } from './wizard-summary'
import { summaryLinesFixture, summarySidesFixture } from './wizard-summary.fixtures'

describe('WizardSummary', () => {
  it('lists each side with its lineup count', () => {
    render(<WizardSummary sides={summarySidesFixture} lines={summaryLinesFixture} category={CATEGORY.SUB14} />)

    expect(screen.getByRole('region', { name: 'Resumo da partida' })).toBeInTheDocument()
    expect(screen.getByText('Estrela do Vale')).toBeInTheDocument()
    expect(screen.getByText('11/11')).toBeInTheDocument()
    expect(screen.getByText('Atlético Serrano')).toBeInTheDocument()
    expect(screen.getByText('9/11')).toBeInTheDocument()
  })

  it('shows every schedule line and the inherited category', () => {
    render(<WizardSummary sides={summarySidesFixture} lines={summaryLinesFixture} category={CATEGORY.SUB14} />)

    expect(screen.getByText('Mineiro · R7')).toBeInTheDocument()
    expect(screen.getByText('Arena do Vale · campo 2')).toBeInTheDocument()
    expect(screen.getByText('SUB-14')).toBeInTheDocument()
  })

  it('keeps repeated schedule lines instead of dropping duplicates', () => {
    render(
      <WizardSummary
        sides={summarySidesFixture}
        lines={[
          { id: SUMMARY_LINE.KICKOFF, text: 'A definir' },
          { id: SUMMARY_LINE.VENUE, text: 'A definir' },
        ]}
        category={CATEGORY.SUB13}
      />,
    )

    expect(screen.getAllByText('A definir')).toHaveLength(2)
  })
})
