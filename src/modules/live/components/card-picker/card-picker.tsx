'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { CARD_COLOR, type CardColor } from '../../state/live-actions'

type CardPickerProps = { onPick: (color: CardColor) => void; onCancel: () => void }

const CARD_OPTIONS = [
  { color: CARD_COLOR.YELLOW, label: 'Amarelo', borderClass: 'border-am', swatchClass: 'bg-am' },
  { color: CARD_COLOR.RED, label: 'Vermelho', borderClass: 'border-vm', swatchClass: 'bg-vm' },
] as const

export function CardPicker({ onPick, onCancel }: CardPickerProps) {
  const firstOptionRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    firstOptionRef.current?.focus()
  }, [])

  return (
    <div role="dialog" aria-modal="true" aria-label="Escolher cartão" className="fixed inset-0 z-[60] flex animate-fade-in flex-col items-center justify-center gap-6 bg-scrim-forte">
      <div className="flex gap-5 mobile:gap-3">
        {CARD_OPTIONS.map((option, index) => (
          <button
            key={option.color}
            ref={index === 0 ? firstOptionRef : undefined}
            type="button"
            onClick={() => onPick(option.color)}
            className={cn('flex h-[150px] w-[230px] flex-col items-center justify-center gap-3 border-[3px] bg-pan text-tx chamfer mobile:h-[120px] mobile:w-[150px]', option.borderClass)}
          >
            <span className={cn('block h-10 w-[30px] rounded-[4px]', option.swatchClass)} />
            <span className="text-[21.6px] font-bold tracking-[-.01em]">{option.label}</span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="rounded-card border border-bd2 bg-transparent px-6 py-[10px] text-[11.7px] font-semibold tracking-[-.01em] text-tx2 hover:border-tx hover:text-tx"
      >
        Cancelar (esc)
      </button>
    </div>
  )
}
