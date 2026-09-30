import { cn } from '@/lib/utils/cn'
import { Crest } from '@/components/ui/crest/crest'
import type { Category } from '../../lib/categories/categories'
import type { TopScorerVM } from '../../types'
import { CategoryTag } from '../category-tag/category-tag'
import { topScorersTableStyles as styles } from './top-scorers-table.styles'

const ROW_DELAY_STEP_MS = 28

const HEADERS = [
  { label: '#', className: styles.headerAlignStart },
  { label: 'Atleta', className: styles.headerAlignStart },
  { label: 'Time', className: styles.headerAlignStartWideOnly },
  { label: 'G', className: styles.headerAlignCenter },
  { label: 'J', className: styles.headerAlignCenter },
] as const

type TopScorersTableProps = { scorers: TopScorerVM[]; category: Category }

export function TopScorersTable({ scorers, category }: TopScorersTableProps) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className={styles.title}>Artilharia</span>
        <CategoryTag category={category} size="extraLarge" />
        <span className={styles.hint}>Gols contam apenas nesta categoria.</span>
      </div>
      <div className={styles.table}>
        <div className={cn(styles.grid, styles.headerRow)}>
          {HEADERS.map((header) => (
            <span key={header.label} className={cn(styles.headerCell, header.className)}>
              {header.label}
            </span>
          ))}
        </div>
        {scorers.map((scorer, index) => (
          <div key={`${scorer.playerId}-${scorer.seasonTeamId}`} className={cn(styles.grid, styles.row)} style={{ animationDelay: `${index * ROW_DELAY_STEP_MS}ms` }}>
            <span className={cn(styles.rank, index === 0 ? styles.rankLeader : styles.rankOther)}>{String(index + 1).padStart(2, '0')}</span>
            <div className={styles.athlete}>
              <span className={styles.shirtNumber} style={{ color: scorer.team.color }}>
                {scorer.shirtNumber ?? '–'}
              </span>
              <span className={styles.athleteName}>
                {scorer.name}
                {scorer.nickname ? ` "${scorer.nickname}"` : ''}
              </span>
              {scorer.position ? <span className={styles.position}>{scorer.position}</span> : null}
            </div>
            <div className={styles.team}>
              <Crest color={scorer.team.color} imagePath={scorer.team.crestPath} width={18} />
              <span className={styles.teamName}>{scorer.team.name}</span>
            </div>
            <span className={styles.goals}>{scorer.goals}</span>
            <span className={styles.games}>{scorer.games}</span>
          </div>
        ))}
        {scorers.length === 0 ? <div className={styles.emptyState}>Nenhum gol registrado nas súmulas deste campeonato.</div> : null}
      </div>
      <p className={styles.footnote}>G gols · J jogos · em caso de empate, quem fez os gols em menos jogos aparece na frente.</p>
    </section>
  )
}
