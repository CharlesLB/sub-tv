export const AUDIT_ACTION = {
  SIGN_IN: 'entrou',
  SIGN_OUT: 'saiu',
  PLAYER_PROFILE_UPDATED: 'ficha_do_jogador_alterada',
  CURIOSITY_ADDED: 'curiosidade_adicionada',
  CURIOSITY_REMOVED: 'curiosidade_removida',
  MANUAL_PLAYER_CREATED: 'jogador_cadastrado',
  BROADCAST_MATCH_CREATED: 'transmissao_criada',
  BROADCAST_CLOSED: 'transmissao_encerrada',
  LIVE_EVENT_RECORDED: 'evento_registrado',
  SUBSTITUTION_APPLIED: 'substituicao_registrada',
  LIVE_EVENT_REVERTED: 'evento_desfeito',
  ASSIST_ATTACHED: 'assistencia_registrada',
  LIVE_CLOCK_UPDATED: 'cronometro_alterado',
  LINEUP_POSITION_UPDATED: 'posicao_na_prancheta_alterada',
  USER_CREATED: 'usuario_criado',
  USER_PASSWORD_RESET: 'senha_redefinida',
  USER_ACTIVATED: 'usuario_ativado',
  USER_DEACTIVATED: 'usuario_desativado',
  CHAMPIONSHIP_CREATED: 'campeonato_criado',
} as const

export type AuditAction = (typeof AUDIT_ACTION)[keyof typeof AUDIT_ACTION]

export const AUDIT_ENTITY = {
  USER: 'usuario',
  PLAYER: 'jogador',
  MATCH: 'partida',
  CHAMPIONSHIP: 'campeonato',
} as const

export type AuditEntity = (typeof AUDIT_ENTITY)[keyof typeof AUDIT_ENTITY]
