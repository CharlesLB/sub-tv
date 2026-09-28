import Link from 'next/link'
import { signInRoutes } from '@/lib/routes'

export function SignInToEdit({ returnTo }: { returnTo: string }) {
  return (
    <Link href={signInRoutes.signInTo(returnTo)} className="self-start text-[12px] font-semibold text-ac underline underline-offset-[3px] hover:text-tx">
      Entre para editar esta ficha
    </Link>
  )
}
