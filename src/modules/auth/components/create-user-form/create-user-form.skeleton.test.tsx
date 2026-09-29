import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CreateUserFormSkeleton } from './create-user-form.skeleton'

const TITLE_PLACEHOLDERS = 1
const FIELD_COUNT = 3
const PLACEHOLDERS_PER_FIELD = 2
const SUBMIT_PLACEHOLDERS = 1

describe('CreateUserFormSkeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = render(<CreateUserFormSkeleton />)

    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the title, a label and a field for each of the three fields and the submit button', () => {
    const { container } = render(<CreateUserFormSkeleton />)

    expect(container.querySelectorAll('span[aria-hidden]')).toHaveLength(TITLE_PLACEHOLDERS + FIELD_COUNT * PLACEHOLDERS_PER_FIELD + SUBMIT_PLACEHOLDERS)
  })
})
