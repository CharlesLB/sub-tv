import Link from 'next/link'
import type { ReactNode } from 'react'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils/cn'
import { Crest } from '@/components/ui/crest/crest'
import { type Category, CategoryTag, categoryBorderClass, categoryLabel, categoryTextClass, otherCategory } from '@/modules/championships/client'
import type { SquadPlayerVM, TeamSquadVM } from '../../types'
import { CuriosityList } from '../curiosity-list/curiosity-list'
import { PlayerProfileForm } from '../player-profile-form/player-profile-form'
import { PlayerProfileSummary } from '../player-profile-summary/player-profile-summary'
import { SignInToEdit } from '../sign-in-to-edit/sign-in-to-edit'
import { playerSheetStyles as styles } from './player-sheet.styles'

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
    <div className={styles.sheet}>
      <button type="button" onClick={onClose} className={styles.closeButton}>
        Fechar ✕
      </button>
      <div className={styles.header}>
        <Crest color={squad.badge.color} imagePath={squad.badge.crestPath} width={20} />
        <h2 className={styles.title}>Ficha do jogador</h2>
        <CategoryTag category={squad.category} size="extraLarge" className={styles.categoryTag} />
      </div>
      <div className={styles.identityFields}>
        <label title={FMF_SOURCE_HINT}>
          <span className={styles.label}>Número</span>
          <input disabled value={player.shirtNumber ?? '—'} className={cn(styles.readOnlyInput, styles.shirtNumber)} />
        </label>
        <label title={FMF_SOURCE_HINT}>
          <span className={styles.label}>Nome</span>
          <input disabled value={player.fullName} className={styles.readOnlyInput} />
        </label>
      </div>
      {canEdit ? (
        <PlayerProfileForm player={player} teamName={squad.badge.name} category={squad.category} />
      ) : (
        <PlayerProfileSummary player={player} teamName={squad.badge.name} category={squad.category} />
      )}
      {player.isInOtherCategory ? (
        <Link href={siblingHref} scroll={false} className={cn(styles.siblingLink, categoryBorderClass[siblingCategory], categoryTextClass[siblingCategory])}>
          Ver este atleta no {categoryLabel[siblingCategory]}
        </Link>
      ) : null}
      {lastChange}
      <CuriosityList playerId={player.id} curiosities={player.curiosities} canEdit={canEdit} />
      {canEdit ? null : <SignInToEdit returnTo={routes.squads({ year: squad.year, category: categoryFilter, teamKey: squad.key, playerId: player.id })} />}
      <p className={styles.curiosityNote}>Curiosidades pertencem a este vínculo e só aparecem em partidas da categoria {category}.</p>
    </div>
  )
}
