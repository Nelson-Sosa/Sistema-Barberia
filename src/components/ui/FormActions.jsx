import { Children, cloneElement, isValidElement } from 'react'
import { cn } from '@/utils/cn'

/**
 * FormActions — consistent, responsive action row for forms and modals.
 *
 * On mobile every action becomes full-width (primary stacked above), from sm+
 * onward they align to the right in a single row. Pass <Button> children.
 */
export default function FormActions({ children, className }) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3',
        className
      )}
    >
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child, {
              className: cn(child.props.className, 'w-full sm:w-auto'),
            })
          : child
      )}
    </div>
  )
}
