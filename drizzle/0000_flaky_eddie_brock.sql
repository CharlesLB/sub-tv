CREATE TYPE "public"."category" AS ENUM('sub13', 'sub14');--> statement-breakpoint
CREATE TYPE "public"."data_source" AS ENUM('fmf', 'manual', 'ao_vivo');--> statement-breakpoint
CREATE TYPE "public"."division" AS ENUM('primeira', 'segunda', 'copa');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('gol', 'amarelo', 'vermelho', 'substituicao');--> statement-breakpoint
CREATE TYPE "public"."foot" AS ENUM('destro', 'canhoto', 'ambidestro');--> statement-breakpoint
CREATE TYPE "public"."goal_type" AS ENUM('normal', 'penalti', 'contra', 'falta');--> statement-breakpoint
CREATE TYPE "public"."match_status" AS ENUM('agendado', 'ao_vivo', 'encerrado', 'adiado', 'cancelado', 'wo');--> statement-breakpoint
CREATE TYPE "public"."official_role" AS ENUM('arbitro', 'assistente_1', 'assistente_2', 'quarto_arbitro', 'quinto_arbitro');--> statement-breakpoint
CREATE TYPE "public"."period" AS ENUM('ANT', '1T', 'INT', '2T', 'PR1', 'PR2', 'PEN', 'TER');--> statement-breakpoint
CREATE TYPE "public"."position" AS ENUM('goleiro', 'zagueiro', 'lateral', 'volante', 'meia', 'atacante');--> statement-breakpoint
CREATE TYPE "public"."side" AS ENUM('home', 'away');--> statement-breakpoint
CREATE TYPE "public"."staff_role" AS ENUM('tecnico', 'auxiliar', 'preparador_fisico', 'preparador_goleiros', 'medico', 'fisioterapeuta', 'massagista', 'outro');--> statement-breakpoint
CREATE TYPE "public"."sync_issue" AS ENUM('artilharia_divergente', 'evento_ao_vivo_sem_par', 'sumula_ilegivel', 'jogo_removido', 'estrutura_pagina_mudou');--> statement-breakpoint
CREATE TYPE "public"."sync_status" AS ENUM('rodando', 'sucesso', 'parcial', 'falhou');--> statement-breakpoint
CREATE TABLE "clubs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fmf_crest_id" text,
	"short_name" text NOT NULL,
	"official_name" text,
	"display_name" text,
	"abbreviation" text,
	"color" text,
	"crest_url" text,
	"city" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clubs_fmf_crest_id_unique" UNIQUE("fmf_crest_id")
);
--> statement-breakpoint
CREATE TABLE "competitions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"category" "category" NOT NULL,
	"division" "division" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "competitions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "curiosities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid,
	"staff_member_id" uuid,
	"season_id" uuid,
	"text" text NOT NULL,
	"is_highlight" boolean DEFAULT false NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"noted_on" date DEFAULT now() NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "curiosities_one_owner" CHECK (("curiosities"."player_id" is not null)::int + ("curiosities"."staff_member_id" is not null)::int = 1)
);
--> statement-breakpoint
CREATE TABLE "fmf_standings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"season_team_id" uuid NOT NULL,
	"phase" text NOT NULL,
	"position" smallint NOT NULL,
	"points" smallint NOT NULL,
	"played" smallint NOT NULL,
	"wins" smallint NOT NULL,
	"draws" smallint NOT NULL,
	"losses" smallint NOT NULL,
	"goals_for" smallint NOT NULL,
	"goals_against" smallint NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fmf_top_scorers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"player_id" uuid,
	"full_name" text NOT NULL,
	"nickname" text,
	"club_name" text NOT NULL,
	"goals" smallint NOT NULL,
	"fetched_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"side" "side" NOT NULL,
	"type" "event_type" NOT NULL,
	"period" "period" NOT NULL,
	"minute" smallint,
	"added_minute" smallint,
	"player_id" uuid,
	"staff_member_id" uuid,
	"player_out_id" uuid,
	"goal_type" "goal_type",
	"assist_player_id" uuid,
	"from_second_yellow" boolean DEFAULT false NOT NULL,
	"note" text,
	"source" "data_source" NOT NULL,
	"client_id" uuid,
	"reconciled_with_id" uuid,
	"superseded_at" timestamp with time zone,
	"deleted_at" timestamp with time zone,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "match_events_client_id_unique" UNIQUE("client_id"),
	CONSTRAINT "match_events_shape" CHECK (case "match_events"."type"
        when 'gol' then "match_events"."player_id" is not null and "match_events"."goal_type" is not null
                    and "match_events"."staff_member_id" is null and "match_events"."player_out_id" is null
        when 'substituicao' then "match_events"."player_id" is not null and "match_events"."player_out_id" is not null
                    and "match_events"."goal_type" is null and "match_events"."assist_player_id" is null
        else (("match_events"."player_id" is not null)::int + ("match_events"."staff_member_id" is not null)::int = 1)
             and "match_events"."goal_type" is null and "match_events"."assist_player_id" is null and "match_events"."player_out_id" is null
      end),
	CONSTRAINT "match_events_minute_range" CHECK ("match_events"."minute" is null or "match_events"."minute" between 0 and 130),
	CONSTRAINT "match_events_distinct_players" CHECK (("match_events"."player_out_id" is null or "match_events"."player_out_id" <> "match_events"."player_id")
      and ("match_events"."assist_player_id" is null or "match_events"."assist_player_id" <> "match_events"."player_id")),
	CONSTRAINT "match_events_second_yellow" CHECK (not "match_events"."from_second_yellow" or "match_events"."type" = 'vermelho')
);
--> statement-breakpoint
CREATE TABLE "match_lineups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"side" "side" NOT NULL,
	"player_id" uuid NOT NULL,
	"shirt_number" smallint NOT NULL,
	"is_starter" boolean NOT NULL,
	"is_captain" boolean DEFAULT false NOT NULL,
	"pitch_x" real,
	"pitch_y" real,
	"position_override" "position",
	"source" "data_source" DEFAULT 'fmf' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "match_lineups_pitch_range" CHECK (("match_lineups"."pitch_x" is null or "match_lineups"."pitch_x" between 0 and 100)
      and ("match_lineups"."pitch_y" is null or "match_lineups"."pitch_y" between 0 and 100))
);
--> statement-breakpoint
CREATE TABLE "match_officials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"role" "official_role" NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match_staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"side" "side" NOT NULL,
	"staff_member_id" uuid NOT NULL,
	"role" "staff_role" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "match_teams" (
	"match_id" uuid NOT NULL,
	"side" "side" NOT NULL,
	"formation" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "match_teams_match_id_side_pk" PRIMARY KEY("match_id","side")
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"fmf_match_id" integer,
	"match_number" smallint,
	"phase" text,
	"round" smallint,
	"leg" smallint,
	"home_team_id" uuid NOT NULL,
	"away_team_id" uuid NOT NULL,
	"kickoff_at" timestamp with time zone,
	"venue" text,
	"city" text,
	"status" "match_status" DEFAULT 'agendado' NOT NULL,
	"home_score" smallint,
	"away_score" smallint,
	"home_score_ht" smallint,
	"away_score_ht" smallint,
	"home_penalties" smallint,
	"away_penalties" smallint,
	"added_time_1t" smallint,
	"added_time_2t" smallint,
	"sumula_url" text,
	"sumula_revision" smallint DEFAULT 0 NOT NULL,
	"sumula_hash" text,
	"sumula_processed_at" timestamp with time zone,
	"missing_from_table_count" smallint DEFAULT 0 NOT NULL,
	"removed_at" timestamp with time zone,
	"is_broadcast" boolean DEFAULT false NOT NULL,
	"live_clock" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "matches_fmf_match_id_unique" UNIQUE("fmf_match_id"),
	CONSTRAINT "matches_distinct_teams" CHECK ("matches"."home_team_id" <> "matches"."away_team_id")
);
--> statement-breakpoint
CREATE TABLE "player_season_stats" (
	"season_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"season_team_id" uuid NOT NULL,
	"games" smallint DEFAULT 0 NOT NULL,
	"starts" smallint DEFAULT 0 NOT NULL,
	"sub_in" smallint DEFAULT 0 NOT NULL,
	"sub_out" smallint DEFAULT 0 NOT NULL,
	"goals" smallint DEFAULT 0 NOT NULL,
	"penalty_goals" smallint DEFAULT 0 NOT NULL,
	"own_goals" smallint DEFAULT 0 NOT NULL,
	"assists" smallint DEFAULT 0 NOT NULL,
	"yellow_cards" smallint DEFAULT 0 NOT NULL,
	"red_cards" smallint DEFAULT 0 NOT NULL,
	"rank_in_team_goals" smallint,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "player_season_stats_season_id_player_id_season_team_id_pk" PRIMARY KEY("season_id","player_id","season_team_id")
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cbf_id" text,
	"full_name" text NOT NULL,
	"nickname" text,
	"display_name" text,
	"position" "position",
	"preferred_foot" "foot",
	"birth_year" smallint,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "players_cbf_id_unique" UNIQUE("cbf_id")
);
--> statement-breakpoint
CREATE TABLE "season_squads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_team_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"usual_shirt_number" smallint,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "season_staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_team_id" uuid NOT NULL,
	"staff_member_id" uuid NOT NULL,
	"role" "staff_role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "season_teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"season_id" uuid NOT NULL,
	"club_id" uuid NOT NULL,
	"group_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "season_teams_id_season_uq" UNIQUE("id","season_id")
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"competition_id" uuid NOT NULL,
	"year" smallint NOT NULL,
	"label" text NOT NULL,
	"fmf_competition_id" integer,
	"fmf_page_url" text,
	"is_current" boolean DEFAULT false NOT NULL,
	"sync_enabled" boolean DEFAULT false NOT NULL,
	"starts_on" date,
	"ends_on" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "source_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"kind" text NOT NULL,
	"sha256" text NOT NULL,
	"blob_url" text NOT NULL,
	"match_id" uuid,
	"season_id" uuid,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"normalized_name" text NOT NULL,
	"display_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_season_stats" (
	"season_team_id" uuid NOT NULL,
	"staff_member_id" uuid NOT NULL,
	"games" smallint DEFAULT 0 NOT NULL,
	"wins" smallint DEFAULT 0 NOT NULL,
	"draws" smallint DEFAULT 0 NOT NULL,
	"losses" smallint DEFAULT 0 NOT NULL,
	"yellow_cards" smallint DEFAULT 0 NOT NULL,
	"red_cards" smallint DEFAULT 0 NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "staff_season_stats_season_team_id_staff_member_id_pk" PRIMARY KEY("season_team_id","staff_member_id")
);
--> statement-breakpoint
CREATE TABLE "sync_issues" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sync_run_id" uuid NOT NULL,
	"type" "sync_issue" NOT NULL,
	"season_id" uuid,
	"match_id" uuid,
	"player_id" uuid,
	"event_id" uuid,
	"details" jsonb,
	"resolved_at" timestamp with time zone,
	"resolved_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sync_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" text NOT NULL,
	"status" "sync_status" DEFAULT 'rodando' NOT NULL,
	"dry_run" boolean DEFAULT false NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"cursor" jsonb,
	"summary" jsonb,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "team_season_stats" (
	"season_team_id" uuid PRIMARY KEY NOT NULL,
	"played" smallint DEFAULT 0 NOT NULL,
	"wins" smallint DEFAULT 0 NOT NULL,
	"draws" smallint DEFAULT 0 NOT NULL,
	"losses" smallint DEFAULT 0 NOT NULL,
	"goals_for" smallint DEFAULT 0 NOT NULL,
	"goals_against" smallint DEFAULT 0 NOT NULL,
	"points" smallint DEFAULT 0 NOT NULL,
	"yellow_cards" smallint DEFAULT 0 NOT NULL,
	"red_cards" smallint DEFAULT 0 NOT NULL,
	"clean_sheets" smallint DEFAULT 0 NOT NULL,
	"computed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "curiosities" ADD CONSTRAINT "curiosities_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curiosities" ADD CONSTRAINT "curiosities_staff_member_id_staff_members_id_fk" FOREIGN KEY ("staff_member_id") REFERENCES "public"."staff_members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "curiosities" ADD CONSTRAINT "curiosities_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fmf_standings" ADD CONSTRAINT "fmf_standings_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fmf_standings" ADD CONSTRAINT "fmf_standings_season_team_id_season_teams_id_fk" FOREIGN KEY ("season_team_id") REFERENCES "public"."season_teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fmf_top_scorers" ADD CONSTRAINT "fmf_top_scorers_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fmf_top_scorers" ADD CONSTRAINT "fmf_top_scorers_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_staff_member_id_staff_members_id_fk" FOREIGN KEY ("staff_member_id") REFERENCES "public"."staff_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_player_out_id_players_id_fk" FOREIGN KEY ("player_out_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_assist_player_id_players_id_fk" FOREIGN KEY ("assist_player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_events" ADD CONSTRAINT "match_events_reconciled_with_id_match_events_id_fk" FOREIGN KEY ("reconciled_with_id") REFERENCES "public"."match_events"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_lineups" ADD CONSTRAINT "match_lineups_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_lineups" ADD CONSTRAINT "match_lineups_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_officials" ADD CONSTRAINT "match_officials_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_staff" ADD CONSTRAINT "match_staff_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_staff" ADD CONSTRAINT "match_staff_staff_member_id_staff_members_id_fk" FOREIGN KEY ("staff_member_id") REFERENCES "public"."staff_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_teams" ADD CONSTRAINT "match_teams_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_id_season_teams_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."season_teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_id_season_teams_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."season_teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_home_team_same_season_fk" FOREIGN KEY ("home_team_id","season_id") REFERENCES "public"."season_teams"("id","season_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_away_team_same_season_fk" FOREIGN KEY ("away_team_id","season_id") REFERENCES "public"."season_teams"("id","season_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_season_stats" ADD CONSTRAINT "player_season_stats_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_season_stats" ADD CONSTRAINT "player_season_stats_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player_season_stats" ADD CONSTRAINT "player_season_stats_season_team_id_season_teams_id_fk" FOREIGN KEY ("season_team_id") REFERENCES "public"."season_teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season_squads" ADD CONSTRAINT "season_squads_season_team_id_season_teams_id_fk" FOREIGN KEY ("season_team_id") REFERENCES "public"."season_teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season_squads" ADD CONSTRAINT "season_squads_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season_staff" ADD CONSTRAINT "season_staff_season_team_id_season_teams_id_fk" FOREIGN KEY ("season_team_id") REFERENCES "public"."season_teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season_staff" ADD CONSTRAINT "season_staff_staff_member_id_staff_members_id_fk" FOREIGN KEY ("staff_member_id") REFERENCES "public"."staff_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season_teams" ADD CONSTRAINT "season_teams_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "season_teams" ADD CONSTRAINT "season_teams_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_competition_id_competitions_id_fk" FOREIGN KEY ("competition_id") REFERENCES "public"."competitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_documents" ADD CONSTRAINT "source_documents_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "source_documents" ADD CONSTRAINT "source_documents_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_season_stats" ADD CONSTRAINT "staff_season_stats_season_team_id_season_teams_id_fk" FOREIGN KEY ("season_team_id") REFERENCES "public"."season_teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "staff_season_stats" ADD CONSTRAINT "staff_season_stats_staff_member_id_staff_members_id_fk" FOREIGN KEY ("staff_member_id") REFERENCES "public"."staff_members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_issues" ADD CONSTRAINT "sync_issues_sync_run_id_sync_runs_id_fk" FOREIGN KEY ("sync_run_id") REFERENCES "public"."sync_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_issues" ADD CONSTRAINT "sync_issues_season_id_seasons_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."seasons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_issues" ADD CONSTRAINT "sync_issues_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_issues" ADD CONSTRAINT "sync_issues_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_issues" ADD CONSTRAINT "sync_issues_event_id_match_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."match_events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_season_stats" ADD CONSTRAINT "team_season_stats_season_team_id_season_teams_id_fk" FOREIGN KEY ("season_team_id") REFERENCES "public"."season_teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "curiosities_player_idx" ON "curiosities" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "curiosities_staff_idx" ON "curiosities" USING btree ("staff_member_id");--> statement-breakpoint
CREATE UNIQUE INDEX "fmf_standings_uq" ON "fmf_standings" USING btree ("season_id","phase","season_team_id");--> statement-breakpoint
CREATE INDEX "fmf_top_scorers_season_idx" ON "fmf_top_scorers" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "match_events_match_idx" ON "match_events" USING btree ("match_id");--> statement-breakpoint
CREATE INDEX "match_events_player_idx" ON "match_events" USING btree ("player_id");--> statement-breakpoint
CREATE INDEX "match_events_type_idx" ON "match_events" USING btree ("type");--> statement-breakpoint
CREATE UNIQUE INDEX "match_lineups_player_uq" ON "match_lineups" USING btree ("match_id","player_id");--> statement-breakpoint
CREATE UNIQUE INDEX "match_lineups_shirt_uq" ON "match_lineups" USING btree ("match_id","side","shirt_number");--> statement-breakpoint
CREATE INDEX "match_lineups_player_idx" ON "match_lineups" USING btree ("player_id");--> statement-breakpoint
CREATE UNIQUE INDEX "match_officials_uq" ON "match_officials" USING btree ("match_id","role");--> statement-breakpoint
CREATE UNIQUE INDEX "match_staff_uq" ON "match_staff" USING btree ("match_id","staff_member_id","role");--> statement-breakpoint
CREATE INDEX "matches_season_idx" ON "matches" USING btree ("season_id");--> statement-breakpoint
CREATE INDEX "matches_kickoff_idx" ON "matches" USING btree ("kickoff_at");--> statement-breakpoint
CREATE INDEX "matches_home_idx" ON "matches" USING btree ("home_team_id");--> statement-breakpoint
CREATE INDEX "matches_away_idx" ON "matches" USING btree ("away_team_id");--> statement-breakpoint
CREATE UNIQUE INDEX "matches_season_number_uq" ON "matches" USING btree ("season_id","match_number");--> statement-breakpoint
CREATE INDEX "player_stats_goals_idx" ON "player_season_stats" USING btree ("season_id","goals");--> statement-breakpoint
CREATE INDEX "players_full_name_idx" ON "players" USING btree ("full_name");--> statement-breakpoint
CREATE INDEX "players_nickname_idx" ON "players" USING btree ("nickname");--> statement-breakpoint
CREATE INDEX "players_display_name_idx" ON "players" USING btree ("display_name");--> statement-breakpoint
CREATE UNIQUE INDEX "season_squads_uq" ON "season_squads" USING btree ("season_team_id","player_id");--> statement-breakpoint
CREATE INDEX "season_squads_player_idx" ON "season_squads" USING btree ("player_id");--> statement-breakpoint
CREATE UNIQUE INDEX "season_staff_uq" ON "season_staff" USING btree ("season_team_id","staff_member_id","role");--> statement-breakpoint
CREATE UNIQUE INDEX "season_teams_uq" ON "season_teams" USING btree ("season_id","club_id");--> statement-breakpoint
CREATE UNIQUE INDEX "seasons_competition_year_uq" ON "seasons" USING btree ("competition_id","year");--> statement-breakpoint
CREATE INDEX "seasons_fmf_competition_idx" ON "seasons" USING btree ("fmf_competition_id");--> statement-breakpoint
CREATE UNIQUE INDEX "source_documents_url_hash_uq" ON "source_documents" USING btree ("url","sha256");--> statement-breakpoint
CREATE INDEX "staff_normalized_name_idx" ON "staff_members" USING btree ("normalized_name");--> statement-breakpoint
CREATE INDEX "sync_issues_open_idx" ON "sync_issues" USING btree ("resolved_at");