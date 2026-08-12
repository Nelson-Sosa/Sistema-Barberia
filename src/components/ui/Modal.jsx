import { useEffect } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/utils/cn'
import { Z_INDEX } from '@/constants/zIndex'

/**
 * Modal — reusable, fully responsive dialog.
 *
 * Features:
 * - Perfectly centered and capped to the viewport height (no double scroll).
 * - Sticky header and optional sticky footer; only the body scrolls, so the
 *   main actions (Guardar / Cancelar) stay always visible.
 * - Single max-width utility (never combined with max-w-[95vw], which would
 *   conflict at build time).
 * - Body scroll is locked while the modal is open.
 *
 * @param {string}  maxWidthClass - width cap, default "max-w-lg"
 * @param {ReactNode} footer      - sticky footer content (use FormActions)
 * @param {string}  bodyClassName - extra classes for the scrollable body
 */
function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  bodyClassName,
  maxWidthClass = 'max-w-lg',
  hideHeader = false,
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 overflow-y-auto" style={{ zIndex: Z_INDEX.MODAL }}>
      {/* Overlay — covers the full viewport including sidebar */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centering wrapper — min-h-full + items-center keeps the dialog reachable */}
      <div className="relative flex min-h-full items-center justify-center p-3 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative flex w-full flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card',
            'shadow-[0_24px_64px_-16px_rgba(0,0,0,0.25)]',
            'max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)]',
            maxWidthClass,
            className
          )}
        >
          {/* Sticky header */}
          {!hideHeader && (
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-brand-border px-5 pb-4 pt-5 sm:px-6">
              <div className="min-w-0 pr-2">
                {title && (
                  <h2 className="text-lg font-bold text-brand-text sm:text-xl">{title}</h2>
                )}
                {description && (
                  <p className="mt-0.5 text-sm text-brand-text-muted">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar"
                className="shrink-0 rounded-lg p-1.5 text-brand-text-muted transition-colors hover:bg-brand-alt-row hover:text-brand-primary"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Scrollable body */}
          <div className={cn('flex-1 overflow-y-auto p-5 sm:p-6', bodyClassName)}>
            {children}
          </div>

          {/* Sticky footer — always visible, keeps actions reachable */}
          {footer && (
            <div className="shrink-0 border-t border-brand-border bg-brand-card px-5 py-3.5 sm:px-6">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default Modal
