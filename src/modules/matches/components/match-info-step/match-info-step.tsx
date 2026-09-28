import { useId } from 'react'
import { cn } from '@/lib/utils/cn'
import type { InformationField } from '../../wizard-reducer/wizard-reducer'
import { WizardNotice } from '../wizard-notice/wizard-notice'

type FieldDefinition = { field: InformationField; label: string; type: 'date' | 'time' | 'text'; placeholder?: string; inputMode?: 'numeric'; isWide?: boolean }

const FIELDS: FieldDefinition[] = [
  { field: 'date', label: 'Data', type: 'date' },
  { field: 'time', label: 'Horário', type: 'time', placeholder: '10:00' },
  { field: 'round', label: 'Rodada', type: 'text', inputMode: 'numeric' },
  { field: 'venue', label: 'Local', type: 'text', placeholder: 'Arena do vale · campo 2', isWide: true },
]

type MatchInfoStepProps = {
  values: Record<InformationField, string>
  notice: string | null
  onChange: (field: InformationField, value: string) => void
}

export function MatchInfoStep({ values, notice, onChange }: MatchInfoStepProps) {
  const idPrefix = useId()

  return (
    <div className="flex max-w-[820px] animate-fade-up flex-col gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,180px),1fr))] gap-4 bg-pan2 p-5 chamfer mobile:p-4">
        {FIELDS.map((definition) => (
          <div key={definition.field} className={cn(definition.isWide && 'col-span-full')}>
            <label htmlFor={`${idPrefix}-${definition.field}`} className="mb-[6px] block text-[10.3px] font-semibold tracking-[-.01em] text-tx4">
              {definition.label}
            </label>
            <input
              id={`${idPrefix}-${definition.field}`}
              type={definition.type}
              value={values[definition.field]}
              placeholder={definition.placeholder}
              inputMode={definition.inputMode}
              maxLength={definition.field === 'round' ? 2 : 120}
              required
              onChange={(event) => onChange(definition.field, event.target.value)}
              className="box-border h-[42px] w-full rounded-card border border-bd2 bg-bg px-3 text-[13px] text-tx transition-colors focus:border-tx"
            />
          </div>
        ))}
      </div>
      {notice ? <WizardNotice icon="info" text={notice} /> : null}
    </div>
  )
}
