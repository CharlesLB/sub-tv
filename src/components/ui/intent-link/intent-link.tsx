'use client'

import Link, { type LinkProps } from 'next/link'
import { type FocusEvent, type MouseEvent, type TouchEvent, useState } from 'react'
import { LinkPendingIndicator } from '../link-pending-indicator/link-pending-indicator'

export function IntentLink<RouteType>({ children, onMouseEnter, onFocus, onTouchStart, ...linkProps }: LinkProps<RouteType>) {
  const [hasIntent, setHasIntent] = useState(false)

  const prefetchOnHover = (event: MouseEvent<HTMLAnchorElement>) => {
    setHasIntent(true)
    onMouseEnter?.(event)
  }

  const prefetchOnFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    setHasIntent(true)
    onFocus?.(event)
  }

  const prefetchOnTouch = (event: TouchEvent<HTMLAnchorElement>) => {
    setHasIntent(true)
    onTouchStart?.(event)
  }

  return (
    <Link {...linkProps} prefetch={hasIntent ? true : null} onMouseEnter={prefetchOnHover} onFocus={prefetchOnFocus} onTouchStart={prefetchOnTouch}>
      {children}
      <LinkPendingIndicator />
    </Link>
  )
}
