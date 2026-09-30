import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ShareCard } from './share-card'
import { shareCardFixture } from './share-card.fixtures'

describe('ShareCard', () => {
  it('shows the sub.tv wordmark', () => {
    render(<ShareCard {...shareCardFixture} />)

    expect(screen.getByText(/^sub/)).toHaveTextContent('sub.tv')
  })

  it('shows the tagline and the categories it was given', () => {
    render(<ShareCard {...shareCardFixture} />)

    expect(screen.getByText(shareCardFixture.tagline)).toBeInTheDocument()
    expect(screen.getByText(shareCardFixture.categories)).toBeInTheDocument()
  })
})
