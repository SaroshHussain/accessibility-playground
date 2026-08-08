import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import Disclosure from './Disclosure'

function renderDisclosures() {
  render(
    <main>
      <Disclosure summary="First topic">
        <p>First content</p>
      </Disclosure>
      <Disclosure summary="Second topic">
        <p>Second content</p>
      </Disclosure>
    </main>,
  )
}

describe('Disclosure', () => {
  it('starts collapsed with a button and hidden content', () => {
    renderDisclosures()

    const button = screen.getByRole('button', { name: 'First topic' })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    // The content region is hidden, so it exposes no role yet.
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('connects the button to the content with aria-controls', () => {
    renderDisclosures()

    const button = screen.getByRole('button', { name: 'First topic' })
    const controlsId = button.getAttribute('aria-controls')

    expect(controlsId).toBeTruthy()

    const controlled = document.getElementById(controlsId ?? '')
    expect(controlled).not.toBeNull()
    expect(controlled).toHaveAttribute('role', 'region')

    // The region is labelled by the button that controls it.
    expect(controlled!.getAttribute('aria-labelledby')).toBe(
      button.getAttribute('id'),
    )
  })

  it('expands and shows the content on click', async () => {
    const user = userEvent.setup()
    renderDisclosures()

    const button = screen.getByRole('button', { name: 'First topic' })
    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region')).toHaveTextContent('First content')
  })

  it('expands with the Enter key', async () => {
    const user = userEvent.setup()
    renderDisclosures()

    const button = screen.getByRole('button', { name: 'Second topic' })
    button.focus()
    await user.keyboard('{Enter}')

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region').childNodes[0]).toHaveTextContent(
      'Second content',
    )
  })

  it('expands and collapses with the Space key', async () => {
    const user = userEvent.setup()
    renderDisclosures()

    const button = screen.getByRole('button', { name: 'Second topic' })
    button.focus()
    await user.keyboard(' ')

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('region')).toHaveTextContent('Second content')

    await user.keyboard(' ')

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('collapses again with a second click', async () => {
    const user = userEvent.setup()
    renderDisclosures()

    const button = screen.getByRole('button', { name: 'First topic' })
    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
  })

  it('keeps each disclosure independent', async () => {
    const user = userEvent.setup()
    renderDisclosures()

    const first = screen.getByRole('button', { name: 'First topic' })
    const second = screen.getByRole('button', { name: 'Second topic' })

    await user.click(first)
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(second).toHaveAttribute('aria-expanded', 'false')

    await user.click(second)
    expect(first).toHaveAttribute('aria-expanded', 'true')
    expect(second).toHaveAttribute('aria-expanded', 'true')
  })

  it('gives every disclosure unique stable ids', () => {
    renderDisclosures()

    const first = screen.getByRole('button', { name: 'First topic' })
    const second = screen.getByRole('button', { name: 'Second topic' })

    expect(first.id).not.toBe(second.id)
    expect(first.getAttribute('aria-controls')).not.toBe(
      second.getAttribute('aria-controls'),
    )
  })
})