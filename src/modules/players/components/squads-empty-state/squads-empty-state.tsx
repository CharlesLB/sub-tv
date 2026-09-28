import { Icon } from '@/components/ui/icon/icon'

type SquadsEmptyStateProps = { title: string; description: string }

export function SquadsEmptyState({ title, description }: SquadsEmptyStateProps) {
  return (
    <section className="flex min-h-[300px] min-w-0 flex-[4_1_300px] animate-fade-in flex-col items-center justify-center gap-3 bg-pan2 px-6 py-10 text-center mobile:min-h-0 mobile:flex-1">
      <Icon name="groups" size={28} className="text-tx5" />
      <h2 className="text-[15.3px] font-bold tracking-[-.01em]">{title}</h2>
      <p className="max-w-[360px] text-[12.5px] leading-[1.5] text-pretty text-tx4">{description}</p>
    </section>
  )
}
