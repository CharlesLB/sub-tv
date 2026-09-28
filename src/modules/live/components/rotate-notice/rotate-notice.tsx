import { Icon } from '@/components/ui/icon/icon'

export function RotateNotice() {
  return (
    <div className="mb-3 flex items-center gap-[11px] rounded-card border border-bd2 bg-pan2 px-[13px] py-[11px]">
      <Icon name="screenRotation" size={22} className="text-ac" />
      <span className="flex min-w-0 flex-col gap-[3px]">
        <span className="text-[12.2px] font-bold tracking-[-.01em] text-tx">Gire O celular para A prancheta</span>
        <span className="text-[10px] tracking-[.06em] text-pretty text-tx4">Na horizontal o campo abre inteiro e dá para arrastar os jogadores.</span>
      </span>
    </div>
  )
}
