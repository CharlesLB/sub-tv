import type { PlayerPosition, PreferredFoot } from './types'

export const positionLabel: Record<PlayerPosition, string> = {
  goleiro: 'Goleiro',
  zagueiro: 'Zagueiro',
  lateral: 'Lateral',
  volante: 'Volante',
  meia: 'Meia',
  atacante: 'Atacante',
}

export const positionAbbreviation: Record<PlayerPosition, string> = {
  goleiro: 'Gol',
  zagueiro: 'Zag',
  lateral: 'Lat',
  volante: 'Vol',
  meia: 'Mei',
  atacante: 'Ata',
}

export const footLabel: Record<PreferredFoot, string> = {
  destro: 'Destro',
  canhoto: 'Canhoto',
  ambidestro: 'Ambidestro',
}
