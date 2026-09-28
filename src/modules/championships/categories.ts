export const CATEGORY = { SUB13: 'sub13', SUB14: 'sub14' } as const

export type Category = (typeof CATEGORY)[keyof typeof CATEGORY]

export const CATEGORIES: readonly Category[] = [CATEGORY.SUB13, CATEGORY.SUB14]

export const categoryLabel: Record<Category, string> = {
  [CATEGORY.SUB13]: 'SUB-13',
  [CATEGORY.SUB14]: 'SUB-14',
}

export const categoryTextClass: Record<Category, string> = {
  [CATEGORY.SUB13]: 'text-sub13',
  [CATEGORY.SUB14]: 'text-sub14',
}

export const categoryBorderClass: Record<Category, string> = {
  [CATEGORY.SUB13]: 'border-sub13',
  [CATEGORY.SUB14]: 'border-sub14',
}

export const categoryBackgroundClass: Record<Category, string> = {
  [CATEGORY.SUB13]: 'bg-sub13',
  [CATEGORY.SUB14]: 'bg-sub14',
}

export const otherCategory: Record<Category, Category> = {
  [CATEGORY.SUB13]: CATEGORY.SUB14,
  [CATEGORY.SUB14]: CATEGORY.SUB13,
}

export const isCategory = (value: unknown): value is Category => CATEGORIES.some((category) => category === value)
