import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditorAccessProvider } from '../editor-access-provider/editor-access-provider'
import { EditorOnly } from './editor-only'

const renderEditorOnly = (canEdit: boolean) =>
  render(
    <EditorAccessProvider canEdit={canEdit}>
      <EditorOnly>
        <button type="button">Nova partida</button>
      </EditorOnly>
    </EditorAccessProvider>,
  )

describe('EditorOnly', () => {
  it('shows the editing control to a signed in user', () => {
    renderEditorOnly(true)

    expect(screen.getByRole('button', { name: 'Nova partida' })).toBeInTheDocument()
  })

  it('hides the editing control from a signed out visitor', () => {
    renderEditorOnly(false)

    expect(screen.queryByRole('button', { name: 'Nova partida' })).not.toBeInTheDocument()
  })
})
