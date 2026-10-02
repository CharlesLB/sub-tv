import { fireEvent, render, screen } from '@testing-library/react'
import Link from 'next/link'
import type { AnchorHTMLAttributes } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { IntentLink } from './intent-link'

type LinkDoubleProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean | null }

vi.mock('next/link', async (importOriginal) => ({
  ...(await importOriginal()),
  default: vi.fn(function LinkDouble({ href, prefetch, children, ...anchorProps }: LinkDoubleProps) {
    return (
      <a href={href} data-prefetch={String(prefetch)} {...anchorProps}>
        {children}
      </a>
    )
  }),
}))

const lastPrefetch = () => vi.mocked(Link).mock.lastCall?.[0].prefetch

describe('IntentLink', () => {
  afterEach(() => {
    vi.mocked(Link).mockClear()
  })

  it('renders a link that keeps the default prefetch before the user shows intent', () => {
    render(<IntentLink href="/campeonatos">Campeonatos</IntentLink>)

    expect(screen.getByRole('link', { name: 'Campeonatos' })).toHaveAttribute('href', '/campeonatos')
    expect(lastPrefetch()).toBeNull()
  })

  it('switches to a full prefetch when the pointer rests on the link and still calls its own handler', () => {
    const onMouseEnter = vi.fn()

    render(
      <IntentLink href="/campeonatos" onMouseEnter={onMouseEnter}>
        Campeonatos
      </IntentLink>,
    )

    fireEvent.mouseEnter(screen.getByRole('link', { name: 'Campeonatos' }))

    expect(lastPrefetch()).toBe(true)
    expect(onMouseEnter).toHaveBeenCalledOnce()
  })

  it('switches to a full prefetch when the link receives keyboard focus', () => {
    render(<IntentLink href="/campeonatos">Campeonatos</IntentLink>)

    fireEvent.focus(screen.getByRole('link', { name: 'Campeonatos' }))

    expect(lastPrefetch()).toBe(true)
  })

  it('switches to a full prefetch when a finger touches the link', () => {
    render(<IntentLink href="/campeonatos">Campeonatos</IntentLink>)

    fireEvent.touchStart(screen.getByRole('link', { name: 'Campeonatos' }))

    expect(lastPrefetch()).toBe(true)
  })
})
