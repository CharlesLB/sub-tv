import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { MatchInfoStepSkeleton } from './match-info-step.skeleton'

const FIELD_COUNT = 4
const PLACEHOLDERS_PER_FIELD = 2
const NOTICE_PLACEHOLDERS = 5

describe('MatchInfoStepSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<MatchInfoStepSkeleton hasNotice={false} />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('without a notice draws a label and an input for date, time, round and venue', () => {
    const { container } = render(<MatchInfoStepSkeleton hasNotice={false} />)

    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(FIELD_COUNT * PLACEHOLDERS_PER_FIELD)
  })

  it('with a notice also draws the notice placeholder below the fields', () => {
    const { container } = render(<MatchInfoStepSkeleton hasNotice />)

    expect(container.firstElementChild?.children).toHaveLength(2)
    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(FIELD_COUNT * PLACEHOLDERS_PER_FIELD + NOTICE_PLACEHOLDERS)
  })
})
