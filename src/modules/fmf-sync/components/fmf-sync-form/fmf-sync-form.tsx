'use client'

import { useActionState, useState } from 'react'
import { Icon } from '@/components/ui/icon/icon'
import { FlashToast } from '@/modules/championships/client'
import { type SyncFmfDataResult, syncFmfData } from '../../actions/fmf-sync-actions'
import { fmfSyncFormStyles as styles } from './fmf-sync-form.styles'

const IDLE_LABEL = 'Atualizar dados da FMF'
const PENDING_LABEL = 'Atualizando dados da FMF…'

const toastMessageOf = (result: SyncFmfDataResult): string => (result.ok ? `Dados atualizados · ${result.data.matches} partidas conferidas na FMF` : result.error)

export function FmfSyncForm() {
  const [result, action, isPending] = useActionState(syncFmfData, null)
  const [dismissedResult, setDismissedResult] = useState<SyncFmfDataResult | null>(null)
  const label = isPending ? PENDING_LABEL : IDLE_LABEL
  const visibleResult = result !== dismissedResult ? result : null

  return (
    <form action={action} className={styles.form}>
      <button type="submit" disabled={isPending} title={label} aria-label={label} className={styles.button}>
        <Icon name="sync" size={18} />
      </button>
      {visibleResult ? <FlashToast message={toastMessageOf(visibleResult)} tone={visibleResult.ok ? 'success' : 'warning'} onClose={() => setDismissedResult(visibleResult)} /> : null}
    </form>
  )
}
