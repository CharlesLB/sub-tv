export type AuditRowVM = {
  id: string
  createdAt: string
  userName: string
  action: string
  actionLabel: string
  entityLabel: string | null
  entityDescription: string | null
  detailsSummary: string
}

export type AuditPageVM = { rows: AuditRowVM[]; page: number; hasNextPage: boolean }

export type AuditUserOptionVM = { id: string; username: string }

export type LastChangeVM = { userName: string; createdAt: string; actionLabel: string }
