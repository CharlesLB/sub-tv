import type { ActionResult } from '@/lib/actions/result'
import { Icon } from '@/components/ui/icon/icon'
import { formMessageStyles as styles } from './form-message.styles'

type FormMessageProps = { state: ActionResult<unknown> | null; successMessage?: string | undefined }

export function FormMessage({ state, successMessage }: FormMessageProps) {
  if (state?.ok === false) {
    return (
      <p role="alert" className={styles.error}>
        <Icon name="error" size={15} />
        {state.error}
      </p>
    )
  }

  if (state?.ok === true && successMessage) {
    return (
      <p role="status" className={styles.success}>
        <Icon name="checkCircle" size={15} />
        {successMessage}
      </p>
    )
  }

  return null
}
