import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit2, Loader2, Check, X, Image, Tag } from 'lucide-react'
import { Card, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { EmptyState } from '../ui/empty-state'
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  type Discount,
} from '../../features/api/discounts'
import { env } from '../../env'

export function DescuentosTab() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [discName, setDiscName] = useState('')
  const [discCategory, setDiscCategory] = useState('')
  const [discDescription, setDiscDescription] = useState('')
  const [discRequirements, setDiscRequirements] = useState('')
  const [selectedDiscImg, setSelectedDiscImg] = useState<File | null>(null)
  const [editingDiscId, setEditingDiscId] = useState<number | null>(null)
  const [editDiscName, setEditDiscName] = useState('')
  const [editDiscCategory, setEditDiscCategory] = useState('')
  const [editDiscDescription, setEditDiscDescription] = useState('')
  const [editDiscRequirements, setEditDiscRequirements] = useState('')
  const discImgInputRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getDiscounts()
      setDiscounts(data || [])
    } catch (err) {
      console.error('Error loading discounts:', err)
      setErrorMsg('No se pudo establecer conexión para cargar los descuentos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getMediaUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http') || path.startsWith('data:')) return path
    if (path.startsWith('/')) return path
    const baseUrl = env.VITE_API_URL.endsWith('/') ? env.VITE_API_URL : `${env.VITE_API_URL}/`
    let cleanPath = path
    if (!cleanPath.startsWith('media/')) {
      cleanPath = `media/${cleanPath}`
    }
    return `${baseUrl}${cleanPath}`
  }

  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!discName.trim()) {
      setErrorMsg('El título del descuento es obligatorio.')
      return
    }
    if (!discCategory.trim()) {
      setErrorMsg('La categoría es obligatoria.')
      return
    }
    if (!discDescription.trim()) {
      setErrorMsg('La descripción es obligatoria.')
      return
    }
    if (!discRequirements.trim()) {
      setErrorMsg('Los requisitos son obligatorios.')
      return
    }
    if (!selectedDiscImg) {
      setErrorMsg('Debe seleccionar una imagen para el descuento.')
      return
    }

    try {
      setSubmitting(true)
      await createDiscount(
        discName,
        discCategory,
        discDescription,
        discRequirements,
        selectedDiscImg
      )
      setSuccessMsg('Descuento creado con éxito.')
      setDiscName('')
      setDiscCategory('')
      setDiscDescription('')
      setDiscRequirements('')
      setSelectedDiscImg(null)
      if (discImgInputRef.current) discImgInputRef.current.value = ''
      const data = await getDiscounts()
      setDiscounts(data || [])
    } catch (err: any) {
      console.error('Error creating discount:', err)
      setErrorMsg(err.response?.data?.error || 'Error al guardar el descuento.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteDiscount = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este descuento?')) return
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await deleteDiscount(id)
      setSuccessMsg('Descuento eliminado con éxito.')
      const data = await getDiscounts()
      setDiscounts(data || [])
    } catch (err: any) {
      console.error('Error deleting discount:', err)
      setErrorMsg(err.response?.data?.error || 'Error al eliminar el descuento.')
    }
  }

  const handleUpdateDiscount = async (id: number) => {
    setErrorMsg('')
    setSuccessMsg('')

    if (!editDiscName.trim()) {
      setErrorMsg('El título del descuento es obligatorio.')
      return
    }
    if (!editDiscCategory.trim()) {
      setErrorMsg('La categoría es obligatoria.')
      return
    }
    if (!editDiscDescription.trim()) {
      setErrorMsg('La descripción es obligatoria.')
      return
    }
    if (!editDiscRequirements.trim()) {
      setErrorMsg('Los requisitos son obligatorios.')
      return
    }

    try {
      setSubmitting(true)
      await updateDiscount(
        id,
        editDiscName,
        editDiscCategory,
        editDiscDescription,
        editDiscRequirements
      )
      setSuccessMsg('Descuento actualizado con éxito.')
      setEditingDiscId(null)
      const data = await getDiscounts()
      setDiscounts(data || [])
    } catch (err: any) {
      console.error('Error updating discount:', err)
      setErrorMsg(err.response?.data?.error || 'Error al actualizar el descuento.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert messages */}
      {(errorMsg || successMsg) && (
        <div className="space-y-2 animate-in fade-in duration-200">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-5 py-3 rounded-2xl text-sm font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-200 px-5 py-3 rounded-2xl text-sm font-medium">
              {successMsg}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Form for Discounts */}
        <div className="lg:col-span-1 space-y-6 animate-in fade-in duration-300">
          <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
            <CardTitle className="text-lg font-bold text-white mb-4 flex items-center gap-x-2">
              <Plus className="h-5 w-5 text-[#2b7fff]" />
              <span>Nuevo Descuento</span>
            </CardTitle>

            <form onSubmit={handleCreateDiscount} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Título del Descuento</label>
                <Input
                  type="text"
                  placeholder="Ej: 20% en Gimnasio Adherido"
                  value={discName}
                  onChange={(e) => setDiscName(e.target.value)}
                  className="w-full bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-xl h-10 px-4 focus-visible:ring-[#2b7fff]/20"
                />
              </div>

              {/* Category Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Categoría</label>
                <Input
                  type="text"
                  placeholder="Ej: Gimnasio, Deporte, Informática"
                  value={discCategory}
                  onChange={(e) => setDiscCategory(e.target.value)}
                  className="w-full bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-xl h-10 px-4 focus-visible:ring-[#2b7fff]/20"
                />
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Descripción</label>
                <textarea
                  placeholder="Ej: Beneficio exclusivo para estudiantes..."
                  value={discDescription}
                  onChange={(e) => setDiscDescription(e.target.value)}
                  className="w-full bg-white text-zinc-800 placeholder:text-zinc-400 border border-[#e2e8f0] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 min-h-[80px]"
                />
              </div>

              {/* Requirements Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Requisitos (Uno por línea)</label>
                <textarea
                  placeholder="Ej: Ser estudiante regular&#10;Presentar DNI"
                  value={discRequirements}
                  onChange={(e) => setDiscRequirements(e.target.value)}
                  className="w-full bg-white text-zinc-800 placeholder:text-zinc-400 border border-[#e2e8f0] rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 min-h-[100px]"
                />
              </div>

              {/* Flyer Image Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Imagen del Descuento / Flyer</label>
                <div className="flex items-center gap-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={discImgInputRef}
                    onChange={(e) => setSelectedDiscImg(e.target.files?.[0] || null)}
                    className="hidden"
                    id="disc-img-upload"
                  />
                  <label
                    htmlFor="disc-img-upload"
                    className="flex items-center justify-center gap-x-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Image className="h-4 w-4 text-[#2b7fff]" />
                    <span>{selectedDiscImg ? 'Cambiar Imagen' : 'Elegir Imagen'}</span>
                  </label>
                  {selectedDiscImg && (
                    <span className="text-xs text-zinc-300 truncate max-w-[150px]">
                      {selectedDiscImg.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-x-2 bg-[#2b7fff] hover:bg-[#1a6ee6] disabled:bg-[#2b7fff]/40 !text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Crear Descuento</span>
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column: Manage List of Discounts */}
        <div className="lg:col-span-2 space-y-6 animate-in fade-in duration-300">
          <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
            <CardTitle className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Descuentos Activos</span>
              <span className="bg-white/10 text-white font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                {discounts.length} Descuentos
              </span>
            </CardTitle>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : discounts.length > 0 ? (
              <div className="space-y-4">
                {discounts.map((disc) => {
                  const isEditing = editingDiscId === disc.id
                  return (
                    <div
                      key={disc.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      {/* Image Thumbnail and details */}
                      <div className="flex items-center gap-x-4 flex-1 min-w-0">
                        <div className="h-16 w-16 bg-white rounded-lg overflow-hidden border border-white/10 shrink-0 flex items-center justify-center p-1">
                          <img
                            src={getMediaUrl(disc.image_path)}
                            alt={disc.name}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        {isEditing ? (
                          <div className="flex-1 space-y-2">
                            <Input
                              type="text"
                              value={editDiscName}
                              onChange={(e) => setEditDiscName(e.target.value)}
                              className="bg-white text-zinc-800 rounded-lg h-8 px-2 text-xs focus-visible:ring-[#2b7fff]/20 w-full"
                              placeholder="Título del Descuento"
                            />
                            <Input
                              type="text"
                              value={editDiscCategory}
                              onChange={(e) => setEditDiscCategory(e.target.value)}
                              className="bg-white text-zinc-800 rounded-lg h-8 px-2 text-xs focus-visible:ring-[#2b7fff]/20 w-full"
                              placeholder="Categoría"
                            />
                            <textarea
                              value={editDiscDescription}
                              onChange={(e) => setEditDiscDescription(e.target.value)}
                              className="bg-white text-zinc-800 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 w-full min-h-[60px]"
                              placeholder="Descripción"
                            />
                            <textarea
                              value={editDiscRequirements}
                              onChange={(e) => setEditDiscRequirements(e.target.value)}
                              className="bg-white text-zinc-800 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/20 w-full min-h-[60px]"
                              placeholder="Requisitos (Uno por línea)"
                            />
                          </div>
                        ) : (
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white truncate">{disc.name}</h4>
                            <span className="text-[10px] font-bold text-[#2b7fff] uppercase tracking-wider block">
                              {disc.category}
                            </span>
                            <span className="text-[10px] text-zinc-400 block line-clamp-1 mt-0.5">
                              {disc.description}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-x-2 shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdateDiscount(disc.id)}
                              disabled={submitting}
                              className="p-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 cursor-pointer transition-colors"
                              aria-label="Confirmar edición"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingDiscId(null)}
                              className="p-2 rounded-xl bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400 hover:text-zinc-300 cursor-pointer transition-colors"
                              aria-label="Cancelar edición"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingDiscId(disc.id)
                                setEditDiscName(disc.name)
                                setEditDiscCategory(disc.category)
                                setEditDiscDescription(disc.description)
                                setEditDiscRequirements(disc.requirements)
                              }}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer transition-colors"
                              aria-label="Editar descuento"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDiscount(disc.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                              aria-label="Eliminar descuento"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon={Tag}
                title="Sin descuentos activos"
                description="No hay descuentos registrados en la base de datos."
                className="py-12 bg-transparent border-none shadow-none backdrop-blur-none max-w-full"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
