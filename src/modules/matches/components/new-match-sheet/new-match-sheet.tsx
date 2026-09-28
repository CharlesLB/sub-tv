'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/icon/icon'
import { newMatchSheetStyles as styles } from './new-match-sheet.styles'

type NewMatchSheetProps = { details: ReactNode; children: ReactNode }

export function NewMatchSheet({ details, children }: NewMatchSheetProps) {
  const router = useRouter()

  return (
    <Dialog.Root defaultOpen onOpenChange={(isOpen) => (isOpen ? undefined : router.back())}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content aria-describedby={undefined} className={styles.sheet}>
          <div className={styles.handleArea}>
            <span aria-hidden className={styles.handle} />
          </div>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>Nova partida</Dialog.Title>
            {details}
            <Dialog.Close aria-label="Fechar" className={styles.closeButton}>
              <Icon name="close" size={19} />
            </Dialog.Close>
          </div>
          <div className={styles.body}>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
