import { act, render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { describe, expect, it } from 'vitest'
import { EditorAccessProvider, useCanEdit } from './editor-access-provider'

function AccessReader() {
  return <output aria-label="Acesso">{useCanEdit() ? 'pode editar' : 'só leitura'}</output>
}

describe('EditorAccessProvider', () => {
  it('lets the components below know that the user can edit', () => {
    render(
      <EditorAccessProvider canEdit>
        <AccessReader />
      </EditorAccessProvider>,
    )

    expect(screen.getByRole('status', { name: 'Acesso' })).toHaveTextContent('pode editar')
  })

  it('waits for the session check when it arrives as a promise', async () => {
    const sessionCheck = Promise.resolve(true)

    await act(async () => {
      render(
        <EditorAccessProvider canEdit={sessionCheck}>
          <Suspense>
            <AccessReader />
          </Suspense>
        </EditorAccessProvider>,
      )
    })

    expect(screen.getByRole('status', { name: 'Acesso' })).toHaveTextContent('pode editar')
  })

  it('treats everyone as a visitor when there is no provider above', () => {
    render(<AccessReader />)

    expect(screen.getByRole('status', { name: 'Acesso' })).toHaveTextContent('só leitura')
  })
})
