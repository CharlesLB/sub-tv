import Link from 'next/link'
import { signInRoutes } from '@/lib/routes'
import { signInToEditStyles as styles } from './sign-in-to-edit.styles'

export function SignInToEdit({ returnTo }: { returnTo: string }) {
  return (
    <Link href={signInRoutes.signInTo(returnTo)} className={styles.link}>
      Entre para editar esta ficha
    </Link>
  )
}
