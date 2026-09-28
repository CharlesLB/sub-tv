import type { ChangeEvent } from 'react'
import { segmentedChoiceStyles as styles } from './segmented-choice.styles'

type SegmentedOption<TValue extends string> = { value: TValue; label: string }

type SegmentedChoiceProps<TValue extends string> = {
  name: string
  legend: string
  options: SegmentedOption<TValue>[]
  defaultValue: TValue | null
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

export function SegmentedChoice<TValue extends string>({ name, legend, options, defaultValue, onChange }: SegmentedChoiceProps<TValue>) {
  return (
    <fieldset>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.value} className={styles.option}>
            <input type="radio" name={name} value={option.value} defaultChecked={option.value === defaultValue} onChange={onChange} className={styles.radio} />
            <span className={styles.optionLabel}>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
