export const breadcrumbsStyles = {
  trail: 'flex min-w-0 items-center gap-[5px]',
  crumb: 'inline-flex min-w-0 animate-crumb-in items-center gap-[5px]',
  separator: 'text-[10.5px] text-tx5',
  link: 'max-w-[30vw] truncate text-[10.5px] tracking-[.1em] whitespace-nowrap text-crumb-tinta underline decoration-crumb-tinta underline-offset-[3px] transition-colors hover:text-ac hover:decoration-ac',
  currentPage: 'max-w-[30vw] truncate text-[10.5px] tracking-[.1em] whitespace-nowrap text-crumb-apagado',
} as const
