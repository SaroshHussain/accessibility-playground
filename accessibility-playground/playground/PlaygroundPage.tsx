import ModalDialog from './ModalDialog'
import Tabs from './Tabs'
import type { TabItem } from './Tabs'
import Disclosure from './Disclosure'
import './playground.css'

const tabs: TabItem[] = [
  {
    label: 'Description',
    content: (
      <p>
        This is the description tab. It introduces what this accessible Tabs
        component does and how it should behave for screen reader users.
      </p>
    ),
  },
  {
    label: 'Keyboard support',
    content: (
      <p>
        Use the Left and Right arrow keys to move between tabs. Home moves to
        the first tab and End moves to the last tab.
      </p>
    ),
  },
  {
    label: 'ARIA',
    content: (
      <p>
        Tabs use <code>role=&quot;tablist&quot;</code>,{' '}
        <code>role=&quot;tab&quot;</code>, <code>role=&quot;tabpanel&quot;</code>{' '}
        and <code>aria-selected</code> to expose the state to assistive
        technology.
      </p>
    ),
  },
]

export default function PlaygroundPage() {
  return (
    <main className="playground">
      <h1>Accessibility Playground</h1>
      <p className="playground-intro">
        Hand-built React + TypeScript components to test and practice accessible
        patterns. No component library, no shadcn/ui.
      </p>

      <section className="playground-section">
        <h2>Modal Dialog</h2>
        <p>
          A dialog that traps focus, closes on Escape, and returns focus to the
          trigger button.
        </p>
        <ModalDialog openLabel="Open sample dialog" title="Sample dialog">
          <p>
            This is a simple accessible modal. Click the overlay or the Close
            button below to close it.
          </p>
        </ModalDialog>
      </section>

      <section className="playground-section">
        <h2>Tabs</h2>
        <p>Keyboard navigable tabs following the WAI-ARIA tabs pattern.</p>
        <Tabs tabs={tabs} />
      </section>

      <section className="playground-section">
        <h2>Disclosure</h2>
        <p>
          A show / hide pattern. The button exposes its expanded state with
          aria-expanded.
        </p>
        <Disclosure summary="What is a disclosure?">
          <p>
            A disclosure is a widget where a single button expands or collapses
            a related panel. It is built from a native button and the
            aria-expanded attribute.
          </p>
        </Disclosure>
      </section>
    </main>
  )
}