import 'server-only'

type BadgeColumnSource<TDisplay, TShort, TAbbreviation, TColor, TCrestPath> = {
  displayName: TDisplay
  shortName: TShort
  abbreviation: TAbbreviation
  color: TColor
  crestPath: TCrestPath
}

export const teamBadgeColumns = <TDisplay, TShort, TAbbreviation, TColor, TCrestPath>(club: BadgeColumnSource<TDisplay, TShort, TAbbreviation, TColor, TCrestPath>) => ({
  displayName: club.displayName,
  shortName: club.shortName,
  abbreviation: club.abbreviation,
  color: club.color,
  crestPath: club.crestPath,
})
