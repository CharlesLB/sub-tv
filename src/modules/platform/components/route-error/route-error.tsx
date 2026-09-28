'use client'

import { Icon } from '@/components/ui/icon/icon'
import { routeErrorStyles as styles } from './route-error.styles'

type RouteErrorProps = {
  title?: string
  description?: string
  retry: () => void
}

export function RouteError({ title = 'Não foi possível carregar esta parte.', description = 'Tente de novo. Se continuar, avise a coordenação da transmissão.', retry }: RouteErrorProps) {
  return (
    <div role="alert" className={styles.wrapper}>
      <div className={styles.card}>
        <Icon name="error" size={26} className={styles.icon} />
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
        <button type="button" onClick={() => retry()} className={styles.retryButton}>
          Tentar de novo
        </button>
      </div>
    </div>
  )
}
