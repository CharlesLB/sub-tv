export const FMF_PAGE_BASE_URL = 'https://m.fmf.com.br/Competicoes/ProxJogos.aspx'
export const FMF_CREST_BASE_URL = 'https://esumula.fmf.com.br/escudos/'
export const FMF_USER_AGENT = 'sub.tv importador historico (contato: charles.braga.jf.cb@gmail.com)'
export const EDITION_SELECT_NAME = 'ctl00$ContentPlaceHolder1$cmbAno'
export const CURRENT_SEASON_YEAR = 2026

export const CATEGORY = { SUB13: 'sub13', SUB14: 'sub14' } as const
export const DIVISION = { PRIMEIRA: 'primeira', SEGUNDA: 'segunda', COPA: 'copa' } as const

export type Category = (typeof CATEGORY)[keyof typeof CATEGORY]
export type Division = (typeof DIVISION)[keyof typeof DIVISION]

export type CompetitionSource = {
  pageId: number
  slug: string
  name: string
  category: Category
  division: Division
}

export const COMPETITION_SOURCES: readonly CompetitionSource[] = [
  { pageId: 15, slug: 'mineiro-sub14-1a-divisao', name: 'Mineiro 1ª Divisão', category: CATEGORY.SUB14, division: DIVISION.PRIMEIRA },
  { pageId: 39, slug: 'trofeu-inconfidencia-sub14', name: 'Troféu Inconfidência', category: CATEGORY.SUB14, division: DIVISION.COPA },
  { pageId: 40, slug: 'mineiro-sub13-1a-divisao', name: 'Mineiro 1ª Divisão', category: CATEGORY.SUB13, division: DIVISION.PRIMEIRA },
  { pageId: 41, slug: 'mineiro-sub13-2a-divisao', name: 'Mineiro 2ª Divisão', category: CATEGORY.SUB13, division: DIVISION.SEGUNDA },
  { pageId: 42, slug: 'mineiro-sub14-2a-divisao', name: 'Mineiro 2ª Divisão', category: CATEGORY.SUB14, division: DIVISION.SEGUNDA },
] as const

export const buildCompetitionPageUrl = (pageId: number): string => `${FMF_PAGE_BASE_URL}?d=${pageId}`
