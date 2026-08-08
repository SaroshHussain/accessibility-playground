import { useId, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

export type TabItem = {
  label: string
  content: ReactNode
}

type TabsProps = {
  tabs: TabItem[]
}

export default function Tabs({ tabs }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const baseId = useId()

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = -1

    switch (event.key) {
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
    }

    if (nextIndex !== -1) {
      event.preventDefault()
      setActiveIndex(nextIndex)
      document.getElementById(`${baseId}-tab-${nextIndex}`)?.focus()
    }
  }

  return (
    <div className="tabs">
      <div className="tablist" role="tablist" aria-label="Tabs example">
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
        className="tabpanel"
      >
        {tabs[activeIndex].content}
      </div>
    </div>
  )
}