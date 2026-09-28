import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { liveSnapshotFixture, silenceLiveStream } from '../components/live-board/live-board.fixtures'
import { LiveMatchProvider } from './live-context'
import { useLiveCommands } from './use-live-commands'

const LiveMatchWrapper = ({ children }: { children: ReactNode }) => <LiveMatchProvider snapshot={liveSnapshotFixture}>{children}</LiveMatchProvider>

describe('useLiveCommands', () => {
  beforeEach(() => silenceLiveStream())

  it('returns the same commands across renders so effects that depend on them do not rerun', () => {
    const { result, rerender } = renderHook(useLiveCommands, { wrapper: LiveMatchWrapper })
    const firstCommands = result.current

    rerender()

    expect(result.current).toBe(firstCommands)
    expect(result.current.startSubstitution).toBe(firstCommands.startSubstitution)
  })
})
