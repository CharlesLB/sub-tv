'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/icon/icon'

type NewMatchSheetProps = { details: ReactNode; children: ReactNode }

export function NewMatchSheet({ details, children }: NewMatchSheetProps) {
  const router = useRouter()

  return (
    <Dialog.Root defaultOpen onOpenChange={(isOpen) => (isOpen ? undefined : router.back())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] animate-fade-in bg-scrim" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-x-0 bottom-0 z-[71] flex max-h-[92vh] animate-sheet-up flex-col border-t-2 border-ac bg-bg font-sans text-tx outline-none mobile:max-h-[96dvh]"
        >
          <div className="flex flex-none flex-col items-center bg-pan2 pt-2">
            <span aria-hidden className="h-1 w-[52px] rounded-[2px] bg-bd2" />
          </div>
          <div className="flex flex-none flex-wrap items-center gap-[14px] border-b border-bd bg-pan2 px-5 pt-[10px] pb-3 mobile:gap-[10px] mobile:px-3">
            <Dialog.Title className="text-[15.3px] font-bold tracking-[-.01em]">Nova partida</Dialog.Title>
            {details}
            <Dialog.Close
              aria-label="Fechar"
              className="ml-auto flex size-[34px] flex-none items-center justify-center rounded-card border border-bd2 bg-transparent text-tx2 transition-colors hover:border-tx hover:text-tx"
            >
              <Icon name="close" size={19} />
            </Dialog.Close>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
