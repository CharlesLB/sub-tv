import { CATEGORY } from '../../categories'
import type { CategoryClubsVM, ClubOptionVM } from '../../types'
import { cerradoBadgeFixture, ribeirinhaBadgeFixture, serranoBadgeFixture, valeVerdeBadgeFixture } from '../match-card/match-card.fixtures'

export const valeVerdeClubFixture: ClubOptionVM = { clubId: 'c1a2b3c4-0001-4d5e-8f90-a1b2c3d4e5f1', badge: valeVerdeBadgeFixture }
export const serranoClubFixture: ClubOptionVM = { clubId: 'c1a2b3c4-0002-4d5e-8f90-a1b2c3d4e5f2', badge: serranoBadgeFixture }
export const ribeirinhaClubFixture: ClubOptionVM = { clubId: 'c1a2b3c4-0003-4d5e-8f90-a1b2c3d4e5f3', badge: ribeirinhaBadgeFixture }
export const cerradoClubFixture: ClubOptionVM = { clubId: 'c1a2b3c4-0004-4d5e-8f90-a1b2c3d4e5f4', badge: cerradoBadgeFixture }

export const clubOptionsFixture: ClubOptionVM[] = [valeVerdeClubFixture, serranoClubFixture, ribeirinhaClubFixture]

export const categoryClubsFixture: CategoryClubsVM = {
  [CATEGORY.SUB13]: clubOptionsFixture,
  [CATEGORY.SUB14]: [cerradoClubFixture],
}

export const categoryClubsWithoutSub14Fixture: CategoryClubsVM = { ...categoryClubsFixture, [CATEGORY.SUB14]: [] }
