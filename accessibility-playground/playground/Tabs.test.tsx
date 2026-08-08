import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import Tabs from './Tabs'
import type { TabItem } from './Tabs'

const tabs: TabItem[] = [
  { label: 'First', content: <p>First panel</p> },
  { label: 'Second', content: <p>Second panel</p> },
  { label: 'Third', content: <p>Third panel</p> },
]

function renderTabs() {
  render(<Tabs label="Example tabs" tabs={tabs} />)
}

function renderTabsAfterElement() {
  return render(
    <div>
      <button type="button">Before tabs</button>
      <Tabs label="Example tabs" tabs={tabs} />
    </div>,
  )
}

describe('Tabs', () => {
  it('exposes the correct tab semantics', () => {
    renderTabs()

    const tablist = screen.getByRole('tablist')
    expect(tablist).toHaveAccessibleName('Example tabs')

    const firstTab = screen.getByRole('tab', { name: 'First' })
    const secondTab = screen.getByRole('tab', { name: 'Second' })
    const thirdTab = screen.getByRole('tab', { name: 'Third' })

    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(secondTab).toHaveAttribute('aria-selected', 'false')
    expect(thirdTab).toHaveAttribute('aria-selected', 'false')

    const panel = screen.getByRole('tabpanel')
    const panelId = panel.getAttribute('id')
    expect(panelId).toBeTruthy()
    expect(panel).toHaveAccessibleName('First')

    // aria-controls on the tab points to its panel, and aria-labelledby on
    // the panel points back to its tab.
    expect(firstTab.getAttribute('aria-controls')).toBe(panelId)
    expect(panel.getAttribute('aria-labelledby')).toBe(
      firstTab.getAttribute('id'),
    )
  })

  it('only keeps the active tab in the page Tab order', () => {
    renderTabs()

    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
      'tabindex',
      '0',
    )
    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute(
      'tabindex',
      '-1',
    )
    expect(screen.getByRole('tab', { name: 'Third' })).toHaveAttribute(
      'tabindex',
      '-1',
    )

    // The panel has no focusable content, so it joins the tab sequence.
    expect(screen.getByRole('tabpanel')).toHaveAttribute('tabindex', '0')
  })

  it('activates the clicked tab and shows its panel', async () => {
    const user = userEvent.setup()
    renderTabs()

    expect(screen.getByRole('tabpanel')).toHaveTextContent('First panel')

    await user.click(screen.getByRole('tab', { name: 'Second' }))

    expect(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tab', { name: 'First' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Second')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Second panel')
  })

  it('moves focus and activates the next tab with Arrow Right', () => {
    renderTabs()

    const firstTab = screen.getByRole('tab', { name: 'First' })
    firstTab.focus()

    fireEvent.keyDown(firstTab, { key: 'ArrowRight' })

    const secondTab = screen.getByRole('tab', { name: 'Second' })
    expect(secondTab).toHaveFocus()
    expect(secondTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Second panel')
  })

  it('moves focus and activates the previous tab with Arrow Left', () => {
    renderTabs()

    const secondTab = screen.getByRole('tab', { name: 'Second' })
    secondTab.focus()

    fireEvent.keyDown(secondTab, { key: 'ArrowLeft' })

    const firstTab = screen.getByRole('tab', { name: 'First' })
    expect(firstTab).toHaveFocus()
    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('First panel')
  })

  it('wraps from the last tab to the first with Arrow Right', () => {
    renderTabs()

    const thirdTab = screen.getByRole('tab', { name: 'Third' })
    thirdTab.focus()

    fireEvent.keyDown(thirdTab, { key: 'ArrowRight' })

    const firstTab = screen.getByRole('tab', { name: 'First' })
    expect(firstTab).toHaveFocus()
    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('First panel')
  })

  it('wraps from the first tab to the last with Arrow Left', () => {
    renderTabs()

    const firstTab = screen.getByRole('tab', { name: 'First' })
    firstTab.focus()

    fireEvent.keyDown(firstTab, { key: 'ArrowLeft' })

    const thirdTab = screen.getByRole('tab', { name: 'Third' })
    expect(thirdTab).toHaveFocus()
    expect(thirdTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Third panel')
  })

  it('moves to the first tab with Home', () => {
    renderTabs()

    const secondTab = screen.getByRole('tab', { name: 'Second' })
    secondTab.focus()

    fireEvent.keyDown(secondTab, { key: 'Home' })

    const firstTab = screen.getByRole('tab', { name: 'First' })
    expect(firstTab).toHaveFocus()
    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('First panel')
  })

  it('moves to the last tab with End', () => {
    renderTabs()

    const firstTab = screen.getByRole('tab', { name: 'First' })
    firstTab.focus()

    fireEvent.keyDown(firstTab, { key: 'End' })

    const thirdTab = screen.getByRole('tab', { name: 'Third' })
    expect(thirdTab).toHaveFocus()
    expect(thirdTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Third panel')
  })

  it('does not prevent Tab so focus can leave the tab list', () => {
    renderTabs()

    const firstTab = screen.getByRole('tab', { name: 'First' })
    firstTab.focus()

    // fireEvent returns false when the event was cancelled (preventDefault),
    // so true means the Tab key is not trapped inside the tab list.
    expect(fireEvent.keyDown(firstTab, { key: 'Tab' })).toBe(true)
  })

  it('places focus on the first tab when Tab reaches the tab list', async () => {
    const user = userEvent.setup()
    renderTabsAfterElement()

    screen.getByRole('button', { name: 'Before tabs' }).focus()
    await user.tab()

    expect(screen.getByRole('tab', { name: 'First' })).toHaveFocus()
  })

  it('places focus on the active tab when Tab re-enters the tab list', async () => {
    const user = userEvent.setup()
    renderTabsAfterElement()

    // Change the selected tab to Second.
    await user.click(screen.getByRole('tab', { name: 'Second' }))

    // Leave the tab list and come back with Tab: focus must land on the
    // currently active tab (Second), not the first one.
    screen.getByRole('button', { name: 'Before tabs' }).focus()
    await user.tab()

    expect(screen.getByRole('tab', { name: 'Second' })).toHaveFocus()
  })

  it('moves from the tab list into the tab panel with Tab', async () => {
    const user = userEvent.setup()
    renderTabsAfterElement()

    screen.getByRole('button', { name: 'Before tabs' }).focus()
    await user.tab()
    await user.tab()

    expect(screen.getByRole('tabpanel')).toHaveFocus()
  })

  it('ignores Arrow Up and Arrow Down in a horizontal tab list', () => {
    renderTabs()

    const firstTab = screen.getByRole('tab', { name: 'First' })
    firstTab.focus()

    // Per the APG, a horizontal tab list does not handle Up/Down so the
    // browser can scroll normally with those keys.
    expect(fireEvent.keyDown(firstTab, { key: 'ArrowDown' })).toBe(true)
    expect(fireEvent.keyDown(firstTab, { key: 'ArrowUp' })).toBe(true)

    expect(firstTab).toHaveFocus()
    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('First panel')
  })
})