import { Menu, Bell } from 'lucide-react'
import { useState, useRef, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useUnreadCount } from '@/hooks/useNotifications'
import { cn } from '@/utils/cn'
import { getInitials } from '@/utils/formatters'
import { APP_NAME, APP_TAGLINE } from '@/constants/app'
import { Z_INDEX } from '@/constants/zIndex'
import DropdownPortal from '@/components/ui/DropdownPortal'
import NotificationsPanel from '@/components/notifications/NotificationsPanel'
import UserMenuDropdown from './UserMenuDropdown'

function Header({ onMenuClick }) {
  const { user, userProfile, logout } = useAuth()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const { data: unreadCount = 0 } = useUnreadCount()

  const bellRef = useRef(null)
  const avatarRef = useRef(null)

  const displayName = userProfile?.displayName || user?.displayName || 'Usuario'
  const email = user?.email || ''
  const initials = getInitials(displayName)
  const isAdmin = userProfile?.role === 'admin'

  const handleLogout = async () => {
    setIsUserMenuOpen(false)
    await logout()
  }

  const toggleNotifications = useCallback(() => {
    setIsNotificationsOpen((v) => {
      if (!v) setIsUserMenuOpen(false)
      return !v
    })
  }, [])

  const toggleUserMenu = useCallback(() => {
    setIsUserMenuOpen((v) => {
      if (!v) setIsNotificationsOpen(false)
      return !v
    })
  }, [])

  return (
    <header
      className="flex h-16 items-center justify-between border-b border-brand-border bg-brand-card/90 px-4 backdrop-blur-xl lg:px-7"
      style={{ zIndex: Z_INDEX.HEADER }}
    >
      {/* ── Left: Hamburger (mobile) + Title/Subtitle ─────────────────── */}
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Abrir menú"
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl',
            'text-brand-text-muted transition-colors hover:bg-brand-alt-row hover:text-brand-primary',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50',
            'lg:hidden'
          )}
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="hidden min-w-0 lg:block">
          <h1 className="truncate text-[15px] font-semibold tracking-tight text-brand-text">
            {APP_NAME}
          </h1>
          <p className="truncate text-xs text-brand-text-muted">{APP_TAGLINE}</p>
        </div>

        <span className="text-sm font-medium text-brand-text lg:hidden">
          {APP_NAME}
        </span>
      </div>

      {/* ── Spacer ────────────────────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Right: Actions ────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 rounded-2xl p-1 md:border md:border-brand-border md:bg-brand-bg/60">
        {/* Notification Bell */}
        <div>
          <button
            ref={bellRef}
            onClick={toggleNotifications}
            aria-label="Notificaciones"
            className={cn(
              'relative flex h-10 w-10 items-center justify-center rounded-xl',
              'text-brand-text-muted transition-all duration-150',
              'hover:bg-brand-alt-row hover:text-brand-primary',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50',
              isNotificationsOpen && 'bg-brand-alt-row text-brand-primary'
            )}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-gold px-1 text-[10px] font-bold leading-none text-white animate-badge-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <DropdownPortal
            triggerRef={bellRef}
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            align="right"
          >
            <NotificationsPanel
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </DropdownPortal>
        </div>

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-brand-border" />

        {/* User Menu */}
        <div>
          <button
            ref={avatarRef}
            id="user-menu-button"
            onClick={toggleUserMenu}
            aria-haspopup="true"
            aria-expanded={isUserMenuOpen}
            aria-controls="user-menu"
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-2 py-1.5 min-h-[44px]',
              'text-sm transition-all duration-150',
              'hover:bg-brand-alt-row',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50',
              isUserMenuOpen && 'bg-brand-alt-row'
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white shadow-sm">
              {initials}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium leading-tight text-brand-text">{displayName}</p>
              <p className="text-[11px] leading-tight text-brand-text-muted">
                {isAdmin ? 'Administrador' : 'Cliente'}
              </p>
            </div>
          </button>

          <DropdownPortal
            triggerRef={avatarRef}
            isOpen={isUserMenuOpen}
            onClose={() => setIsUserMenuOpen(false)}
            align="right"
          >
            <UserMenuDropdown
              isOpen={isUserMenuOpen}
              onClose={() => setIsUserMenuOpen(false)}
              displayName={displayName}
              email={email}
              initials={initials}
              isAdmin={isAdmin}
              onLogout={handleLogout}
            />
          </DropdownPortal>
        </div>
      </div>
    </header>
  )
}

export default Header
