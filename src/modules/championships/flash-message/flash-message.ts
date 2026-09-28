type FlashState = { message: string | null }

const flashState: FlashState = { message: null }
const listeners = new Set<() => void>()

const notifyListeners = () => Array.from(listeners).map((listener) => listener())

export const showFlashMessage = (message: string) => {
  flashState.message = message
  notifyListeners()
}

export const clearFlashMessage = () => {
  flashState.message = null
  notifyListeners()
}

export const readFlashMessage = (): string | null => flashState.message

export const subscribeToFlashMessage = (listener: () => void) => {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}
