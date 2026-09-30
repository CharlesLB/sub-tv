import * as R from 'remeda'
import { barHeightPercent, shortYear } from '../../lib/stat-format/stat-format'
import { seasonBarChartStyles as styles } from './season-bar-chart.styles'

const MINIMUM_BAR_PERCENT = 6

type SeasonBar = { year: number; value: number }

type SeasonBarChartProps = { title: string; bars: SeasonBar[]; color: string; trackHeightClass: string }

export function SeasonBarChart({ title, bars, color, trackHeightClass }: SeasonBarChartProps) {
  const maximum = Math.max(1, ...bars.map((bar) => bar.value))
  const chronologicalBars = R.sortBy(bars, (bar) => bar.year)

  return (
    <figure aria-label={title} className={styles.chart}>
      <figcaption className={styles.title}>{title}</figcaption>
      <div className={styles.bars}>
        {chronologicalBars.map((bar) => (
          <span key={bar.year} title={`${bar.year}: ${bar.value}`} className={styles.column}>
            <span className={styles.value}>{bar.value}</span>
            <span className={`${styles.track} ${trackHeightClass}`}>
              <span className={styles.bar} style={{ height: `${barHeightPercent(bar.value, maximum, MINIMUM_BAR_PERCENT)}%`, background: color }} />
            </span>
            <span className={styles.year}>{shortYear(bar.year)}</span>
          </span>
        ))}
      </div>
    </figure>
  )
}
