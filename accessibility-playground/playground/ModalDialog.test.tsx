import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import ModalDialog from './ModalDialog'

function TestPage() {
  return (
    <main>
      <button type="button">Outside before</button>
      <ModalDialog triggerLabel="Open dialog" title="Example dialog">
        <label htmlFor="name-field">Name</label>
        <input id="name-field" />
        <button type="button">Apply</button>
      </ModalDialog>
      <button type="button">Outside after</button>
    </main>
  )
}

function openDialog(user: ReturnType<typeof userEvent.setup>) {
  return user.click(screen.getByRole('button', { name: 'Open dialog' }))
}

describe('ModalDialog', () => {
  it('opens with the mouse and uses the correct ARIA', async () => {
    const user = userEvent.setup()
    render(<TestPage />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await openDialog(user)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    const labelledBy = dialog.getAttribute('aria-labelledby')
    expect(labelledBy).toBeTruthy()
    expect(document.getElementById(labelledBy ?? '')).toHaveTextContent(
      'Example dialog',
    )
  })

  it('opens with the Enter key', async () => {
    const user = userEvent.setup()
    render(<TestPage />)

    const trigger = screen.getByRole('button', { name: 'Open dialog' })
    trigger.focus()
    await user.keyboard('{Enter}')

    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('opens with the Space key and moves focus into the dialog', async () => {
    const user = userEvent.setup()
    render(<TestPage />)

    const trigger = screen.getByRole('button', { name: 'Open dialog' })
    trigger.focus()
    await user.keyboard(' ')

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus()
  })

  it('wraps Tab focus from the last element back to the first', async () => {
    const user = userEvent.setup()
    render(<TestPage />)
    await openDialog(user)

    const input = screen.getByRole('textbox', { name: 'Name' })
    const closeButton = screen.getByRole('button', { name: 'Close dialog' })

    expect(input).toHaveFocus()

    // Reach the last focusable element inside the dialog (browser would tab
    // here), then one more Tab must wrap back to the first element.
    closeButton.focus()
    fireEvent.keyDown(closeButton, { key: 'Tab' })
    expect(input).toHaveFocus()
  })

  it('wraps Shift + Tab focus from the first element to the last', async () => {
    const user = userEvent.setup()
    render(<TestPage />)
    await openDialog(user)

    const input = screen.getByRole('textbox', { name: 'Name' })
    const closeButton = screen.getByRole('button', { name: 'Close dialog' })

    expect(input).toHaveFocus()

    // Shift + Tab from the first element must not escape but wrap to the last.
    fireEvent.keyDown(input, { key: 'Tab', shiftKey: true })
    expect(closeButton).toHaveFocus()
  })

  it('keeps focus inside the dialog across many Tab keys', async () => {
    const user = userEvent.setup()
    render(<TestPage />)
    await openDialog(user)

    const dialog = screen.getByRole('dialog')

    for (let i = 0; i < 20; i += 1) {
      fireEvent.keyDown(document.activeElement!, { key: 'Tab' })
      expect(dialog.contains(document.activeElement)).toBe(true)

      fireEvent.keyDown(document.activeElement!, { key: 'Tab', shiftKey: true })
      expect(dialog.contains(document.activeElement)).toBe(true)
    }
  })

  it('closes with Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<TestPage />)

    const trigger = screen.getByRole('button', { name: 'Open dialog' })
    await user.click(trigger)
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveFocus()

    fireEvent.keyDown(document.activeElement!, { key: 'Escape' })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('closes with the Close button and returns focus to the trigger', async () => {
    const user = userEvent.setup()
    render(<TestPage />)

    const trigger = screen.getByRole('button', { name: 'Open dialog' })
    await user.click(trigger)

    await user.click(screen.getByRole('button', { name: 'Close dialog' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})