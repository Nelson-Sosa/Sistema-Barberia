import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Edit2, Plus, Scissors } from 'lucide-react'
import {
  RazorIcon, ClippersIcon, BeardIcon, MustacheIcon, CombIcon, ProductsIcon, ChairIcon,
} from '@/components/icons/CategoryIcons'
import { formatCurrency } from '@/utils/formatters'
import ServiceCard from './ServiceCard'

const CATEGORY_ICONS = [
  /* More specific patterns first */
  ['cortes', Scissors],
  ['corte', Scissors],
  ['hair', Scissors],
  ['pelo', Scissors],
  ['cabello', Scissors],
  ['fade', Scissors],
  ['navaja', RazorIcon],
  ['rasurado', RazorIcon],
  ['shave', RazorIcon],
  ['afeitado', RazorIcon],
  ['maquina', ClippersIcon],
  ['clipper', ClippersIcon],
  ['barba', BeardIcon],
  ['beard', BeardIcon],
  ['bigote', MustacheIcon],
  ['mustache', MustacheIcon],
  ['moustache', MustacheIcon],
  ['peine', CombIcon],
  ['comb', CombIcon],
  ['producto', ProductsIcon],
  ['capilar', ProductsIcon],
  ['shampoo', ProductsIcon],
  ['champu', ProductsIcon],
  ['silla', ChairIcon],
  ['chair', ChairIcon],
  ['tinte', Scissors],
  ['color', Scissors],
  ['spa', Scissors],
  ['tratamiento', Scissors],
  ['facial', Scissors],
]

function getCategoryIcon(name) {
  const key = (name || '').toLowerCase().trim()
  for (const [pattern, Icon] of CATEGORY_ICONS) {
    if (key.includes(pattern)) return Icon
  }
  return Scissors
}

function CategoryCard({ category, services, isAdmin, onEditCategory, onAddService, onEditService, onDeleteService, onBook, defaultOpen }) {
  const [isOpen, setIsOpen] = useState(defaultOpen ?? true)

  const activeServices = services.filter((s) => s.active !== false)
  const Icon = getCategoryIcon(category.name)

  const minPrice = activeServices.length ? Math.min(...activeServices.map((s) => s.price)) : 0

  return (
    <section className="rounded-2xl border border-brand-border bg-brand-card shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      {/* ── Category Header ── */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(!isOpen) } }}
        className="group/header flex w-full items-center gap-3 px-4 py-5 text-left cursor-pointer select-none sm:px-6"
      >
        {/* LEFT: Icon + Name */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span
            role="img"
            aria-label={`Categoría: ${category.name}`}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-brand-border bg-brand-alt-row text-brand-primary transition-all duration-200 group-hover/header:border-brand-border"
          >
            <Icon className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-lg font-semibold tracking-tight text-brand-text">{category.name}</h3>
            </div>
            {category.description && (
              <p className="mt-0.5 line-clamp-1 text-sm text-brand-text-muted">{category.description}</p>
            )}
          </div>
        </div>

        {/* RIGHT: Stats + Actions + Chevron */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {minPrice > 0 && (
            <span className="hidden whitespace-nowrap text-xs text-brand-text-muted md:block">
              Desde {formatCurrency(minPrice)}
            </span>
          )}

          <span className="hidden items-center gap-1 rounded-full border border-brand-border bg-brand-alt-row px-2.5 py-1 text-xs font-medium text-brand-text-muted sm:inline-flex">
            {activeServices.length} servicio{activeServices.length !== 1 ? 's' : ''}
          </span>

          {isAdmin && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEditCategory(category) }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-brand-text-muted transition-all duration-200 hover:bg-brand-alt-row hover:text-brand-primary"
                title="Editar categoría"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onAddService(category) }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-brand-text-muted transition-all duration-200 hover:bg-brand-alt-row hover:text-brand-primary"
                title="Agregar servicio"
              >
                <Plus className="h-4 w-4" />
              </button>
            </>
          )}

          <motion.div
            animate={{ rotate: isOpen ? 0 : -90 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="shrink-0"
          >
            <ChevronDown className="h-4 w-4 text-brand-text-muted sm:h-5 sm:w-5" />
          </motion.div>
        </div>
      </div>

      {/* ── Collapsible Content ── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="mx-6 border-t border-brand-border" />

            {activeServices.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-brand-text-muted">
                No hay servicios en esta categoría.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5 p-3.5 sm:grid-cols-2 sm:gap-4 sm:p-5 lg:grid-cols-3 xl:grid-cols-4">
                {activeServices.map((svc, i) => (
                  <motion.div
                    key={svc.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3), ease: 'easeOut' }}
                  >
                    <ServiceCard
                      service={svc}
                      categoryName={category.name}
                      isAdmin={isAdmin}
                      onBook={() => onBook(svc.id)}
                      onEdit={() => onEditService(svc)}
                      onDelete={() => onDeleteService?.(svc)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default CategoryCard
