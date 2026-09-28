'use client'

import { useSyncExternalStore } from 'react'
import { clearFlashMessage, readFlashMessage, subscribeToFlashMessage } from '../../flash-message/flash-message'
import { FlashToast } from '../flash-toast/flash-toast'

const readNothingOnServer = () => null

export function FlashToastHost() {
  const message = useSyncExternalStore(subscribeToFlashMessage, readFlashMessage, readNothingOnServer)

  return message ? <FlashToast message={message} tone="success" onClose={clearFlashMessage} /> : null
}
