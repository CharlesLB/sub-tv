import type { PointerEvent as ReactPointerEvent } from 'react'

const DRAG_THRESHOLD_PX = 6
const PRIMARY_BUTTON = 0

type GestureHandlers = { onDrag: (clientX: number, clientY: number) => void; onRelease: (wasDragged: boolean) => void }

export const startPointerGesture = (event: ReactPointerEvent<HTMLElement>, handlers: GestureHandlers): void => {
  if (event.button !== PRIMARY_BUTTON) return
  event.preventDefault()

  const origin = { x: event.clientX, y: event.clientY }
  const gesture = { wasDragged: false }

  const handleMove = (moveEvent: PointerEvent) => {
    if (!gesture.wasDragged && Math.hypot(moveEvent.clientX - origin.x, moveEvent.clientY - origin.y) > DRAG_THRESHOLD_PX) gesture.wasDragged = true
    if (gesture.wasDragged) handlers.onDrag(moveEvent.clientX, moveEvent.clientY)
  }

  const handleEnd = () => {
    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleEnd)
    window.removeEventListener('pointercancel', handleEnd)
    handlers.onRelease(gesture.wasDragged)
  }

  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleEnd)
  window.addEventListener('pointercancel', handleEnd)
}
