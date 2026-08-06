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
      <div className="group flex flex-col overflow-hidden rounded-2xl border border-brand-border bg-brand-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.18)]">
        {/* ── Image area ────────────────────────────────────────────────── */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-primary">
          {service.imageUrl ? (
            <img
              src={service.imageUrl}
              alt={service.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Scissors className="h-14 w-14 text-brand-gold/70 transition-transform duration-300 group-hover:scale-110" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          )}

          {/* Category chip */}
          {categoryName && (
            <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
              {categoryName}
            </span>
          )}

          {/* Admin actions */}
          {isAdmin && (
            <div className="absolute right-3 top-3 flex items-center gap-1.5">
              <Badge variant={active ? 'success' : 'default'} size="sm" dot>
                {active ? 'Activo' : 'Inactivo'}
              </Badge>
              <button
                onClick={onEdit}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
                title="Editar servicio"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
                title="Eliminar servicio"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* ── Body ──────────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <h3 className="text-base font-semibold leading-snug text-brand-text">{service.name}</h3>
            {service.description && (
              <p className="mt-1 text-sm leading-relaxed text-brand-text-muted line-clamp-2">
                {service.description}
              </p>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-brand-border pt-3">
            <div className="flex items-center gap-1.5 text-xs text-brand-text-muted">
              <Clock className="h-3.5 w-3.5" />
              <span>{service.duration} min</span>
            </div>
            <span className="text-base font-bold text-brand-text">
              {formatCurrency(service.price)}
            </span>
          </div>

          {isAdmin ? (
            <Button
              variant={active ? 'secondary' : 'outline'}
              className="w-full"
              onClick={handleToggleActive}
            >
              {active ? 'Desactivar' : 'Activar'}
            </Button>
          ) : (
            <Button
              className={cn('w-full', !active && 'opacity-100')}
              onClick={onBook}
              disabled={!active}
            >
              Reservar Turno
            </Button>
          )}
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
