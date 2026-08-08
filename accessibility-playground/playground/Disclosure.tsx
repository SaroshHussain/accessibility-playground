import { useId, useState } from 'react'
import type { ReactNode } from 'react'

type DisclosureProps = {
  summary: string
  children: ReactNode
}

export default function Disclosure({ summary, children }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const baseId = useId()
  const buttonId = `${baseId}-button`
  const contentId = `${baseId}-content`

  return (
    <div className="disclosure">
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen((open) => !open)}
      >
        {summary}
      </button>
      <div
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        hidden={!isOpen}
        className="disclosure-panel"
      >
        {children}
      </div>
    </div>
  )
}