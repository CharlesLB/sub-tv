import { useId } from 'react'
import { cn } from '@/lib/utils/cn'
import type { InformationField } from '../../wizard-reducer/wizard-reducer'
import { WizardNotice } from '../wizard-notice/wizard-notice'
import { matchInfoStepStyles as styles } from './match-info-step.styles'

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
    <div className={styles.step}>
      <div className={styles.fields}>
        {FIELDS.map((definition) => (
          <div key={definition.field} className={cn(definition.isWide && styles.fieldWide)}>
            <label htmlFor={`${idPrefix}-${definition.field}`} className={styles.label}>
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
              className={styles.input}
            />
          </div>
        ))}
      </div>
      {notice ? <WizardNotice icon="info" text={notice} /> : null}
    </div>
  )
}
