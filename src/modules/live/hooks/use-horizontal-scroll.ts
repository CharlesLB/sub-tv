'use client'

import { useEffect, useEffectEvent, useState } from 'react'

const EDGE_TOLERANCE_PX = 2
const OVERFLOW_TOLERANCE_PX = 4
const MINIMUM_SCROLL_STEP_PX = 240
const SCROLL_STEP_RATIO = 0.8

export type ScrollEdges = { canScroll: boolean; atStart: boolean; atEnd: boolean }

const INITIAL_EDGES: ScrollEdges = { canScroll: false, atStart: true, atEnd: true }

const edgesOf = (element: HTMLElement): ScrollEdges => ({
  canScroll: element.scrollWidth > element.clientWidth + OVERFLOW_TOLERANCE_PX,
  atStart: element.scrollLeft <= EDGE_TOLERANCE_PX,
  atEnd: element.scrollLeft + element.clientWidth >= element.scrollWidth - EDGE_TOLERANCE_PX,
})

const sameEdges = (left: ScrollEdges, right: ScrollEdges): boolean => left.canScroll === right.canScroll && left.atStart === right.atStart && left.atEnd === right.atEnd

export const useHorizontalScroll = () => {
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null)
  const [content, setContent] = useState<HTMLDivElement | null>(null)
  const [edges, setEdges] = useState<ScrollEdges>(INITIAL_EDGES)

  const syncEdges = () => {
    if (!viewport) return
    const next = edgesOf(viewport)
    setEdges((current) => (sameEdges(current, next) ? current : next))
  }

  const handleResize = useEffectEvent(syncEdges)

  useEffect(() => {
    if (!viewport) return
    const observer = new ResizeObserver(() => handleResize())
    observer.observe(viewport)
    if (content) observer.observe(content)

    return () => observer.disconnect()
  }, [viewport, content])

  const scrollBy = (direction: 1 | -1) => {
    if (!viewport) return
    viewport.scrollBy({ left: direction * Math.max(MINIMUM_SCROLL_STEP_PX, viewport.clientWidth * SCROLL_STEP_RATIO), behavior: 'smooth' })
  }

  return { edges, viewportRef: setViewport, contentRef: setContent, onScroll: syncEdges, scrollBy }
}
