import { useState } from 'react'
import { Clock, Edit2, Trash2, Scissors } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatCurrency } from '@/utils/formatters'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useToggleServiceActive, useDeleteService } from '@/hooks/useServices'
import { cn } from '@/utils/cn'

/**
 * ServiceCard — premium catalog card for a single service.
 * Includes an image area (professional photo when `imageUrl` exists,
 * elegant branded placeholder otherwise), name, category, duration,
 * price, short description and a Reservar action.
 */
function ServiceCard({ service, categoryName, isAdmin, onBook, onEdit }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { mutate: toggleActive } = useToggleServiceActive()
  const { mutateAsync: deleteService, isPending: isDeleting } = useDeleteService()

  const handleToggleActive = () => {
    toggleActive({ id: service.id, active: !service.active })
  }

  const handleDelete = async () => {
    try {
      await deleteService(service.id)
      toast.success('Servicio eliminado correctamente')
      setShowDeleteConfirm(false)
    } catch {
      toast.error('No se pudo eliminar el servicio')
    }
  }

  const active = service.active !== false

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)]">
        {/* ── Image / Header area (~96px max) ───────────────────────────── */}
        <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-[#202020] via-[#181818] to-[#121212]">
          {service.imageUrl ? (
            <img
              src={service.imageUrl}
              alt={service.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05] border border-white/[0.08] shadow-inner transition-transform duration-300 group-hover:scale-105">
                <Scissors className="h-7 w-7 text-brand-gold transition-transform duration-300" />
              </div>
            </div>
          )}

          {/* Admin actions */}
          {isAdmin && (
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
              <button
                onClick={onEdit}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                title="Editar servicio"
                type="button"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                title="Eliminar servicio"
                type="button"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Body (16px internal padding) ─────────────────────────────── */}
        <div className="flex flex-1 flex-col justify-between p-4 bg-brand-card">
          <div className="space-y-1.5">
            {/* Title & status */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-[17px] font-semibold leading-snug text-brand-text line-clamp-2">
                {service.name}
              </h3>
              {isAdmin && (
                <Badge variant={active ? 'success' : 'default'} size="sm" dot className="shrink-0 mt-0.5">
                  {active ? 'Activo' : 'Inactivo'}
                </Badge>
              )}
            </div>

            {/* Duration directly below name */}
            <div className="flex items-center gap-1.5 text-xs text-brand-text-muted">
              <Clock className="h-3.5 w-3.5 text-brand-text-muted shrink-0" />
              <span>{service.duration} min</span>
            </div>

            {/* Optional Description */}
            {service.description && (
              <p className="pt-0.5 text-xs leading-relaxed text-brand-text-muted line-clamp-2">
                {service.description}
              </p>
            )}
          </div>

          {/* ── Action & Price Row ───────────────────────────────────────── */}
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-brand-border/70 pt-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-text-muted/80">
                Precio
              </span>
              <span className="text-lg font-bold tracking-tight text-brand-gold truncate">
                {formatCurrency(service.price)}
              </span>
            </div>

            {isAdmin ? (
              <Button
                variant={active ? 'secondary' : 'outline'}
                className="h-11 min-h-[44px] px-4 text-xs font-semibold rounded-xl shrink-0"
                onClick={handleToggleActive}
              >
                {active ? 'Desactivar' : 'Activar'}
              </Button>
            ) : (
              <Button
                className={cn(
                  'h-11 min-h-[44px] px-5 rounded-xl text-sm font-semibold tracking-wide shrink-0',
                  'bg-brand-gold text-brand-primary shadow-sm shadow-brand-gold/20',
                  'hover:bg-[#b89322] active:bg-[#a17e17]',
                  'focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2',
                  'transition-all duration-200',
                  !active && 'opacity-60 cursor-not-allowed'
                )}
                onClick={onBook}
                disabled={!active}
              >
                Reservar Turno
              </Button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Eliminar Servicio"
        message={`¿Estás seguro de que querés eliminar "${service.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        isLoading={isDeleting}
      />
    </>
  )
}

export default ServiceCard
