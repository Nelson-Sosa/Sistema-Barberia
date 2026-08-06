import { NavLink } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Scissors } from 'lucide-react'
import { cn } from '@/utils/cn'
import { NAV_ITEMS } from '@/constants/navigation'
import { APP_NAME } from '@/constants/app'
import { useAuth } from '@/hooks/useAuth'
import InstagramLink from './InstagramLink'

/**
 * Sidebar component — responsive navigation panel.
 *
 * Desktop: collapsible between full (240px) and icon-only (64px) mode
 * Mobile: full overlay drawer controlled by parent (isOpen/onClose props)
 *
 * @param {Object} props
 * @param {boolean} props.isCollapsed - Desktop collapsed state
 * @param {() => void} props.onToggleCollapse - Toggle desktop collapse
 * @param {boolean} props.isMobileOpen - Mobile drawer open state
 * @param {() => void} props.onMobileClose - Close mobile drawer
 */
function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onMobileClose }) {
  const { role, loadingRole } = useAuth()

  const filteredItems = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <>
      {/* ── Mobile Overlay Backdrop ─────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[90] bg-brand-primary/30 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar Panel ───────────────────────────────────────────────── */}
      <aside
        id="main-sidebar"
        aria-label="Navegación principal"
        className={cn(
          'fixed top-0 left-0 z-[100] flex h-[100dvh] flex-col bg-brand-card',
          'border-r border-brand-border',
          'shadow-[1px_0_12px_rgba(0,0,0,0.03)]',
          'transition-all duration-300 ease-in-out',
          'hidden lg:flex',
          isCollapsed ? 'lg:w-16' : 'lg:w-56',
          'lg:!flex',
          isMobileOpen
            ? 'flex !w-64 translate-x-0'
            : 'translate-x-[-100%] lg:translate-x-0'
        )}
      >
        {/* ── Logo / Brand ───────────────────────────────────────────── */}
        <div
          className={cn(
            'flex h-16 items-center border-b border-brand-border',
            isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'
          )}
        >
          <div
            className={cn(
              'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-brand-primary text-brand-gold shadow-sm',
              isCollapsed && 'h-8 w-8'
            )}
          >
            <Scissors className="h-4 w-4" aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="block truncate text-base font-bold tracking-tight text-brand-text">
                {APP_NAME}
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-brand-text-muted">
                Barbería
              </span>
            </div>
          )}
        </div>

        {/* ── Navigation Items ───────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto py-5">
          {loadingRole ? (
            <div className="flex h-full items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-border border-t-brand-primary" />
            </div>
          ) : (
            <ul className="flex flex-col gap-1 px-2.5" role="list">
              {filteredItems.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    title={isCollapsed ? item.label : undefined}
                    onClick={() => {
                      if (isMobileOpen) onMobileClose()
                    }}
                    className={({ isActive }) =>
                      cn(
                        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 min-h-[44px]',
                        'text-sm font-medium transition-all duration-200',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50',
                        isActive
                          ? 'bg-brand-alt-row text-brand-primary'
                          : 'text-brand-text-muted hover:bg-brand-alt-row/70 hover:text-brand-text',
                        isCollapsed && 'justify-center px-2'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active indicator — vertical gold bar */}
                        {isActive && (
                          <span
                            className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-gold"
                            aria-hidden="true"
                          />
                        )}
                        <item.icon
                          className={cn(
                            'h-5 w-5 flex-shrink-0 transition-colors duration-200',
                            isActive
                              ? 'text-brand-primary'
                              : 'text-brand-text-muted group-hover:text-brand-text'
                          )}
                          aria-hidden="true"
                        />
                        {!isCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </nav>

        {/* ── Bottom Section: Instagram + Collapse Toggle ──────────── */}
        <div className="flex flex-col gap-1 border-t border-brand-border p-2.5">
          <InstagramLink isCollapsed={isCollapsed} onMobileClose={onMobileClose} />
          <div className="hidden lg:block">
            <button
              onClick={onToggleCollapse}
              title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
              aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
              aria-expanded={!isCollapsed}
              aria-controls="main-sidebar"
              className={cn(
                'flex w-full items-center rounded-lg px-3 py-2 min-h-[44px]',
                'text-sm text-brand-text-muted transition-colors duration-200',
                'hover:bg-brand-alt-row/70 hover:text-brand-text',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50',
                isCollapsed ? 'justify-center' : 'gap-3'
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span>Colapsar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
