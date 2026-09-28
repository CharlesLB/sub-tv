import { Icon } from '@/components/ui/icon/icon'
import type { IconName } from '@/components/ui/icon/icon-paths'

type WizardNoticeProps = { icon: IconName; text: string }

export function WizardNotice({ icon, text }: WizardNoticeProps) {
  return (
    <div className="flex items-start gap-[10px] border-l-[3px] border-ac bg-pan px-4 py-[14px]">
      <Icon name={icon} size={19} className="text-ac" />
      <p className="text-[13.5px] leading-[1.55] text-pretty text-tx2">{text}</p>
    </div>
  )
}
