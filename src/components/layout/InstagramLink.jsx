import { InstagramLogo } from '@phosphor-icons/react'
import { cn } from '@/utils/cn'

function InstagramLink({ isCollapsed, onMobileClose }) {
  return (
    <a
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      title={isCollapsed ? 'Instagram @tu_handle' : undefined}
      aria-label="Instagram @tu_handle"
      onClick={() => onMobileClose?.()}
      className={cn(
        'group relative flex items-center rounded-lg px-3 py-2.5 min-h-[44px]',
        'text-sm font-medium transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50',
        'text-brand-text-muted hover:bg-brand-pastel/20 hover:text-brand-primary',
        isCollapsed ? 'justify-center px-2' : 'gap-3'
      )}
    >
      <InstagramLogo
        className={cn(
          'h-5 w-5 flex-shrink-0 transition-colors duration-200',
          'text-brand-text-muted group-hover:text-pink-500'
        )}
        weight="fill"
        aria-hidden="true"
      />
      {!isCollapsed && (
        <div className="flex flex-col leading-tight">
          <span>Instagram</span>
          <span className="text-[11px] text-brand-text-muted/60">@tu_handle</span>
        </div>
      )}
    </a>
  )
}

export default InstagramLink
