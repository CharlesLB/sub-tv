import type { PlayerMatchState } from '../../state/live-state'

export const reserveMatchStateFixture: PlayerMatchState = {
  onPitch: false,
  goals: 0,
  assists: 0,
  yellowCards: 0,
  sentOff: false,
  sentOffBySecondYellow: false,
  subbedIn: false,
  subbedOut: false,
}

export const subbedOutMatchStateFixture: PlayerMatchState = { ...reserveMatchStateFixture, subbedIn: true, subbedOut: true, goals: 1 }

export const starterMatchStateFixture: PlayerMatchState = { ...reserveMatchStateFixture, onPitch: true }
