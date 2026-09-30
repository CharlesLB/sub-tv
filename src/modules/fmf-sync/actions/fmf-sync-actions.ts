'use server'

import { updateTag } from 'next/cache'
import { type ActionResult, fail, ok } from '@/lib/actions/result'
import { AUDIT_ACTION, AUDIT_ENTITY, recordAudit } from '@/modules/audit'
import { requireUser } from '@/modules/auth'
import { syncedTagsOf } from '../lib/synced-tags/synced-tags'
import { runNightlyFmfSync } from '../services/fmf-sync-service'

export type SyncFmfDataResult = ActionResult<{ matches: number }>

export async function syncFmfData(_previous: SyncFmfDataResult | null, _formData: FormData): Promise<SyncFmfDataResult> {
  const user = await requireUser()

  try {
    const summary = await runNightlyFmfSync()
    const matches = summary.editions.reduce((total, edition) => total + edition.matches, 0)

    await recordAudit({
      userId: user.id,
      action: AUDIT_ACTION.FMF_DATA_SYNCED,
      entityType: AUDIT_ENTITY.FMF_DATA,
      entityId: summary.runId,
      details: { editions: summary.editions.length, matches, sumulasDownloaded: summary.sumulasDownloaded },
    })

    syncedTagsOf(summary.touchedSeasonIds).map((tag) => updateTag(tag))

    return ok({ matches })
  } catch (error) {
    console.error('atualização manual dos dados da FMF falhou', error)

    return fail('Não foi possível atualizar os dados da FMF. Tente de novo em alguns minutos.')
  }
}
