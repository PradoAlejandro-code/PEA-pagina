import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit2, Loader2, Check, X, Image, Store } from 'lucide-react'
import { Card, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { EmptyState } from '../ui/empty-state'
import {
  getEntrepreneurships,
  createEntrepreneurship,
  updateEntrepreneurship,
  deleteEntrepreneurship,
  type Entrepreneurship,
} from '../../features/api/entrepreneurships'
import { env } from '../../env'

export function EmprendimientosTab() {
  const [ents, setEnts] = useState<Entrepreneurship[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [entName, setEntName] = useState('')
  const [contactUrl, setContactUrl] = useState('')
  const [selectedEntLogo, setSelectedEntLogo] = useState<File | null>(null)
  const [editingEntId, setEditingEntId] = useState<number | null>(null)
  const [editEntName, setEditEntName] = useState('')
  const [editEntContactUrl, setEditEntContactUrl] = useState('')
  const entLogoInputRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getEntrepreneurships()
      setEnts(data || [])
    } catch (err) {
      console.error('Error loading entrepreneurships:', err)
      setErrorMsg('No se pudo establecer conexión para cargar los emprendimientos.')
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

  const handleCreateEnt = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!entName.trim()) {
      setErrorMsg('El nombre del emprendimiento es obligatorio.')
      return
    }
    if (!contactUrl.trim()) {
      setErrorMsg('El enlace de contacto es obligatorio.')
      return
    }
    if (!selectedEntLogo) {
      setErrorMsg('Debe seleccionar un logo para el emprendimiento.')
      return
    }

    try {
      setSubmitting(true)
      await createEntrepreneurship(entName, contactUrl, selectedEntLogo)
      setSuccessMsg('Emprendimiento creado con éxito.')
      setEntName('')
      setContactUrl('')
      setSelectedEntLogo(null)
      if (entLogoInputRef.current) entLogoInputRef.current.value = ''
      const data = await getEntrepreneurships()
      setEnts(data || [])
    } catch (err: any) {
      console.error('Error creating entrepreneurship:', err)
      setErrorMsg(err.response?.data?.error || 'Error al guardar el emprendimiento.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteEnt = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este emprendimiento?')) return
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await deleteEntrepreneurship(id)
      setSuccessMsg('Emprendimiento eliminado con éxito.')
      const data = await getEntrepreneurships()
      setEnts(data || [])
    } catch (err: any) {
      console.error('Error deleting entrepreneurship:', err)
      setErrorMsg(err.response?.data?.error || 'Error al eliminar el emprendimiento.')
    }
  }

  const handleUpdateEnt = async (id: number) => {
    setErrorMsg('')
    setSuccessMsg('')

    if (!editEntName.trim()) {
      setErrorMsg('El nombre del emprendimiento es obligatorio.')
      return
    }
    if (!editEntContactUrl.trim()) {
      setErrorMsg('El enlace de contacto es obligatorio.')
      return
    }

    try {
      setSubmitting(true)
      await updateEntrepreneurship(id, editEntName, editEntContactUrl)
      setSuccessMsg('Emprendimiento actualizado con éxito.')
      setEditingEntId(null)
      const data = await getEntrepreneurships()
      setEnts(data || [])
    } catch (err: any) {
      console.error('Error updating entrepreneurship:', err)
      setErrorMsg(err.response?.data?.error || 'Error al actualizar el emprendimiento.')
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
        {/* Left Column: Create Form for Entrepreneurships */}
        <div className="lg:col-span-1 space-y-6 animate-in fade-in duration-300">
          <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
            <CardTitle className="text-lg font-bold text-white mb-4 flex items-center gap-x-2">
              <Plus className="h-5 w-5 text-[#2b7fff]" />
              <span>Nuevo Emprendimiento</span>
            </CardTitle>

            <form onSubmit={handleCreateEnt} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Nombre del Emprendimiento</label>
                <Input
                  type="text"
                  placeholder="Ej: Sabores Caseros"
                  value={entName}
                  onChange={(e) => setEntName(e.target.value)}
                  className="w-full bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-xl h-10 px-4 focus-visible:ring-[#2b7fff]/20"
                />
              </div>

              {/* URL Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Enlace de Contacto (Instagram/WhatsApp)</label>
                <Input
                  type="text"
                  placeholder="Ej: https://instagram.com/saborescaseros"
                  value={contactUrl}
                  onChange={(e) => setContactUrl(e.target.value)}
                  className="w-full bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-xl h-10 px-4 focus-visible:ring-[#2b7fff]/20"
                />
              </div>

              {/* Logo File Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Logo del Emprendimiento (Imagen)</label>
                <div className="flex items-center gap-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={entLogoInputRef}
                    onChange={(e) => setSelectedEntLogo(e.target.files?.[0] || null)}
                    className="hidden"
                    id="ent-logo-upload"
                  />
                  <label
                    htmlFor="ent-logo-upload"
                    className="flex items-center justify-center gap-x-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Image className="h-4 w-4 text-[#2b7fff]" />
                    <span>{selectedEntLogo ? 'Cambiar Logo' : 'Elegir Logo'}</span>
                  </label>
                  {selectedEntLogo && (
                    <span className="text-xs text-zinc-300 truncate max-w-[150px]">
                      {selectedEntLogo.name}
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
                    <span>Crear Emprendimiento</span>
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column: Manage List of Entrepreneurships */}
        <div className="lg:col-span-2 space-y-6 animate-in fade-in duration-300">
          <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
            <CardTitle className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Emprendimientos Activos</span>
              <span className="bg-white/10 text-white font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                {ents.length} Emprendimientos
              </span>
            </CardTitle>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : ents.length > 0 ? (
              <div className="space-y-4">
                {ents.map((ent) => {
                  const isEditing = editingEntId === ent.id
                  return (
                    <div
                      key={ent.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      {/* Image Thumbnail and details */}
                      <div className="flex items-center gap-x-4 flex-1 min-w-0">
                        <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-[#2b7fff] bg-white p-0.5 shrink-0 flex items-center justify-center">
                          <img
                            src={getMediaUrl(ent.image_path)}
                            alt={ent.name}
                            className="h-full w-full object-contain rounded-full"
                          />
                        </div>

                        {isEditing ? (
                          <div className="flex-1 space-y-2">
                            <Input
                              type="text"
                              value={editEntName}
                              onChange={(e) => setEditEntName(e.target.value)}
                              className="bg-white text-zinc-800 rounded-lg h-8 px-2 text-xs focus-visible:ring-[#2b7fff]/20 w-full"
                              placeholder="Nombre del Emprendimiento"
                            />
                            <Input
                              type="text"
                              value={editEntContactUrl}
                              onChange={(e) => setEditEntContactUrl(e.target.value)}
                              className="bg-white text-zinc-800 rounded-lg h-8 px-2 text-xs focus-visible:ring-[#2b7fff]/20 w-full"
                              placeholder="Enlace de Contacto"
                            />
                          </div>
                        ) : (
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white truncate">{ent.name}</h4>
                            <span className="text-[10px] text-zinc-400 block truncate">
                              Enlace: {ent.contact_url}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-x-2 shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdateEnt(ent.id)}
                              disabled={submitting}
                              className="p-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 cursor-pointer transition-colors"
                              aria-label="Confirmar edición"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingEntId(null)}
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
                                setEditingEntId(ent.id)
                                setEditEntName(ent.name)
                                setEditEntContactUrl(ent.contact_url)
                              }}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer transition-colors"
                              aria-label="Editar emprendimiento"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteEnt(ent.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                              aria-label="Eliminar emprendimiento"
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
                icon={Store}
                title="Sin emprendimientos activos"
                description="No hay emprendimientos registrados en la base de datos."
                className="py-12 bg-transparent border-none shadow-none backdrop-blur-none max-w-full"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
