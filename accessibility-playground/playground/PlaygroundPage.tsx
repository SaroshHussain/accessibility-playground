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
          Open the dialog, then try Tab and Shift + Tab. Focus stays inside the
          dialog until you close it with the Close button, the overlay, or the
          Escape key.
        </p>
        <ModalDialog triggerLabel="Open dialog" title="Sample modal dialog">
          <p>
            This is an accessible modal dialog. Try tabbing through the
            interactive elements below with Tab and Shift + Tab.
          </p>
          <label htmlFor="modal-name">Your name</label>
          <input id="modal-name" type="text" placeholder="Type your name" />
          <p>
            <a
              href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
              target="_blank"
              rel="noreferrer"
            >
              WAI-ARIA modal dialog pattern
            </a>
          </p>
          <button type="button">Another button</button>
        </ModalDialog>
        <div className="modal-background-test">
          <p>
            This content sits behind the dialog. While the dialog is open the
            rest of the page is inert, so this button cannot be clicked or
            focused.
          </p>
          <button type="button">Button behind the dialog</button>
        </div>
      </section>

      <section className="playground-section">
        <h2>Tabs</h2>
        <p>Keyboard navigable tabs following the WAI-ARIA tabs pattern.</p>
        <Tabs label="Playground tabs" tabs={tabs} />
      </section>

      <section className="playground-section">
        <h2>Disclosure</h2>
        <p>
          A show / hide pattern. The button exposes its expanded state with
          aria-expanded and connects to the content with aria-controls.
        </p>
        <Disclosure summary="What is a disclosure?">
          <p>
            A disclosure is a widget where a single button expands or collapses
            a related panel of content. It is built from a native button and
            the aria-expanded attribute.
          </p>
        </Disclosure>
        <Disclosure summary="How do I activate a disclosure?">
          <p>
            Move focus to the button and press Enter or the Space bar. The
            same keys collapse it again.
          </p>
        </Disclosure>
      </section>
    </main>
  )
}