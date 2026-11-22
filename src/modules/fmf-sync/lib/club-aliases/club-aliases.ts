export const CREST_ALIASES: Readonly<Record<string, string>> = {
  Atletico: '16182',
  '7250': '16054',
  '7251': '16052',
  '7982': '16283',
  '8375': '16053',
}

export const canonicalCrestId = (crestId: string): string => CREST_ALIASES[crestId] ?? crestId

export const isAliasCrest = (crestId: string): boolean => crestId in CREST_ALIASES
