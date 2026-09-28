import { describe, expect, it, vi } from 'vitest'
import { startPrimaryPointerGesture } from './pointer-gesture'

const PRIMARY_BUTTON = 0
const SECONDARY_BUTTON = 2

const pointerStart = (button: number) => ({ button, clientX: 100, clientY: 100, preventDefault: vi.fn() })

const dispatchPointer = (type: string, clientX: number, clientY: number) => window.dispatchEvent(new MouseEvent(type, { clientX, clientY }))

describe('startPrimaryPointerGesture', () => {
  it('ignores a secondary button press', () => {
    const start = pointerStart(SECONDARY_BUTTON)
    const onRelease = vi.fn()

    startPrimaryPointerGesture(start, { onDrag: vi.fn(), onRelease })
    dispatchPointer('pointerup', 100, 100)

    expect(start.preventDefault).not.toHaveBeenCalled()
    expect(onRelease).not.toHaveBeenCalled()
  })

  it('reports a click when the pointer is released without moving past the drag threshold', () => {
    const onDrag = vi.fn()
    const onRelease = vi.fn()

    startPrimaryPointerGesture(pointerStart(PRIMARY_BUTTON), { onDrag, onRelease })
    dispatchPointer('pointermove', 103, 102)
    dispatchPointer('pointerup', 103, 102)

    expect(onDrag).not.toHaveBeenCalled()
    expect(onRelease).toHaveBeenCalledWith(false)
  })

  it('reports each pointer position and a drag once the pointer moves past the threshold', () => {
    const onDrag = vi.fn()
    const onRelease = vi.fn()

    startPrimaryPointerGesture(pointerStart(PRIMARY_BUTTON), { onDrag, onRelease })
    dispatchPointer('pointermove', 140, 100)
    dispatchPointer('pointerup', 140, 100)

    expect(onDrag).toHaveBeenCalledWith({ clientX: 140, clientY: 100 })
    expect(onRelease).toHaveBeenCalledWith(true)
  })
})
