import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useCreateCategory, useUpdateCategory } from '@/hooks/useServiceCategories'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import FormActions from '@/components/ui/FormActions'

const schema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  description: z.string().optional(),
})

function CategoryModal({ isOpen, onClose, category }) {
  const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory()
  const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory()

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    }
  })

  const onSubmit = async (data) => {
    try {
      if (category) {
        await updateCategory({ id: category.id, data })
        toast.success('Categoría actualizada')
      } else {
        await createCategory(data)
        toast.success('Categoría creada')
      }
      onClose()
      reset()
    } catch (error) {
      console.error('[CategoryModal] Error creating category:', error)
      toast.error('Ocurrió un error al guardar')
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Editar Categoría' : 'Nueva Categoría'}
      maxWidthClass="max-w-md"
      footer={
        <FormActions>
          <Button variant="ghost" onClick={onClose} disabled={isCreating || isUpdating}>
            Cancelar
          </Button>
          <Button type="submit" form="category-form" loading={isCreating || isUpdating}>
            Guardar
          </Button>
        </FormActions>
      }
    >
      <form id="category-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nombre de la categoría"
          placeholder="Ej. Categoría"
          error={errors.name?.message}
          {...register('name')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-brand-text-muted">Descripción (opcional)</label>
          <textarea
            className="min-h-[80px] w-full rounded-lg border border-brand-pastel bg-brand-bg p-3 text-sm text-brand-text placeholder-brand-text-muted focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary"
            placeholder="Descripción de la categoría..."
            {...register('description')}
          />
        </div>
      </form>
    </Modal>
  )
}

export default CategoryModal
