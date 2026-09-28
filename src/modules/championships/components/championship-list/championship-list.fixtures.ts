import type { ChampionshipCardVM } from '../../types'
import { championshipWithNextMatchFixture, championshipWithoutResultsFixture, finishedChampionshipFixture, liveChampionshipFixture } from '../championship-card/championship-card.fixtures'

export const SEASON_YEAR_FIXTURE = 2025

export const championshipsOfYearFixture: ChampionshipCardVM[] = [championshipWithNextMatchFixture, liveChampionshipFixture, finishedChampionshipFixture, championshipWithoutResultsFixture]
