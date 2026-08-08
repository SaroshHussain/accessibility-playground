import { useId, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

export type TabItem = {
  label: string
  content: ReactNode
}

type TabsProps = {
  label: string
  tabs: TabItem[]
}

export default function Tabs({ label, tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const baseId = useId()

  function activateTab(index: number) {
    setActiveIndex(index)
    document.getElementById(`${baseId}-tab-${index}`)?.focus()
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let nextIndex: number | null = null

    switch (event.key) {
      // The APG pattern keeps focus in the tab list and wraps around.
      case 'ArrowRight':
        nextIndex = (index + 1) % tabs.length
        break
      case 'ArrowLeft':
        nextIndex = (index - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = tabs.length - 1
        break
      case 'Tab':
        // No preventDefault: Tab leaves the tab list and enters the panel.
        return
    }

    if (nextIndex !== null) {
      event.preventDefault()
      activateTab(nextIndex)
    }
  }

  return (
    <div className="tabs">
      <div className="tablist" role="tablist" aria-label={label}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={tab.label}
              id={`${baseId}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={isActive ? 0 : -1}
              className={isActive ? 'tab active' : 'tab'}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
      <div
        id={`${baseId}-panel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${activeIndex}`}
        tabIndex={0}
        className="tabpanel"
      >
        {tabs[activeIndex].content}
      </div>
    </div>
  )
}