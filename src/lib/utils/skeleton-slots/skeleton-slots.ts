const SKELETON_SLOT_IDS = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'] as const

export type SkeletonSlot = { slotId: string; order: number }

export const skeletonSlots = (count: number): SkeletonSlot[] => {
  if (count > SKELETON_SLOT_IDS.length) throw new Error(`skeletonSlots supports at most ${SKELETON_SLOT_IDS.length} placeholders, received ${count}`)

  return SKELETON_SLOT_IDS.slice(0, count).map((slotId, order) => ({ slotId, order }))
}
