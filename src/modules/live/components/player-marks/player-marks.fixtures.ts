import type { PlayerMatchState } from '../../state/live-state'

export const onPitchMatchStateFixture: PlayerMatchState = {
  onPitch: true,
  goals: 0,
  assists: 0,
  yellowCards: 0,
  sentOff: false,
  sentOffBySecondYellow: false,
  subbedIn: false,
  subbedOut: false,
}

export const benchMatchStateFixture: PlayerMatchState = { ...onPitchMatchStateFixture, onPitch: false }

export const busyMatchStateFixture: PlayerMatchState = { ...onPitchMatchStateFixture, goals: 2, assists: 1, yellowCards: 1, subbedIn: true }

export const singleActionsMatchStateFixture: PlayerMatchState = { ...onPitchMatchStateFixture, goals: 1, assists: 1 }

export const directRedMatchStateFixture: PlayerMatchState = { ...onPitchMatchStateFixture, sentOff: true }

export const secondYellowMatchStateFixture: PlayerMatchState = { ...onPitchMatchStateFixture, yellowCards: 2, sentOff: true, sentOffBySecondYellow: true }

export const doubleYellowMatchStateFixture: PlayerMatchState = { ...onPitchMatchStateFixture, yellowCards: 2 }

export const subbedOutMatchStateFixture: PlayerMatchState = { ...onPitchMatchStateFixture, onPitch: false, subbedOut: true }
