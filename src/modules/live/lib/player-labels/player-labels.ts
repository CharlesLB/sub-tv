import { PLAYER_POSITION, type PlayerPosition, PREFERRED_FOOT, type PreferredFoot } from '@/modules/matches/client'

const POSITION_LABEL: Record<PlayerPosition, string> = {
  [PLAYER_POSITION.GOALKEEPER]: 'Goleiro',
  [PLAYER_POSITION.CENTER_BACK]: 'Zagueiro',
  [PLAYER_POSITION.FULL_BACK]: 'Lateral',
  [PLAYER_POSITION.DEFENSIVE_MIDFIELDER]: 'Volante',
  [PLAYER_POSITION.MIDFIELDER]: 'Meia',
  [PLAYER_POSITION.FORWARD]: 'Atacante',
}

const FOOT_LABEL: Record<PreferredFoot, string> = {
  [PREFERRED_FOOT.RIGHT]: 'Pé direito',
  [PREFERRED_FOOT.LEFT]: 'Pé canhoto',
  [PREFERRED_FOOT.BOTH]: 'Ambidestro',
}

export const positionLabel = (position: PlayerPosition | null): string | null => (position ? POSITION_LABEL[position] : null)

export const footLabel = (foot: PreferredFoot | null): string | null => (foot ? FOOT_LABEL[foot] : null)
