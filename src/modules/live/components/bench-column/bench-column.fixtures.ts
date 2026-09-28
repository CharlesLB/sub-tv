import type { BoardInteractions } from '../../interaction/use-board-interactions'
import { derivePlayerStates } from '../../state/selectors'
import { liveSnapshotFixture } from '../live-board/live-board.fixtures'

const ignoreInteraction = (): void => undefined

export const makeBoardInteractions = (overrides: Partial<BoardInteractions> = {}): BoardInteractions => ({
  fieldRef: { current: null },
  drag: null,
  hover: null,
  menu: null,
  playerStates: derivePlayerStates(liveSnapshotFixture.players, []),
  startDotGesture: ignoreInteraction,
  startBenchGesture: ignoreInteraction,
  activateBenchPlayer: ignoreInteraction,
  openMenu: ignoreInteraction,
  closeMenu: ignoreInteraction,
  showHover: ignoreInteraction,
  hideHover: ignoreInteraction,
  clearTransient: ignoreInteraction,
  ...overrides,
})
