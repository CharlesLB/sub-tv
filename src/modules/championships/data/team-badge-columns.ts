import 'server-only'

type BadgeColumnSource<TDisplay, TShort, TAbbreviation, TColor> = {
  displayName: TDisplay
  shortName: TShort
  abbreviation: TAbbreviation
  color: TColor
}

export const teamBadgeColumns = <TDisplay, TShort, TAbbreviation, TColor>(club: BadgeColumnSource<TDisplay, TShort, TAbbreviation, TColor>) => ({
  displayName: club.displayName,
  shortName: club.shortName,
  abbreviation: club.abbreviation,
  color: club.color,
})
