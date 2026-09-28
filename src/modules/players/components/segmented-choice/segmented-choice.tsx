import type { ChangeEvent } from 'react'

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
      <legend className="mb-[6px] text-[10.3px] font-semibold tracking-[-.01em] text-tx4">{legend}</legend>
      <div className="flex flex-wrap gap-[6px]">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input type="radio" name={name} value={option.value} defaultChecked={option.value === defaultValue} onChange={onChange} className="peer sr-only" />
            <span className="inline-flex h-[30px] items-center rounded-card border border-bd2 px-[11px] text-[9.9px] font-bold tracking-[-.01em] text-tx2 transition-[background,border-color,color] duration-[140ms] peer-checked:border-transparent peer-checked:bg-tx peer-checked:text-bg peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-tx hover:border-bd3 hover:text-tx peer-checked:hover:border-transparent peer-checked:hover:text-bg">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
