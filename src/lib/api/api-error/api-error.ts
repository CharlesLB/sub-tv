export const HTTP_STATUS = { UNAUTHORIZED: 401, NOT_FOUND: 404, SERVER_ERROR: 500 } as const

export const API_ERROR_CODE = {
  UNAUTHORIZED: 'unauthorized',
  NOT_FOUND: 'not_found',
  SYNC_FAILED: 'sync_failed',
  CRON_NOT_CONFIGURED: 'cron_not_configured',
} as const

type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]

type ApiErrorCode = (typeof API_ERROR_CODE)[keyof typeof API_ERROR_CODE]

export const apiError = (status: HttpStatus, code: ApiErrorCode, message: string): Response => Response.json({ error: { code, message } }, { status })
