import * as R from 'remeda'
import { barHeightPercent, shortYear } from '../../stat-format/stat-format'

const MINIMUM_BAR_PERCENT = 6

type SeasonBar = { year: number; value: number }

type SeasonBarChartProps = { title: string; bars: SeasonBar[]; color: string; trackHeightClass: string }

export function SeasonBarChart({ title, bars, color, trackHeightClass }: SeasonBarChartProps) {
  const maximum = Math.max(1, ...bars.map((bar) => bar.value))
  const chronologicalBars = R.sortBy(bars, (bar) => bar.year)

  return (
    <figure aria-label={title} className="m-0 flex flex-col gap-[11px] rounded-card border border-bd bg-pan px-4 py-[15px]">
      <figcaption className="text-[13.5px] font-bold tracking-[-.01em] text-tx2">{title}</figcaption>
      <div className="flex items-end gap-[6px]">
        {chronologicalBars.map((bar) => (
          <span key={bar.year} title={`${bar.year}: ${bar.value}`} className="flex max-w-[78px] min-w-0 flex-1 flex-col items-center gap-[5px]">
            <span className="text-[9.5px] text-tx4 nums">{bar.value}</span>
            <span className={`flex w-full flex-none items-end ${trackHeightClass}`}>
              <span
                className="block w-full flex-none opacity-72 transition-[height] duration-300 ease-out-soft"
                style={{ height: `${barHeightPercent(bar.value, maximum, MINIMUM_BAR_PERCENT)}%`, background: color }}
              />
            </span>
            <span className="text-[9.5px] text-tx5 nums">{shortYear(bar.year)}</span>
          </span>
        ))}
      </div>
    </figure>
  )
}
