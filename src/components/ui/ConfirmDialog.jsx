import { AlertTriangle, X } from 'lucide-react'
import Button from '@/components/ui/Button'

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel, isLoading }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-primary/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-2xl border border-brand-border bg-brand-card p-6 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.3)] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-brand-text-muted hover:bg-brand-alt-row hover:text-brand-primary z-50"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-brand-text">{title}</h2>
            <p className="mt-1 text-sm text-brand-text-muted">{message}</p>
          </div>

          <div className="mt-2 flex w-full gap-3">
            <Button variant="ghost" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button variant="danger" className="flex-1" onClick={onConfirm} loading={isLoading}>
              {confirmLabel || 'Eliminar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
