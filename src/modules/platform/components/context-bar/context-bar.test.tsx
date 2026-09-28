import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it } from 'vitest'
import { CATEGORY } from '@/modules/championships/client'
import { championshipCrumbsFixture } from '../breadcrumbs/breadcrumbs.fixtures'
import { ContextBar } from './context-bar'

describe('ContextBar', () => {
  it('shows the breadcrumbs, the page title and the theme toggle', () => {
    render(
      <Suspense>
        <ContextBar crumbs={championshipCrumbsFixture} title="Mineiro Sub-14" />
      </Suspense>,
    )

    expect(screen.getByRole('navigation', { name: 'Trilha de navegação' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Mineiro Sub-14' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mudar para o modo escuro' })).toBeInTheDocument()
  })

  it('hides the category tag and the detail when they are not given', () => {
    render(
      <Suspense>
        <ContextBar crumbs={championshipCrumbsFixture} title="Campeonatos" />
      </Suspense>,
    )

    expect(screen.queryByText('SUB-14')).not.toBeInTheDocument()
    expect(screen.queryByText('Fase de grupos')).not.toBeInTheDocument()
  })

  it('shows the category tag, the detail and the extra actions when they are given', () => {
    render(
      <Suspense>
        <ContextBar crumbs={championshipCrumbsFixture} title="Mineiro Sub-14" category={CATEGORY.SUB14} detail="Fase de grupos" actions={<button type="button">Nova partida</button>} />
      </Suspense>,
    )

    expect(screen.getByText('SUB-14')).toBeInTheDocument()
    expect(screen.getByText('Fase de grupos')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nova partida' })).toBeInTheDocument()
  })
})
