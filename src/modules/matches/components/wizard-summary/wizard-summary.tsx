import { Crest } from '@/components/ui/crest/crest'
import { type Category, CategoryTag } from '@/modules/championships/client'

export type SummarySideVM = { key: string; name: string; color: string; crestPath: string | null; lineupCount: string }

type WizardSummaryProps = {
  sides: SummarySideVM[]
  lines: string[]
  category: Category
}

const SECTION_LABEL_CLASS = 'text-[9px] font-semibold tracking-[-.01em] text-tx4'

export function WizardSummary({ sides, lines, category }: WizardSummaryProps) {
  return (
    <section aria-label="Resumo da partida" className="flex flex-none animate-rise-in flex-wrap items-start gap-6 border-t border-bd2 bg-pan2 px-5 py-4 mobile:gap-4 mobile:px-3">
      <div className="flex min-w-[200px] flex-col gap-2">
        <span className={SECTION_LABEL_CLASS}>Confronto</span>
        {sides.map((side) => (
          <div key={side.key} className="flex min-w-0 items-center gap-[10px]">
            <Crest color={side.color} imagePath={side.crestPath} width={14} />
            <span className="min-w-0 truncate text-[13.5px] font-bold tracking-[-.01em]">{side.name}</span>
            <span className="ml-auto text-[10.5px] whitespace-nowrap text-tx4">{side.lineupCount}</span>
          </div>
        ))}
      </div>
      <div className="flex min-w-[220px] flex-col gap-[7px] border-l border-bd2 pl-6 mobile:min-w-0 mobile:border-l-0 mobile:pl-0">
        <span className={SECTION_LABEL_CLASS}>Quando e onde</span>
        {lines.map((line, index) => (
          <span key={`${line}-${index}`} className="truncate text-[11.5px] whitespace-nowrap text-tx2">
            {line}
          </span>
        ))}
      </div>
      <div className="flex min-w-[180px] flex-col gap-[9px] border-l border-bd2 pl-6 mobile:border-l-0 mobile:pl-0">
        <span className={SECTION_LABEL_CLASS}>Categoria</span>
        <CategoryTag category={category} size="extraLarge" className="self-start" />
        <span className="text-[11.5px] leading-[1.45] text-pretty text-tx4">Herdada do campeonato — times e elencos são exclusivos dela.</span>
      </div>
    </section>
  )
}
