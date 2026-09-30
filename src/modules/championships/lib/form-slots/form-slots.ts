import type { FormResult } from '../../types'

const FORM_SLOT_PREFIX = 'game-'

export type FormSlot = { slotKey: string; result: FormResult }

export const toFormSlots = (form: FormResult[]): FormSlot[] => form.map((result, gameNumber) => ({ slotKey: `${FORM_SLOT_PREFIX}${gameNumber}`, result }))
