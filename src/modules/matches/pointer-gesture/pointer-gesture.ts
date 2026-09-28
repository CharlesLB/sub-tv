import { hasPassedDragThreshold, type PointerPosition } from '../board-geometry/board-geometry'

type GestureHandlers = { onDrag: (pointer: PointerPosition) => void; onRelease: (hasDragged: boolean) => void }

const PRIMARY_BUTTON = 0

export const isPrimaryPointer = (event: { button: number }): boolean => event.button === PRIMARY_BUTTON

export const trackPointerGesture = (start: PointerPosition, { onDrag, onRelease }: GestureHandlers): void => {
  const gesture = { hasDragged: false }
  const handleMove = (event: PointerEvent) => {
    gesture.hasDragged = gesture.hasDragged || hasPassedDragThreshold(start, event)
    if (gesture.hasDragged) onDrag({ clientX: event.clientX, clientY: event.clientY })
  }
  const handleRelease = () => {
    window.removeEventListener('pointermove', handleMove)
    window.removeEventListener('pointerup', handleRelease)
    window.removeEventListener('pointercancel', handleRelease)
    onRelease(gesture.hasDragged)
  }

  window.addEventListener('pointermove', handleMove)
  window.addEventListener('pointerup', handleRelease)
  window.addEventListener('pointercancel', handleRelease)
}
