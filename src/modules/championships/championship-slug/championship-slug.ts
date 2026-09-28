import type { Category } from '../categories'

const SLUG_SEPARATOR = '-'

export const toChampionshipSlug = (name: string, category: Category): string => {
  const words = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word !== '')

  return [...words, category].join(SLUG_SEPARATOR)
}
