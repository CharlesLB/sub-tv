DROP INDEX "matches_season_number_uq";--> statement-breakpoint
CREATE UNIQUE INDEX "matches_season_number_uq" ON "matches" USING btree ("season_id","phase","match_number");