import { useState, useMemo } from 'react'
import { Scissors, Plus, FolderKanban, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePageTitle } from '@/hooks/usePageTitle'
import { useAuth } from '@/hooks/useAuth'
import { useServices, useAllServices, useDeleteService } from '@/hooks/useServices'
import { useCategories } from '@/hooks/useServiceCategories'
import { ROUTES } from '@/routes/routes'
import { USER_ROLES } from '@/constants/app'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import CategoryCard from './components/CategoryCard'
import ServiceModal from './components/ServiceModal'
import CategoryModal from './components/CategoryModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import toast from 'react-hot-toast'
import { cn } from '@/utils/cn'

function ServicesPage() {
  usePageTitle('Servicios')
  const navigate = useNavigate()

  const { role } = useAuth()
  const isAdmin = role === USER_ROLES.ADMIN

  const [serviceModalOpen, setServiceModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [preSelectedCategoryId, setPreSelectedCategoryId] = useState(null)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [serviceToDelete, setServiceToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all')

  const { data: rawServices, isLoading } = isAdmin ? useAllServices() : useServices()
  const { data: categories } = useCategories()
  const { mutateAsync: deleteService, isPending: isDeleting } = useDeleteService()

  const grouped = useMemo(() => {
    if (!rawServices) return { categories: [], uncategorized: [] }

    const query = searchQuery.toLowerCase().trim()

    // Create a map of categories for quick lookup
    const categoryMap = (categories || []).reduce((acc, cat) => {
      acc[cat.id] = cat
      return acc
    }, {})

    // Filter services based on query
    const filteredServices = rawServices.filter((svc) => {
      if (!query) return true

      const serviceNameMatch = svc.name?.toLowerCase().includes(query)
      const serviceDescMatch = svc.description?.toLowerCase().includes(query)
      
      const cat = categoryMap[svc.categoryId]
      const categoryMatch = cat?.name?.toLowerCase().includes(query)
      
      return serviceNameMatch || serviceDescMatch || categoryMatch
    })

    const catMap = {}
    const uncategorized = []

    filteredServices.forEach((svc) => {
      const catId = svc.categoryId
      if (catId && categoryMap[catId]) {
        if (!catMap[catId]) catMap[catId] = []
        catMap[catId].push(svc)
      } else {
        uncategorized.push(svc)
      }
    })

    const result = (categories || []).map((cat) => ({
      category: cat,
      services: catMap[cat.id] || [],
    })).filter((g) => g.services.length > 0 || (isAdmin && (!query || g.category.name.toLowerCase().includes(query))))

    return { categories: result, uncategorized }
  }, [rawServices, categories, isAdmin, searchQuery])

  const handleBookService = (serviceId) => {
    // Both registered users and guests book through the public booking page
    // (guests can complete the reservation without creating an account).
    navigate(ROUTES.BOOKING, { state: { selectedServiceId: serviceId } })
  }

  const handleEditService = (service) => {
    setSelectedService(service)
    setPreSelectedCategoryId(null)
    setServiceModalOpen(true)
  }

  const handleAddServiceInCategory = (category) => {
    setSelectedService(null)
    setPreSelectedCategoryId(category.id)
    setServiceModalOpen(true)
  }

  const handleAddServiceGeneric = () => {
    setSelectedService(null)
    setPreSelectedCategoryId(null)
    setServiceModalOpen(true)
  }

  const handleEditCategory = (category) => {
    setSelectedCategory(category)
    setCategoryModalOpen(true)
  }

  const handleCloseServiceModal = () => {
    setSelectedService(null)
    setPreSelectedCategoryId(null)
    setServiceModalOpen(false)
  }

  const handleCloseCategoryModal = () => {
    setSelectedCategory(null)
    setCategoryModalOpen(false)
  }

  const handleDeleteService = async () => {
    if (!serviceToDelete) return
    try {
      await deleteService(serviceToDelete.id)
      toast.success('Servicio eliminado')
      setServiceToDelete(null)
    } catch (error) {
      toast.error('Ocurrió un error al eliminar')
    }
  }

  const displayedCategories = useMemo(() => {
    if (selectedCategoryFilter === 'all') return grouped.categories
    return grouped.categories.filter((g) => g.category.id === selectedCategoryFilter)
  }, [grouped.categories, selectedCategoryFilter])

  const displayedUncategorized = useMemo(() => {
    if (selectedCategoryFilter === 'all' || selectedCategoryFilter === 'uncategorized') {
      return grouped.uncategorized
    }
    return []
  }, [grouped.uncategorized, selectedCategoryFilter])

  const hasAnyServices = rawServices?.length > 0
  const hasFilteredServices = displayedCategories.length > 0 || displayedUncategorized.length > 0
  const hasMultipleCategories = (grouped.categories.length + (grouped.uncategorized.length > 0 ? 1 : 0)) > 1

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-24 sm:pb-16">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-card px-3 py-1 text-xs font-medium text-brand-text-muted">
            <Scissors className="h-3.5 w-3.5 text-brand-gold" />
            Catálogo
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-text sm:text-3xl">
            Catálogo de Servicios
          </h1>
          <p className="mt-1.5 text-sm text-brand-text-muted">
            Explorá nuestros servicios y reservá tu turno.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isAdmin && (
            <>
              <Button
                variant="secondary"
                leftIcon={<FolderKanban className="h-4 w-4" />}
                onClick={() => setCategoryModalOpen(true)}
              >
                Nueva Categoría
              </Button>
              <Button
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={handleAddServiceGeneric}
              >
                Nuevo Servicio
              </Button>
            </>
          )}
        </div>
      </div>

      {/* ── Search & Filters ────────────────────────────────────────────────── */}
      {hasAnyServices && (
        <div className="flex flex-col gap-3">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-brand-text-muted" />
            </div>
            <input
              type="text"
              className="h-10 w-full rounded-xl border border-brand-border bg-brand-card pl-10 pr-10 text-sm text-brand-text placeholder:text-brand-text-muted transition-all focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
              placeholder="Buscar por nombre, descripción o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-text-muted transition-colors hover:text-brand-text"
                aria-label="Limpiar búsqueda"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Horizontal scrollable category tabs */}
          {hasMultipleCategories && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-1 px-1">
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('all')}
                className={cn(
                  'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                  selectedCategoryFilter === 'all'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'border border-brand-border bg-brand-card text-brand-text-muted hover:bg-brand-alt-row hover:text-brand-text'
                )}
              >
                Todos ({rawServices?.length || 0})
              </button>
              {grouped.categories.map(({ category, services }) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(category.id)}
                  className={cn(
                    'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                    selectedCategoryFilter === category.id
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'border border-brand-border bg-brand-card text-brand-text-muted hover:bg-brand-alt-row hover:text-brand-text'
                  )}
                >
                  {category.name} ({services.length})
                </button>
              ))}
              {grouped.uncategorized.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedCategoryFilter('uncategorized')}
                  className={cn(
                    'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                    selectedCategoryFilter === 'uncategorized'
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'border border-brand-border bg-brand-card text-brand-text-muted hover:bg-brand-alt-row hover:text-brand-text'
                  )}
                >
                  Sin categoría ({grouped.uncategorized.length})
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Catalog ─────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : hasAnyServices ? (
        hasFilteredServices ? (
          <div className="flex flex-col gap-8">
            {/* Grouped by category */}
            {displayedCategories.map(({ category, services }) => (
              <CategoryCard
                key={category.id}
                category={category}
                services={services}
                isAdmin={isAdmin}
                onEditCategory={handleEditCategory}
                onAddService={handleAddServiceInCategory}
                onEditService={handleEditService}
                onDeleteService={setServiceToDelete}
                onBook={handleBookService}
                defaultOpen
              />
            ))}

            {/* Uncategorized section */}
            {displayedUncategorized.length > 0 && (
              <CategoryCard
                category={{ name: 'Sin categoría', description: '' }}
                services={displayedUncategorized}
                isAdmin={isAdmin}
                onEditCategory={() => {}}
                onAddService={handleAddServiceGeneric}
                onEditService={handleEditService}
                onDeleteService={setServiceToDelete}
                onBook={handleBookService}
                defaultOpen={displayedCategories.length === 0}
              />
            )}
          </div>
        ) : (
          <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-card">
            <Search className="mb-3 h-10 w-10 text-brand-text-muted opacity-50" />
            <p className="text-lg font-medium text-brand-text-muted">No se encontraron servicios</p>
            <p className="mt-1 text-sm text-brand-text-muted">Intentá con otros términos de búsqueda.</p>
          </div>
        )
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-card">
          <Scissors className="mb-3 h-10 w-10 text-brand-text-muted" />
          <p className="text-lg font-medium text-brand-text-muted">No hay servicios disponibles</p>
        </div>
      )}

      {/* ── Service Modal ─────────────────────────────────────────────────── */}
      {(serviceModalOpen || selectedService) && (
        <ServiceModal
          isOpen={serviceModalOpen || !!selectedService}
          onClose={handleCloseServiceModal}
          service={selectedService}
          defaultCategoryId={preSelectedCategoryId}
        />
      )}

      {/* ── Category Modal (Admin Only) ───────────────────────────────────── */}
      {(categoryModalOpen || selectedCategory) && (
        <CategoryModal
          isOpen={categoryModalOpen || !!selectedCategory}
          onClose={handleCloseCategoryModal}
          category={selectedCategory}
        />
      )}

      {/* ── Confirm Dialog ─────────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!serviceToDelete}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleDeleteService}
        title="Eliminar Servicio"
        message={`¿Estás seguro que querés eliminar el servicio "${serviceToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default ServicesPage
