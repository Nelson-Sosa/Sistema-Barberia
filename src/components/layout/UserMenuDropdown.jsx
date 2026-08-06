import { LogOut, User, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routes'
import { cn } from '@/utils/cn'

function UserMenuDropdown({ isOpen, onClose, displayName, email, initials, isAdmin, onLogout }) {
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <div
      className={cn(
        'w-56 origin-top-right animate-slide-down',
        'rounded-2xl border border-brand-border bg-brand-card',
        'shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)]',
        'overflow-hidden'
      )}
    >
      <div className="flex items-center gap-3 border-b border-brand-border px-4 py-3">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-brand-text">{displayName}</p>
          <p className="mt-0.5 truncate text-xs text-brand-text-muted">{email}</p>
        </div>
      </div>

      <div className="p-1">
        <button
          role="menuitem"
          onClick={() => {
            onClose()
            navigate(ROUTES.PROFILE)
          }}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2',
            'text-sm text-brand-text-muted transition-colors hover:bg-brand-alt-row hover:text-brand-primary'
          )}
        >
          <User className="h-4 w-4 text-brand-text-muted" aria-hidden="true" />
          Mi perfil
        </button>

        {isAdmin && (
          <button
            role="menuitem"
            onClick={() => {
              onClose()
              navigate(ROUTES.SETTINGS)
            }}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2',
              'text-sm text-brand-text-muted transition-colors hover:bg-brand-alt-row hover:text-brand-primary'
            )}
          >
            <Settings className="h-4 w-4 text-brand-text-muted" aria-hidden="true" />
            Configuración
          </button>
        )}

        <div className="my-1 border-t border-brand-border" />

        <button
          role="menuitem"
          onClick={onLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2',
            'text-sm text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-600'
          )}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )
}

export default UserMenuDropdown
