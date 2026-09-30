import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '../../lib/categories/categories'
import { CategoryTag } from './category-tag'

describe('CategoryTag', () => {
  it('shows the category label with the category color and the small size by default', () => {
    render(<CategoryTag category={CATEGORY.SUB13} />)

    const tag = screen.getByText('SUB-13')
    expect(tag).toHaveClass('border-sub13', 'text-sub13', 'text-[10px]')
  })

  it('applies the requested size and extra class names', () => {
    render(<CategoryTag category={CATEGORY.SUB14} size="extraLarge" className="self-start" />)

    const tag = screen.getByText('SUB-14')
    expect(tag).toHaveClass('border-sub14', 'text-sub14', 'text-[13px]', 'self-start')
  })
})
