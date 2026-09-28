import {
  pgTable,
  pgEnum,
  uuid,
  text,
  integer,
  smallint,
  boolean,
  date,
  timestamp,
  jsonb,
  real,
  uniqueIndex,
  unique,
  index,
  primaryKey,
  foreignKey,
  check,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const categoryEnum = pgEnum("category", ["sub13", "sub14"]);
export const divisionEnum = pgEnum("division", ["primeira", "segunda", "copa"]);
export const dataSourceEnum = pgEnum("data_source", ["fmf", "manual", "ao_vivo"]);
export const sideEnum = pgEnum("side", ["home", "away"]);
export const matchStatusEnum = pgEnum("match_status", [
  "agendado",
  "ao_vivo",
  "encerrado",
  "adiado",
  "cancelado",
  "wo",
]);
export const periodEnum = pgEnum("period", [
  "ANT",
  "1T",
  "INT",
  "2T",
  "PR1",
  "PR2",
  "PEN",
  "TER",
]);
export const eventTypeEnum = pgEnum("event_type", [
  "gol",
  "amarelo",
  "vermelho",
  "substituicao",
]);
export const goalTypeEnum = pgEnum("goal_type", ["normal", "penalti", "contra", "falta"]);
export const positionEnum = pgEnum("position", [
  "goleiro",
  "zagueiro",
  "lateral",
  "volante",
  "meia",
  "atacante",
]);
export const footEnum = pgEnum("foot", ["destro", "canhoto", "ambidestro"]);
export const staffRoleEnum = pgEnum("staff_role", [
  "tecnico",
  "auxiliar",
  "preparador_fisico",
  "preparador_goleiros",
  "medico",
  "fisioterapeuta",
  "massagista",
  "outro",
]);
export const officialRoleEnum = pgEnum("official_role", [
  "arbitro",
  "assistente_1",
  "assistente_2",
  "quarto_arbitro",
  "quinto_arbitro",
]);
export const syncStatusEnum = pgEnum("sync_status", ["rodando", "sucesso", "parcial", "falhou"]);
export const syncIssueEnum = pgEnum("sync_issue", [
  "artilharia_divergente",
  "evento_ao_vivo_sem_par",
  "sumula_ilegivel",
  "jogo_removido",
  "estrutura_pagina_mudou",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const competitions = pgTable("competitions", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  category: categoryEnum("category").notNull(),
  division: divisionEnum("division").notNull(),
  ...timestamps,
});

export const seasons = pgTable(
  "seasons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    competitionId: uuid("competition_id")
      .notNull()
      .references(() => competitions.id),
    year: smallint("year").notNull(),
    label: text("label").notNull(),
    fmfCompetitionId: integer("fmf_competition_id"),
    fmfPageUrl: text("fmf_page_url"),
    isCurrent: boolean("is_current").default(false).notNull(),
    syncEnabled: boolean("sync_enabled").default(false).notNull(),
    startsOn: date("starts_on"),
    endsOn: date("ends_on"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("seasons_competition_year_uq").on(t.competitionId, t.year),

    index("seasons_fmf_competition_idx").on(t.fmfCompetitionId),
  ],
);

export const clubs = pgTable("clubs", {
  id: uuid("id").primaryKey().defaultRandom(),
  fmfCrestId: text("fmf_crest_id").unique(),
  shortName: text("short_name").notNull(),
  officialName: text("official_name"),
  displayName: text("display_name"),
  abbreviation: text("abbreviation"),
  color: text("color"),
  crestUrl: text("crest_url"),
  city: text("city"),
  ...timestamps,
});

export const seasonTeams = pgTable(
  "season_teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id, { onDelete: "cascade" }),
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id),
    groupName: text("group_name"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("season_teams_uq").on(t.seasonId, t.clubId),

    unique("season_teams_id_season_uq").on(t.id, t.seasonId),
  ],
);

export const players = pgTable(
  "players",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cbfId: text("cbf_id").unique(),
    fullName: text("full_name").notNull(),
    nickname: text("nickname"),

    displayName: text("display_name"),
    position: positionEnum("position"),
    preferredFoot: footEnum("preferred_foot"),
    birthYear: smallint("birth_year"),
    ...timestamps,
  },
  (t) => [
    index("players_full_name_idx").on(t.fullName),
    index("players_nickname_idx").on(t.nickname),
    index("players_display_name_idx").on(t.displayName),
  ],
);

export const staffMembers = pgTable(
  "staff_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fullName: text("full_name").notNull(),
    normalizedName: text("normalized_name").notNull(),
    displayName: text("display_name"),
    ...timestamps,
  },

  (t) => [index("staff_normalized_name_idx").on(t.normalizedName)],
);

export const seasonSquads = pgTable(
  "season_squads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seasonTeamId: uuid("season_team_id")
      .notNull()
      .references(() => seasonTeams.id, { onDelete: "cascade" }),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id),
    usualShirtNumber: smallint("usual_shirt_number"),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("season_squads_uq").on(t.seasonTeamId, t.playerId),
    index("season_squads_player_idx").on(t.playerId),
  ],
);

export const seasonStaff = pgTable(
  "season_staff",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seasonTeamId: uuid("season_team_id")
      .notNull()
      .references(() => seasonTeams.id, { onDelete: "cascade" }),
    staffMemberId: uuid("staff_member_id")
      .notNull()
      .references(() => staffMembers.id),
    role: staffRoleEnum("role").notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("season_staff_uq").on(t.seasonTeamId, t.staffMemberId, t.role)],
);

export const curiosities = pgTable(
  "curiosities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    playerId: uuid("player_id").references(() => players.id, { onDelete: "cascade" }),
    staffMemberId: uuid("staff_member_id").references(() => staffMembers.id, {
      onDelete: "cascade",
    }),
    seasonId: uuid("season_id").references(() => seasons.id),
    text: text("text").notNull(),
    isHighlight: boolean("is_highlight").default(false).notNull(),
    sortOrder: smallint("sort_order").default(0).notNull(),
    notedOn: date("noted_on").defaultNow().notNull(),
    createdBy: text("created_by"),
    ...timestamps,
  },
  (t) => [
    index("curiosities_player_idx").on(t.playerId),
    index("curiosities_staff_idx").on(t.staffMemberId),
    check(
      "curiosities_one_owner",
      sql`(${t.playerId} is not null)::int + (${t.staffMemberId} is not null)::int = 1`,
    ),
  ],
);

export const matches = pgTable(
  "matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id, { onDelete: "cascade" }),
    fmfMatchId: integer("fmf_match_id").unique(),
    matchNumber: smallint("match_number"),
    phase: text("phase"),
    round: smallint("round"),
    leg: smallint("leg"),
    homeTeamId: uuid("home_team_id")
      .notNull()
      .references(() => seasonTeams.id),
    awayTeamId: uuid("away_team_id")
      .notNull()
      .references(() => seasonTeams.id),
    kickoffAt: timestamp("kickoff_at", { withTimezone: true }),
    venue: text("venue"),
    city: text("city"),
    status: matchStatusEnum("status").default("agendado").notNull(),

    homeScore: smallint("home_score"),
    awayScore: smallint("away_score"),
    homeScoreHt: smallint("home_score_ht"),
    awayScoreHt: smallint("away_score_ht"),
    homePenalties: smallint("home_penalties"),
    awayPenalties: smallint("away_penalties"),
    addedTime1t: smallint("added_time_1t"),
    addedTime2t: smallint("added_time_2t"),

    sumulaUrl: text("sumula_url"),
    sumulaRevision: smallint("sumula_revision").default(0).notNull(),
    sumulaHash: text("sumula_hash"),
    sumulaProcessedAt: timestamp("sumula_processed_at", { withTimezone: true }),
    missingFromTableCount: smallint("missing_from_table_count").default(0).notNull(),
    removedAt: timestamp("removed_at", { withTimezone: true }),

    isBroadcast: boolean("is_broadcast").default(false).notNull(),
    liveClock: jsonb("live_clock").$type<{ period: string; minute: number; startedAt?: string }>(),
    ...timestamps,
  },
  (t) => [
    index("matches_season_idx").on(t.seasonId),
    index("matches_kickoff_idx").on(t.kickoffAt),
    index("matches_home_idx").on(t.homeTeamId),
    index("matches_away_idx").on(t.awayTeamId),
    uniqueIndex("matches_season_number_uq").on(t.seasonId, t.phase, t.matchNumber),
    check("matches_distinct_teams", sql`${t.homeTeamId} <> ${t.awayTeamId}`),
    foreignKey({
      name: "matches_home_team_same_season_fk",
      columns: [t.homeTeamId, t.seasonId],
      foreignColumns: [seasonTeams.id, seasonTeams.seasonId],
    }),
    foreignKey({
      name: "matches_away_team_same_season_fk",
      columns: [t.awayTeamId, t.seasonId],
      foreignColumns: [seasonTeams.id, seasonTeams.seasonId],
    }),
  ],
);

export const matchTeams = pgTable(
  "match_teams",
  {
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    side: sideEnum("side").notNull(),
    formation: text("formation"),
    ...timestamps,
  },
  (t) => [primaryKey({ columns: [t.matchId, t.side] })],
);

export const matchLineups = pgTable(
  "match_lineups",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    side: sideEnum("side").notNull(),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id),
    shirtNumber: smallint("shirt_number").notNull(),
    isStarter: boolean("is_starter").notNull(),
    isCaptain: boolean("is_captain").default(false).notNull(),

    pitchX: real("pitch_x"),
    pitchY: real("pitch_y"),
    positionOverride: positionEnum("position_override"),
    source: dataSourceEnum("source").default("fmf").notNull(),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("match_lineups_player_uq").on(t.matchId, t.playerId),
    uniqueIndex("match_lineups_shirt_uq").on(t.matchId, t.side, t.shirtNumber),
    check(
      "match_lineups_pitch_range",
      sql`(${t.pitchX} is null or ${t.pitchX} between 0 and 100)
      and (${t.pitchY} is null or ${t.pitchY} between 0 and 100)`,
    ),
    index("match_lineups_player_idx").on(t.playerId),
  ],
);

export const matchStaff = pgTable(
  "match_staff",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    side: sideEnum("side").notNull(),
    staffMemberId: uuid("staff_member_id")
      .notNull()
      .references(() => staffMembers.id),
    role: staffRoleEnum("role").notNull(),
  },
  (t) => [uniqueIndex("match_staff_uq").on(t.matchId, t.staffMemberId, t.role)],
);

export const matchOfficials = pgTable(
  "match_officials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    role: officialRoleEnum("role").notNull(),
    name: text("name").notNull(),
  },
  (t) => [uniqueIndex("match_officials_uq").on(t.matchId, t.role)],
);

export const matchEvents = pgTable(
  "match_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => matches.id, { onDelete: "cascade" }),
    side: sideEnum("side").notNull(),
    type: eventTypeEnum("type").notNull(),
    period: periodEnum("period").notNull(),
    minute: smallint("minute"),
    addedMinute: smallint("added_minute"),
    playerId: uuid("player_id").references(() => players.id),
        staffMemberId: uuid("staff_member_id").references(() => staffMembers.id),
        playerOutId: uuid("player_out_id").references(() => players.id),
        goalType: goalTypeEnum("goal_type"),
    assistPlayerId: uuid("assist_player_id").references(() => players.id),
        fromSecondYellow: boolean("from_second_yellow").default(false).notNull(),
    note: text("note"),
    source: dataSourceEnum("source").notNull(),
        clientId: uuid("client_id").unique(),
        reconciledWithId: uuid("reconciled_with_id").references((): AnyPgColumn => matchEvents.id, {
      onDelete: "set null",
    }),
    supersededAt: timestamp("superseded_at", { withTimezone: true }),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
    createdBy: text("created_by"),
    ...timestamps,
  },
  (t) => [
    index("match_events_match_idx").on(t.matchId),
    index("match_events_player_idx").on(t.playerId),
    index("match_events_type_idx").on(t.type),
    check(
      "match_events_shape",
      sql`case ${t.type}
        when 'gol' then ${t.playerId} is not null and ${t.goalType} is not null
                    and ${t.staffMemberId} is null and ${t.playerOutId} is null
        when 'substituicao' then ${t.playerId} is not null and ${t.playerOutId} is not null
                    and ${t.goalType} is null and ${t.assistPlayerId} is null
        else ((${t.playerId} is not null)::int + (${t.staffMemberId} is not null)::int = 1)
             and ${t.goalType} is null and ${t.assistPlayerId} is null and ${t.playerOutId} is null
      end`,
    ),
    check("match_events_minute_range", sql`${t.minute} is null or ${t.minute} between 0 and 130`),
    check(
      "match_events_distinct_players",
      sql`(${t.playerOutId} is null or ${t.playerOutId} <> ${t.playerId})
      and (${t.assistPlayerId} is null or ${t.assistPlayerId} <> ${t.playerId})`,
    ),
    check(
      "match_events_second_yellow",
      sql`not ${t.fromSecondYellow} or ${t.type} = 'vermelho'`,
    ),
  ],
);

export const playerSeasonStats = pgTable(
  "player_season_stats",
  {
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id, { onDelete: "cascade" }),
    playerId: uuid("player_id")
      .notNull()
      .references(() => players.id),
    seasonTeamId: uuid("season_team_id")
      .notNull()
      .references(() => seasonTeams.id),
    games: smallint("games").default(0).notNull(),
    starts: smallint("starts").default(0).notNull(),
    subIn: smallint("sub_in").default(0).notNull(),
    subOut: smallint("sub_out").default(0).notNull(),
    goals: smallint("goals").default(0).notNull(),
    penaltyGoals: smallint("penalty_goals").default(0).notNull(),
    ownGoals: smallint("own_goals").default(0).notNull(),
    assists: smallint("assists").default(0).notNull(),
    yellowCards: smallint("yellow_cards").default(0).notNull(),
    redCards: smallint("red_cards").default(0).notNull(),
    rankInTeamGoals: smallint("rank_in_team_goals"),
    computedAt: timestamp("computed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.seasonId, t.playerId, t.seasonTeamId] }),
    index("player_stats_goals_idx").on(t.seasonId, t.goals),
  ],
);

export const teamSeasonStats = pgTable(
  "team_season_stats",
  {
    seasonTeamId: uuid("season_team_id")
      .primaryKey()
      .references(() => seasonTeams.id, { onDelete: "cascade" }),
    played: smallint("played").default(0).notNull(),
    wins: smallint("wins").default(0).notNull(),
    draws: smallint("draws").default(0).notNull(),
    losses: smallint("losses").default(0).notNull(),
    goalsFor: smallint("goals_for").default(0).notNull(),
    goalsAgainst: smallint("goals_against").default(0).notNull(),
    points: smallint("points").default(0).notNull(),
    yellowCards: smallint("yellow_cards").default(0).notNull(),
    redCards: smallint("red_cards").default(0).notNull(),
    cleanSheets: smallint("clean_sheets").default(0).notNull(),
    computedAt: timestamp("computed_at", { withTimezone: true }).defaultNow().notNull(),
  },
);

export const staffSeasonStats = pgTable(
  "staff_season_stats",
  {
    seasonTeamId: uuid("season_team_id")
      .notNull()
      .references(() => seasonTeams.id, { onDelete: "cascade" }),
    staffMemberId: uuid("staff_member_id")
      .notNull()
      .references(() => staffMembers.id),
    games: smallint("games").default(0).notNull(),
    wins: smallint("wins").default(0).notNull(),
    draws: smallint("draws").default(0).notNull(),
    losses: smallint("losses").default(0).notNull(),
    yellowCards: smallint("yellow_cards").default(0).notNull(),
    redCards: smallint("red_cards").default(0).notNull(),
    computedAt: timestamp("computed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.seasonTeamId, t.staffMemberId] })],
);

export const fmfStandings = pgTable(
  "fmf_standings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id, { onDelete: "cascade" }),
    seasonTeamId: uuid("season_team_id")
      .notNull()
      .references(() => seasonTeams.id),
    phase: text("phase").notNull(),
    position: smallint("position").notNull(),
    points: smallint("points").notNull(),
    played: smallint("played").notNull(),
    wins: smallint("wins").notNull(),
    draws: smallint("draws").notNull(),
    losses: smallint("losses").notNull(),
    goalsFor: smallint("goals_for").notNull(),
    goalsAgainst: smallint("goals_against").notNull(),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull(),
  },
  (t) => [
    uniqueIndex("fmf_standings_uq").on(t.seasonId, t.phase, t.seasonTeamId),
  ],
);

export const fmfTopScorers = pgTable(
  "fmf_top_scorers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    seasonId: uuid("season_id")
      .notNull()
      .references(() => seasons.id, { onDelete: "cascade" }),
    playerId: uuid("player_id").references(() => players.id),
    fullName: text("full_name").notNull(),
    nickname: text("nickname"),
    clubName: text("club_name").notNull(),
    goals: smallint("goals").notNull(),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("fmf_top_scorers_season_idx").on(t.seasonId)],
);

export const sourceDocuments = pgTable(
  "source_documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    url: text("url").notNull(),
    kind: text("kind").notNull(),
    sha256: text("sha256").notNull(),
    blobUrl: text("blob_url").notNull(),
    matchId: uuid("match_id").references(() => matches.id, { onDelete: "set null" }),
    seasonId: uuid("season_id").references(() => seasons.id, { onDelete: "set null" }),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [uniqueIndex("source_documents_url_hash_uq").on(t.url, t.sha256)],
);

export const syncRuns = pgTable("sync_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  kind: text("kind").notNull(),
  status: syncStatusEnum("status").default("rodando").notNull(),
  dryRun: boolean("dry_run").default(false).notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  cursor: jsonb("cursor"),
  summary: jsonb("summary").$type<{
    newMatches: number;
    sumulasProcessed: number;
    retifications: number;
    errors: number;
  }>(),
  error: text("error"),
});

export const syncIssues = pgTable(
  "sync_issues",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    syncRunId: uuid("sync_run_id")
      .notNull()
      .references(() => syncRuns.id, { onDelete: "cascade" }),
    type: syncIssueEnum("type").notNull(),
    seasonId: uuid("season_id").references(() => seasons.id),
    matchId: uuid("match_id").references(() => matches.id),
    playerId: uuid("player_id").references(() => players.id),
    eventId: uuid("event_id").references(() => matchEvents.id),
    details: jsonb("details"),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    resolvedBy: text("resolved_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("sync_issues_open_idx").on(t.resolvedAt)],
);

export const appUsers = pgTable(
  "app_users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull(),
    normalizedUsername: text("normalized_username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
    ...timestamps,
  },
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => appUsers.id),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    details: jsonb("details"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("audit_log_entity_idx").on(t.entityType, t.entityId),
    index("audit_log_user_idx").on(t.userId, t.createdAt),
  ],
);
