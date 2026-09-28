'use client'

import { RouteError } from '@/modules/platform/client'

export default function PlatformError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <RouteError retry={retry} />
}
