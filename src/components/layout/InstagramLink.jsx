import { cn } from '@/utils/cn'

function InstagramIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

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
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50',
        'text-brand-text-muted hover:bg-brand-alt-row/70 hover:text-brand-text',
        isCollapsed ? 'justify-center px-2' : 'gap-3'
      )}
    >
      <InstagramIcon
        className={cn(
          'h-5 w-5 flex-shrink-0 transition-colors duration-200',
          'text-brand-text-muted group-hover:text-brand-text'
        )}
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
