import { describe, expect, it } from 'vitest'
import { staggeredRowOf } from './staggered-row'

const DELAY_STEP_MS = 40

describe('staggeredRowOf', () => {
  it('paints the first row with the even background and no delay', () => {
    expect(staggeredRowOf(0, DELAY_STEP_MS)).toEqual({ className: 'bg-pan', style: { animationDelay: '0ms' } })
  })

  it('paints an odd row with the alternate background and delays it by its position', () => {
    expect(staggeredRowOf(3, DELAY_STEP_MS)).toEqual({ className: 'bg-pan0', style: { animationDelay: '120ms' } })
  })

  it('caps the delay of rows far down the list', () => {
    expect(staggeredRowOf(40, DELAY_STEP_MS).style).toEqual({ animationDelay: '400ms' })
  })
})
