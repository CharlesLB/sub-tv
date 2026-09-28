'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useActionState, useState } from 'react'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { type CreateChampionshipResult, createChampionship } from '../../actions/championship-actions'
import { CATEGORIES, type Category, categoryBackgroundClass, categoryBorderClass, categoryLabel } from '../../categories'
import { showFlashMessage } from '../../flash-message/flash-message'
import { CHAMPIONSHIP_NAME_MAX_LENGTH, CHAMPIONSHIP_PHASE_MAX_LENGTH, CHAMPIONSHIP_YEAR_MAX, CHAMPIONSHIP_YEAR_MIN } from '../../schemas'
import type { CategoryClubsVM } from '../../types'
import { ClubPicker } from '../club-picker/club-picker'
import { FlashToast } from '../flash-toast/flash-toast'

const LABEL_CLASS = 'mb-[6px] block text-[10.3px] font-semibold tracking-[-.01em] text-tx4'
const INPUT_CLASS = 'h-10 w-full rounded-card border border-bd2 bg-bg px-3 text-[13px] text-tx outline-none placeholder:text-tx5 focus-visible:border-tx3'
const DEFAULT_PHASE = '1ª FASE · RODADA 1'
const INCOMPLETE_MESSAGE = 'Defina nome e categoria do campeonato'

type NewChampionshipPanelProps = {
  initialCategory: Category
  defaultYear: number
  clubs: CategoryClubsVM
  onClose: () => void
}

const scrollIntoViewOnMount = (element: HTMLFormElement | null) => element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })

export function NewChampionshipPanel({ initialCategory, defaultYear, clubs, onClose }: NewChampionshipPanelProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [category, setCategory] = useState<Category>(initialCategory)
  const [selectedClubIds, setSelectedClubIds] = useState<string[]>([])
  const [warning, setWarning] = useState<string | null>(null)
  const isComplete = name.trim() !== ''

  const submitChampionship = async (previous: CreateChampionshipResult | null, formData: FormData): Promise<CreateChampionshipResult | null> => {
    const result = await createChampionship(previous, formData)
    if (!result.ok) return result
    showFlashMessage(`Campeonato criado · ${categoryLabel[category]}`)
    router.push(routes.championship(result.data.seasonId))

    return null
  }

  const [state, formAction, isPending] = useActionState(submitChampionship, null)
  const failure = state?.ok === false ? (Object.values(state.fieldErrors ?? {})[0]?.[0] ?? state.error) : null

  const blockIncomplete = (event: FormEvent<HTMLFormElement>) => {
    if (isComplete) return
    event.preventDefault()
    setWarning(INCOMPLETE_MESSAGE)
  }

  const chooseCategory = (nextCategory: Category) => {
    setCategory(nextCategory)
    setSelectedClubIds([])
  }

  const toggleClub = (clubId: string) => setSelectedClubIds((current) => (current.includes(clubId) ? current.filter((selected) => selected !== clubId) : [...current, clubId]))

  return (
    <form ref={scrollIntoViewOnMount} action={formAction} onSubmit={blockIncomplete} className="flex animate-rise-in flex-col gap-4 bg-pan2 p-5 chamfer mobile:p-[14px]">
      <h2 className="text-[13.5px] font-bold tracking-[-.01em]">Novo campeonato</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[14px]">
        <label>
          <span className={LABEL_CLASS}>Nome</span>
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={CHAMPIONSHIP_NAME_MAX_LENGTH}
            autoComplete="off"
            placeholder="ex.: COPA DO VALE"
            className={INPUT_CLASS}
          />
        </label>
        <div role="group" aria-label="Categoria">
          <span className="mb-[6px] block text-[10.3px] font-semibold tracking-[-.01em] text-am">Categoria · obrigatória</span>
          <input type="hidden" name="category" value={category} />
          <div className="flex gap-2">
            {CATEGORIES.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={option === category}
                onClick={() => chooseCategory(option)}
                className={cn(
                  'h-10 flex-1 rounded-card border text-[11.7px] font-bold tracking-[-.01em] transition-colors duration-[140ms]',
                  option === category ? cn('text-bg', categoryBackgroundClass[option], categoryBorderClass[option]) : 'border-bd2 bg-transparent text-tx2 hover:border-bd3',
                )}
              >
                {categoryLabel[option]}
              </button>
            ))}
          </div>
        </div>
        <label>
          <span className={LABEL_CLASS}>Temporada</span>
          <input name="year" type="number" inputMode="numeric" defaultValue={defaultYear} min={CHAMPIONSHIP_YEAR_MIN} max={CHAMPIONSHIP_YEAR_MAX} className={cn(INPUT_CLASS, 'nums')} />
        </label>
        <label>
          <span className={LABEL_CLASS}>Fase</span>
          <input name="phase" defaultValue={DEFAULT_PHASE} maxLength={CHAMPIONSHIP_PHASE_MAX_LENGTH} placeholder="ex.: 1ª FASE · RODADA 1" className={INPUT_CLASS} />
        </label>
      </div>
      <div>
        <span className={cn(LABEL_CLASS, 'flex items-baseline justify-between gap-3')}>
          <span>Times participantes · opcional</span>
          <span className="nums">{selectedClubIds.length} selecionados</span>
        </span>
        <ClubPicker clubs={clubs[category]} selectedClubIds={selectedClubIds} onToggle={toggleClub} />
        <p className="mt-2 text-[11.5px] leading-[1.45] text-tx4">O elenco de cada time é copiado da última temporada do clube nesta categoria.</p>
      </div>
      {failure ? (
        <p role="alert" className="text-[12px] text-vm">
          {failure}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-[14px]">
        <button
          type="submit"
          disabled={isPending}
          className={cn('h-11 px-5 text-[12.6px] font-bold tracking-[-.01em]', isComplete ? 'cursor-pointer bg-ac text-bg' : 'cursor-not-allowed bg-bd2 text-tx4', isPending ? 'opacity-70' : null)}
        >
          {isPending ? 'Criando…' : 'Criar campeonato'}
        </button>
        <button type="button" onClick={onClose} className="h-11 rounded-card border border-bd2 bg-transparent px-[18px] text-[11.7px] font-bold tracking-[-.01em] text-tx2 hover:text-tx">
          Cancelar
        </button>
        <span className="text-[13px] text-pretty text-tx4">A categoria define os times, elencos, partidas e a tabela do campeonato — e não muda depois de criado.</span>
      </div>
      {warning ? <FlashToast message={warning} tone="warning" onClose={() => setWarning(null)} /> : null}
    </form>
  )
}
