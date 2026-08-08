import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'

type ModalDialogProps = {
  triggerLabel: string
  title: string
  children: ReactNode
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
    ),
  )
}

export default function ModalDialog({
  triggerLabel,
  title,
  children,
}: ModalDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const baseId = useId()
  const titleId = `${baseId}-title`
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const dialog = dialogRef.current
    if (!dialog) return
    const trigger = triggerRef.current

    // WAI-ARIA: when the dialog opens, focus moves to an element inside it.
    // Generally that is the first focusable element.
    const focusables = getFocusableElements(dialog)
    if (focusables.length > 0) {
      focusables[0].focus()
    } else {
      dialog.focus()
    }

    // WAI-ARIA: content outside a modal dialog is inert, and the dialog must
    // not be inside the inert layer, so make every other body child inert.
    const body = document.body
    const inertElements: HTMLElement[] = []
    body.childNodes.forEach((node) => {
      if (
        node instanceof HTMLElement &&
        !node.contains(dialog) &&
        !dialog.contains(node)
      ) {
        node.inert = true
        inertElements.push(node)
      }
    })

    // Prevent the page behind the dialog from scrolling while it is open.
    const previousOverflow = body.style.overflow
    body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      // Escape closes the dialog.
      if (event.key === 'Escape') {
        setIsOpen(false)
        return
      }

      // Tab and Shift + Tab keep focus cycling inside the dialog.
      if (event.key !== 'Tab' || !dialog) return

      const focusable = getFocusableElements(dialog)
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

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      inertElements.forEach((element) => {
        element.inert = false
      })
      body.style.overflow = previousOverflow
      // WAI-ARIA: when the dialog closes, focus returns to the trigger.
      trigger?.focus()
    }
  }, [isOpen])

  return (
    <>
      <button type="button" ref={triggerRef} onClick={() => setIsOpen(true)}>
        {triggerLabel}
      </button>

      {isOpen &&
        createPortal(
          <div className="modal-overlay" onClick={() => setIsOpen(false)}>
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
              <button type="button" onClick={() => setIsOpen(false)}>
                Close dialog
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}