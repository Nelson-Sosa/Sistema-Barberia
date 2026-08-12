import { cn } from '@/utils/cn'

/**
 * FormGrid — responsive grid for form fields.
 *
 * Single column on mobile and tablet; expands to multiple columns from lg
 * (1024px) onward, where there is enough horizontal space. This keeps inputs
 * usable on small screens instead of squeezing two columns into a narrow modal.
 *
 * @param {number} cols - max columns on large screens (2 or 3)
 */
export default function FormGrid({ cols = 2, className, children, ...props }) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-4',
        cols === 2 && 'lg:grid-cols-2',
        cols === 3 && 'lg:grid-cols-2 2xl:grid-cols-3',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
