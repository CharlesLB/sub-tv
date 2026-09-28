import type { ActionResult } from '@/lib/actions/result'
import { Icon } from '@/components/ui/icon/icon'

type FormMessageProps = { state: ActionResult<unknown> | null; successMessage?: string | undefined }

export function FormMessage({ state, successMessage }: FormMessageProps) {
  if (state?.ok === false) {
    return (
      <p role="alert" className="m-0 flex items-center gap-[6px] text-[11.5px] text-vm">
        <Icon name="error" size={15} />
        {state.error}
      </p>
    )
  }

  if (state?.ok === true && successMessage) {
    return (
      <p role="status" className="m-0 flex items-center gap-[6px] text-[11.5px] text-ac2">
        <Icon name="checkCircle" size={15} />
        {successMessage}
      </p>
    )
  }

  return null
}
