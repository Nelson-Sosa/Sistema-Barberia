import { AlertTriangle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import FormActions from '@/components/ui/FormActions'

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel, isLoading }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-sm"
      hideHeader
      bodyClassName="p-6"
      footer={
        <FormActions>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isLoading}>
            {confirmLabel || 'Eliminar'}
          </Button>
        </FormActions>
      }
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-brand-text">{title}</h2>
          <p className="mt-1 text-sm text-brand-text-muted">{message}</p>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog
