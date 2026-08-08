import { useId, useState } from 'react'
import type { ReactNode } from 'react'

type DisclosureProps = {
  summary: string
  children: ReactNode
}

export default function Disclosure({ summary, children }: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(false)
  const baseId = useId()

  return (
    <div className="disclosure">
      <button
        type="button"
        id={`${baseId}-button`}
        aria-expanded={isOpen}
        aria-controls={`${baseId}-panel`}
        onClick={() => setIsOpen((open) => !open)}
      >
        {summary}
      </button>
      <div
        id={`${baseId}-panel`}
        role="region"
        aria-labelledby={`${baseId}-button`}
        hidden={!isOpen}
        className="disclosure-panel"
      >
        {children}
      </div>
    </div>
  )
}