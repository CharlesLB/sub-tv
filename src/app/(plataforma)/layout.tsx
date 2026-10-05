import { type ReactNode, Suspense } from 'react'
import { EditorAccessProvider, isSignedIn, UserChip } from '@/modules/auth'
import { ContextBarStatusProvider, FmfSyncButton, LiveBroadcastChip, PlatformRailSkeleton, RailWithBroadcast } from '@/modules/platform'

const contextBarStatus = (
  <>
    <Suspense fallback={null}>
      <LiveBroadcastChip />
    </Suspense>
    <Suspense fallback={null}>
      <UserChip />
    </Suspense>
    <Suspense fallback={null}>
      <FmfSyncButton />
    </Suspense>
  </>
)

export default function PlatformLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-bg text-tx mobile:flex-col">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-50 top-glow" />
      <Suspense fallback={<PlatformRailSkeleton />}>
        <RailWithBroadcast />
      </Suspense>
      <EditorAccessProvider canEdit={isSignedIn()}>
        <ContextBarStatusProvider status={contextBarStatus}>
          <main className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</main>
        </ContextBarStatusProvider>
      </EditorAccessProvider>
    </div>
  )
}
