const SEASON_STORAGE_KEY = 'futebol-temporada'

export const rememberYear = (year: number) => {
  try {
    localStorage.setItem(SEASON_STORAGE_KEY, String(year))
  } catch {
    return
  }
}

export const readRememberedYear = (): number | null => {
  try {
    const saved = Number(localStorage.getItem(SEASON_STORAGE_KEY))

    return Number.isInteger(saved) && saved > 0 ? saved : null
  } catch {
    return null
  }
}
