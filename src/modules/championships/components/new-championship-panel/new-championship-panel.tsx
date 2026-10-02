'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useActionState, useState } from 'react'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { pluralize } from '@/lib/utils/pluralize/pluralize'
import { NavigationProgress } from '@/components/ui/navigation-progress/navigation-progress'
import { type CreateChampionshipResult, createChampionship } from '../../actions/championship-actions'
import { CATEGORIES, type Category, categoryBackgroundClass, categoryBorderClass, categoryLabel } from '../../lib/categories/categories'
import { showFlashMessage } from '../../lib/flash-message/flash-message'
import { CHAMPIONSHIP_NAME_MAX_LENGTH, CHAMPIONSHIP_PHASE_MAX_LENGTH, CHAMPIONSHIP_YEAR_MAX, CHAMPIONSHIP_YEAR_MIN } from '../../schemas'
import type { CategoryClubsVM } from '../../types'
import { ClubPicker } from '../club-picker/club-picker'
import { FlashToast } from '../flash-toast/flash-toast'
import { newChampionshipPanelStyles as styles } from './new-championship-panel.styles'

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

    return result
  }

  const [state, formAction, isPending] = useActionState(submitChampionship, null)
  const isOpeningChampionship = state?.ok === true
  const isBusy = isPending || isOpeningChampionship
  const submitLabel = isOpeningChampionship ? 'Abrindo…' : isPending ? 'Criando…' : 'Criar campeonato'
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

  const hideWarning = () => setWarning(null)

  const toggleClub = (clubId: string) => setSelectedClubIds((current) => (current.includes(clubId) ? current.filter((selected) => selected !== clubId) : [...current, clubId]))

  return (
    <form ref={scrollIntoViewOnMount} action={formAction} onSubmit={blockIncomplete} className={styles.form}>
      <h2 className={styles.title}>Novo campeonato</h2>
      <div className={styles.fields}>
        <label>
          <span className={styles.label}>Nome</span>
          <input
            name="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={CHAMPIONSHIP_NAME_MAX_LENGTH}
            autoComplete="off"
            placeholder="ex.: COPA DO VALE"
            className={styles.input}
          />
        </label>
        <fieldset aria-label="Categoria">
          <span className={styles.requiredLabel}>Categoria · obrigatória</span>
          <input type="hidden" name="category" value={category} />
          <div className={styles.categoryOptions}>
            {CATEGORIES.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={option === category}
                onClick={() => chooseCategory(option)}
                className={cn(styles.categoryOption, option === category ? cn(styles.categoryOptionSelected, categoryBackgroundClass[option], categoryBorderClass[option]) : styles.categoryOptionIdle)}
              >
                {categoryLabel[option]}
              </button>
            ))}
          </div>
        </fieldset>
        <label>
          <span className={styles.label}>Temporada</span>
          <input name="year" type="number" inputMode="numeric" defaultValue={defaultYear} min={CHAMPIONSHIP_YEAR_MIN} max={CHAMPIONSHIP_YEAR_MAX} className={cn(styles.input, styles.yearInput)} />
        </label>
        <label>
          <span className={styles.label}>Fase</span>
          <input name="phase" defaultValue={DEFAULT_PHASE} maxLength={CHAMPIONSHIP_PHASE_MAX_LENGTH} placeholder="ex.: 1ª FASE · RODADA 1" className={styles.input} />
        </label>
      </div>
      <div>
        <span className={cn(styles.label, styles.clubsLabel)}>
          <span>Times participantes · opcional</span>
          <span className={styles.selectedCount}>{pluralize(selectedClubIds.length, 'selecionado', 'selecionados')}</span>
        </span>
        <ClubPicker clubs={clubs[category]} selectedClubIds={selectedClubIds} onToggle={toggleClub} />
        <p className={styles.clubsHint}>O elenco de cada time é copiado da última temporada do clube nesta categoria.</p>
      </div>
      {failure ? (
        <p role="alert" className={styles.failure}>
          {failure}
        </p>
      ) : null}
      <div className={styles.actions}>
        <button type="submit" disabled={isBusy} className={cn(styles.submitButton, isComplete ? styles.submitButtonReady : styles.submitButtonIncomplete, isBusy ? styles.submitButtonPending : null)}>
          {submitLabel}
        </button>
        <button type="button" onClick={onClose} className={styles.cancelButton}>
          Cancelar
        </button>
        <span className={styles.categoryNotice}>A categoria define os times, elencos, partidas e a tabela do campeonato — e não muda depois de criado.</span>
      </div>
      {warning ? <FlashToast key={warning} message={warning} tone="warning" onClose={hideWarning} /> : null}
      <NavigationProgress isActive={isBusy} />
    </form>
  )
}
