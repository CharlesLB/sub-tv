import { relations } from 'drizzle-orm'
import {
  clubs,
  competitions,
  curiosities,
  fmfStandings,
  fmfTopScorers,
  matchEvents,
  matches,
  matchLineups,
  matchOfficials,
  matchStaff,
  matchTeams,
  playerSeasonStats,
  players,
  seasonSquads,
  seasonStaff,
  seasons,
  seasonTeams,
  sourceDocuments,
  staffMembers,
  staffSeasonStats,
  syncIssues,
  syncRuns,
  teamSeasonStats,
} from './schema'

export const competitionsRelations = relations(competitions, ({ many }) => ({
  seasons: many(seasons),
}))

export const seasonsRelations = relations(seasons, ({ one, many }) => ({
  competition: one(competitions, { fields: [seasons.competitionId], references: [competitions.id] }),
  teams: many(seasonTeams),
  matches: many(matches),
  playerStats: many(playerSeasonStats),
  fmfStandings: many(fmfStandings),
  fmfTopScorers: many(fmfTopScorers),
}))

export const clubsRelations = relations(clubs, ({ many }) => ({
  seasonTeams: many(seasonTeams),
}))

export const seasonTeamsRelations = relations(seasonTeams, ({ one, many }) => ({
  season: one(seasons, { fields: [seasonTeams.seasonId], references: [seasons.id] }),
  club: one(clubs, { fields: [seasonTeams.clubId], references: [clubs.id] }),
  squad: many(seasonSquads),
  staff: many(seasonStaff),
  stats: one(teamSeasonStats, { fields: [seasonTeams.id], references: [teamSeasonStats.seasonTeamId] }),
  staffStats: many(staffSeasonStats),
  homeMatches: many(matches, { relationName: 'home' }),
  awayMatches: many(matches, { relationName: 'away' }),
}))

export const playersRelations = relations(players, ({ many }) => ({
  squads: many(seasonSquads),
  curiosities: many(curiosities),
  lineups: many(matchLineups),
  events: many(matchEvents, { relationName: 'eventPlayer' }),
  stats: many(playerSeasonStats),
}))

export const staffMembersRelations = relations(staffMembers, ({ many }) => ({
  seasons: many(seasonStaff),
  curiosities: many(curiosities),
  matches: many(matchStaff),
  stats: many(staffSeasonStats),
}))

export const seasonSquadsRelations = relations(seasonSquads, ({ one }) => ({
  seasonTeam: one(seasonTeams, { fields: [seasonSquads.seasonTeamId], references: [seasonTeams.id] }),
  player: one(players, { fields: [seasonSquads.playerId], references: [players.id] }),
}))

export const seasonStaffRelations = relations(seasonStaff, ({ one }) => ({
  seasonTeam: one(seasonTeams, { fields: [seasonStaff.seasonTeamId], references: [seasonTeams.id] }),
  staffMember: one(staffMembers, { fields: [seasonStaff.staffMemberId], references: [staffMembers.id] }),
}))

export const curiositiesRelations = relations(curiosities, ({ one }) => ({
  player: one(players, { fields: [curiosities.playerId], references: [players.id] }),
  staffMember: one(staffMembers, { fields: [curiosities.staffMemberId], references: [staffMembers.id] }),
  season: one(seasons, { fields: [curiosities.seasonId], references: [seasons.id] }),
}))

export const matchesRelations = relations(matches, ({ one, many }) => ({
  season: one(seasons, { fields: [matches.seasonId], references: [seasons.id] }),
  homeTeam: one(seasonTeams, { fields: [matches.homeTeamId], references: [seasonTeams.id], relationName: 'home' }),
  awayTeam: one(seasonTeams, { fields: [matches.awayTeamId], references: [seasonTeams.id], relationName: 'away' }),
  sides: many(matchTeams),
  lineups: many(matchLineups),
  staff: many(matchStaff),
  officials: many(matchOfficials),
  events: many(matchEvents),
  documents: many(sourceDocuments),
}))

export const matchTeamsRelations = relations(matchTeams, ({ one }) => ({
  match: one(matches, { fields: [matchTeams.matchId], references: [matches.id] }),
}))

export const matchLineupsRelations = relations(matchLineups, ({ one }) => ({
  match: one(matches, { fields: [matchLineups.matchId], references: [matches.id] }),
  player: one(players, { fields: [matchLineups.playerId], references: [players.id] }),
}))

export const matchStaffRelations = relations(matchStaff, ({ one }) => ({
  match: one(matches, { fields: [matchStaff.matchId], references: [matches.id] }),
  staffMember: one(staffMembers, { fields: [matchStaff.staffMemberId], references: [staffMembers.id] }),
}))

export const matchOfficialsRelations = relations(matchOfficials, ({ one }) => ({
  match: one(matches, { fields: [matchOfficials.matchId], references: [matches.id] }),
}))

export const matchEventsRelations = relations(matchEvents, ({ one }) => ({
  match: one(matches, { fields: [matchEvents.matchId], references: [matches.id] }),
  player: one(players, { fields: [matchEvents.playerId], references: [players.id], relationName: 'eventPlayer' }),
  playerOut: one(players, { fields: [matchEvents.playerOutId], references: [players.id], relationName: 'eventPlayerOut' }),
  assistPlayer: one(players, { fields: [matchEvents.assistPlayerId], references: [players.id], relationName: 'eventAssist' }),
  staffMember: one(staffMembers, { fields: [matchEvents.staffMemberId], references: [staffMembers.id] }),
  reconciledWith: one(matchEvents, { fields: [matchEvents.reconciledWithId], references: [matchEvents.id] }),
}))

export const playerSeasonStatsRelations = relations(playerSeasonStats, ({ one }) => ({
  season: one(seasons, { fields: [playerSeasonStats.seasonId], references: [seasons.id] }),
  player: one(players, { fields: [playerSeasonStats.playerId], references: [players.id] }),
  seasonTeam: one(seasonTeams, { fields: [playerSeasonStats.seasonTeamId], references: [seasonTeams.id] }),
}))

export const fmfStandingsRelations = relations(fmfStandings, ({ one }) => ({
  season: one(seasons, { fields: [fmfStandings.seasonId], references: [seasons.id] }),
  seasonTeam: one(seasonTeams, { fields: [fmfStandings.seasonTeamId], references: [seasonTeams.id] }),
}))

export const fmfTopScorersRelations = relations(fmfTopScorers, ({ one }) => ({
  season: one(seasons, { fields: [fmfTopScorers.seasonId], references: [seasons.id] }),
  player: one(players, { fields: [fmfTopScorers.playerId], references: [players.id] }),
}))

export const sourceDocumentsRelations = relations(sourceDocuments, ({ one }) => ({
  match: one(matches, { fields: [sourceDocuments.matchId], references: [matches.id] }),
  season: one(seasons, { fields: [sourceDocuments.seasonId], references: [seasons.id] }),
}))

export const syncRunsRelations = relations(syncRuns, ({ many }) => ({
  issues: many(syncIssues),
}))

export const syncIssuesRelations = relations(syncIssues, ({ one }) => ({
  run: one(syncRuns, { fields: [syncIssues.syncRunId], references: [syncRuns.id] }),
  match: one(matches, { fields: [syncIssues.matchId], references: [matches.id] }),
  player: one(players, { fields: [syncIssues.playerId], references: [players.id] }),
  event: one(matchEvents, { fields: [syncIssues.eventId], references: [matchEvents.id] }),
}))

export const teamSeasonStatsRelations = relations(teamSeasonStats, ({ one }) => ({
  seasonTeam: one(seasonTeams, { fields: [teamSeasonStats.seasonTeamId], references: [seasonTeams.id] }),
}))

export const staffSeasonStatsRelations = relations(staffSeasonStats, ({ one }) => ({
  seasonTeam: one(seasonTeams, { fields: [staffSeasonStats.seasonTeamId], references: [seasonTeams.id] }),
  staffMember: one(staffMembers, { fields: [staffSeasonStats.staffMemberId], references: [staffMembers.id] }),
}))
