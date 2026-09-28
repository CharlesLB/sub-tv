'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { scoreValueStyles as styles } from './score-value.styles'

type ScoreValueProps = { value: number }

type ScoreChanges = { value: number; changeCount: number }

export function ScoreValue({ value }: ScoreValueProps) {
  const [changes, setChanges] = useState<ScoreChanges>({ value, changeCount: 0 })

  if (changes.value !== value) setChanges({ value, changeCount: changes.changeCount + 1 })

  return (
    <span key={changes.changeCount} className={cn(styles.value, changes.changeCount > 0 && styles.pulsing)}>
      {value}
    </span>
  )
}
