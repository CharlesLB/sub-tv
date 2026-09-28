import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { WizardNotice } from './wizard-notice'

const NOTICE_TEXT = 'A categoria vem do campeonato e define os times desta partida.'

describe('WizardNotice', () => {
  it('shows the notice text next to a decorative icon', () => {
    const { container } = render(<WizardNotice icon="info" text={NOTICE_TEXT} />)

    expect(screen.getByText(NOTICE_TEXT)).toBeInTheDocument()
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })
})
