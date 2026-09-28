import Link from 'next/link'
import type { ReactNode } from 'react'
import { Crest } from '@/components/ui/crest/crest'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { CategoryTag, categoryBorderClass, categoryLabel, categoryTextClass, otherCategory, type Category } from '@/modules/championships/client'
import type { SquadPlayerVM, TeamSquadVM } from '../../types'
import { CuriosityList } from '../curiosity-list/curiosity-list'
import { PlayerProfileForm } from '../player-profile-form/player-profile-form'
import { PlayerProfileSummary } from '../player-profile-summary/player-profile-summary'
import { SignInToEdit } from '../sign-in-to-edit/sign-in-to-edit'

const LABEL_CLASS = 'mb-[6px] block text-[10.3px] font-semibold tracking-[-.01em] text-tx4'
const READ_ONLY_INPUT_CLASS = 'h-10 w-full cursor-not-allowed rounded-card border border-bd2 bg-bg px-3 text-[13px] text-tx2'
const FMF_SOURCE_HINT = 'Vem das súmulas da FMF'

type PlayerSheetProps = {
  player: SquadPlayerVM
  squad: TeamSquadVM
  categoryFilter: Category | undefined
  canEdit: boolean
  lastChange: ReactNode
  onClose: () => void
}

export function PlayerSheet({ player, squad, categoryFilter, canEdit, lastChange, onClose }: PlayerSheetProps) {
  const category = categoryLabel[squad.category]
  const siblingCategory = otherCategory[squad.category]
  const siblingHref = routes.squads({
    year: squad.year,
    category: categoryFilter ? siblingCategory : undefined,
    teamKey: squad.otherCategoryKey,
    playerId: player.id,
  })

  return (
    <div className="flex flex-col gap-[14px] px-5 py-[18px]">
      <button
        type="button"
        onClick={onClose}
        className="hidden h-[34px] items-center gap-[6px] self-end rounded-card border border-bd2 px-3 text-[10.5px] tracking-[.05em] text-tx3 mobile:flex"
      >
        Fechar ✕
      </button>
      <div className="flex flex-wrap items-center gap-3">
        <Crest color={squad.badge.color} imagePath={squad.badge.crestPath} width={20} />
        <h2 className="text-[14.4px] font-bold tracking-[-.01em]">Ficha do jogador</h2>
        <CategoryTag category={squad.category} size="extraLarge" className="text-[12.5px]" />
      </div>
      <div className="grid grid-cols-[90px_minmax(0,1fr)] gap-3">
        <label title={FMF_SOURCE_HINT}>
          <span className={LABEL_CLASS}>Número</span>
          <input disabled value={player.shirtNumber ?? '—'} className={cn(READ_ONLY_INPUT_CLASS, 'nums')} />
        </label>
        <label title={FMF_SOURCE_HINT}>
          <span className={LABEL_CLASS}>Nome</span>
          <input disabled value={player.fullName} className={READ_ONLY_INPUT_CLASS} />
        </label>
      </div>
      {canEdit ? (
        <PlayerProfileForm player={player} teamName={squad.badge.name} category={squad.category} />
      ) : (
        <PlayerProfileSummary player={player} teamName={squad.badge.name} category={squad.category} />
      )}
      {player.isInOtherCategory ? (
        <Link
          href={siblingHref}
          scroll={false}
          className={cn(
            'mt-1 inline-flex h-[34px] items-center self-start rounded-card border px-3 text-[10.3px] font-bold tracking-[-.01em]',
            categoryBorderClass[siblingCategory],
            categoryTextClass[siblingCategory],
          )}
        >
          Ver este atleta no {categoryLabel[siblingCategory]}
        </Link>
      ) : null}
      {lastChange}
      <CuriosityList playerId={player.id} curiosities={player.curiosities} canEdit={canEdit} />
      {canEdit ? null : <SignInToEdit returnTo={routes.squads({ year: squad.year, category: categoryFilter, teamKey: squad.key, playerId: player.id })} />}
      <p className="text-[12.5px] leading-[1.5] text-pretty text-tx4">Curiosidades pertencem a este vínculo e só aparecem em partidas da categoria {category}.</p>
    </div>
  )
}
