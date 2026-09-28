import { Icon } from '@/components/ui/icon/icon'
import type { OfficialsStripItem } from './officials-strip-items'

type OfficialsStripProps = { items: OfficialsStripItem[] }

export function OfficialsStrip({ items }: OfficialsStripProps) {
  return (
    <div data-screen-label="Ficha e arbitragem" className="flex flex-none flex-wrap items-center justify-center gap-x-[15px] gap-y-[3px] border-b border-bd bg-pan px-4 py-[5px] mobile:hidden">
      {items.map((item) => (
        <div key={item.key} className="flex flex-none items-center gap-[5px]">
          <Icon name={item.icon} size={11} className="text-tx5" />
          <span className="text-[8.6px] font-semibold tracking-[-.01em] whitespace-nowrap text-tx3">{item.label}</span>
          <span className="text-[9.5px] font-bold tracking-[-.01em] whitespace-nowrap text-tx1">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
