import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type ModalDialogProps = {
  openLabel: string
  title: string
  children: ReactNode
}

export default function ModalDialog({
  openLabel,
  title,
  children,
}: ModalDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const baseId = useId()
  const titleId = `${baseId}-title`
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  function close() {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!isOpen) return

    const dialog = dialogRef.current
    dialog?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        close()
        return
      }
      if (event.key !== 'Tab' || !dialog) return

      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  return (
    <>
      <button type="button" ref={triggerRef} onClick={() => setIsOpen(true)}>
        {openLabel}
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={close}>
          <div
            ref={dialogRef}
            className="modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id={titleId}>{title}</h2>
            <div className="modal-body">{children}</div>
            <button type="button" onClick={close}>
              Close dialog
            </button>
          </div>
        </div>
      )}
    </>
  )
}