export type FieldErrors = Partial<Record<string, string[]>>

export type ActionFailure = { ok: false; error: string; fieldErrors?: FieldErrors }

export type ActionResult<TData = void> = { ok: true; data: TData } | ActionFailure

export const ok = <TData>(data: TData): ActionResult<TData> => ({ ok: true, data })

export const fail = (error: string, fieldErrors?: FieldErrors): ActionFailure =>
  fieldErrors ? { ok: false, error, fieldErrors } : { ok: false, error }
