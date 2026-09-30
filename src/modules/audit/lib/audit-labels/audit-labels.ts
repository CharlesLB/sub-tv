import { AUDIT_ACTION, AUDIT_ENTITY, type AuditAction, type AuditEntity } from '../audit-action/audit-action'

export const AUDIT_ACTION_LABEL: Record<AuditAction, string> = {
  [AUDIT_ACTION.SIGN_IN]: 'Entrou no sistema',
  [AUDIT_ACTION.SIGN_OUT]: 'Saiu do sistema',
  [AUDIT_ACTION.PLAYER_PROFILE_UPDATED]: 'Alterou a ficha do jogador',
  [AUDIT_ACTION.CURIOSITY_ADDED]: 'Adicionou curiosidade',
  [AUDIT_ACTION.CURIOSITY_REMOVED]: 'Removeu curiosidade',
  [AUDIT_ACTION.MANUAL_PLAYER_CREATED]: 'Cadastrou jogador',
  [AUDIT_ACTION.BROADCAST_MATCH_CREATED]: 'Criou transmissão',
  [AUDIT_ACTION.BROADCAST_CLOSED]: 'Encerrou transmissão',
  [AUDIT_ACTION.LIVE_EVENT_RECORDED]: 'Registrou evento',
  [AUDIT_ACTION.SUBSTITUTION_APPLIED]: 'Registrou substituição',
  [AUDIT_ACTION.LIVE_EVENT_REVERTED]: 'Desfez evento',
  [AUDIT_ACTION.ASSIST_ATTACHED]: 'Registrou assistência',
  [AUDIT_ACTION.LIVE_CLOCK_UPDATED]: 'Alterou o cronômetro',
  [AUDIT_ACTION.LINEUP_POSITION_UPDATED]: 'Moveu jogador na prancheta',
  [AUDIT_ACTION.USER_CREATED]: 'Criou usuário',
  [AUDIT_ACTION.USER_PASSWORD_RESET]: 'Redefiniu senha',
  [AUDIT_ACTION.USER_ACTIVATED]: 'Ativou usuário',
  [AUDIT_ACTION.USER_DEACTIVATED]: 'Desativou usuário',
  [AUDIT_ACTION.CHAMPIONSHIP_CREATED]: 'Criou campeonato',
  [AUDIT_ACTION.FMF_DATA_SYNCED]: 'Atualizou os dados da FMF',
}

export const AUDIT_ENTITY_LABEL: Record<AuditEntity, string> = {
  [AUDIT_ENTITY.USER]: 'Usuário',
  [AUDIT_ENTITY.PLAYER]: 'Jogador',
  [AUDIT_ENTITY.MATCH]: 'Partida',
  [AUDIT_ENTITY.CHAMPIONSHIP]: 'Campeonato',
  [AUDIT_ENTITY.FMF_DATA]: 'Dados da FMF',
}

export const AUDIT_ACTIONS: readonly AuditAction[] = Object.values(AUDIT_ACTION)

export const AUDIT_ENTITIES: readonly AuditEntity[] = Object.values(AUDIT_ENTITY)

export const isAuditAction = (value: unknown): value is AuditAction => AUDIT_ACTIONS.some((action) => action === value)

export const isAuditEntity = (value: unknown): value is AuditEntity => AUDIT_ENTITIES.some((entity) => entity === value)

export const actionLabelOf = (action: string): string => (isAuditAction(action) ? AUDIT_ACTION_LABEL[action] : action)
