'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { CARD_COLOR, type CardColor } from '../../state/live-actions'
import { cardPickerStyles as styles } from './card-picker.styles'

type CardPickerProps = { onPick: (color: CardColor) => void; onCancel: () => void }

const CARD_OPTIONS = [
  { color: CARD_COLOR.YELLOW, label: 'Amarelo', borderClass: styles.optionYellowBorder, swatchClass: styles.swatchYellow },
  { color: CARD_COLOR.RED, label: 'Vermelho', borderClass: styles.optionRedBorder, swatchClass: styles.swatchRed },
] as const

export function CardPicker({ onPick, onCancel }: CardPickerProps) {
  const firstOptionRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    firstOptionRef.current?.focus()
  }, [])

  return (
    <div role="dialog" aria-modal="true" aria-label="Escolher cartão" className={styles.dialog}>
      <div className={styles.options}>
        {CARD_OPTIONS.map((option, index) => (
          <button key={option.color} ref={index === 0 ? firstOptionRef : undefined} type="button" onClick={() => onPick(option.color)} className={cn(styles.option, option.borderClass)}>
            <span className={cn(styles.swatch, option.swatchClass)} />
            <span className={styles.optionLabel}>{option.label}</span>
          </button>
        ))}
      </div>
      <button type="button" onClick={onCancel} className={styles.cancel}>
        Cancelar (esc)
      </button>
    </div>
  )
}
