import { SIDE } from '@/modules/matches/client'
import type { BoardInteractions } from '../../interaction/use-board-interactions'
import { BenchColumn } from '../bench-column/bench-column'
import { Pitch } from '../pitch/pitch'
import { boardAreaStyles as styles } from './board-area.styles'

type BoardAreaProps = { interactions: BoardInteractions; isCompact: boolean }

export function BoardArea({ interactions, isCompact }: BoardAreaProps) {
  return (
    <div className={styles.board}>
      <BenchColumn side={SIDE.HOME} interactions={interactions} />
      <Pitch interactions={interactions} isCompact={isCompact} />
      <BenchColumn side={SIDE.AWAY} interactions={interactions} />
    </div>
  )
}
