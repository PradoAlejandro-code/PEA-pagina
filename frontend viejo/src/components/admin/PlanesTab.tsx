import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit2, Loader2, Image, FileText, Check, X, BookOpen } from 'lucide-react'
import { Card, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { EmptyState } from '../ui/empty-state'
import {
  getCurriculums,
  createCurriculum,
  updateCurriculum,
  deleteCurriculum,
  type Curriculum,
} from '../../features/api/curriculums'
import { env } from '../../env'

export function PlanesTab() {
  const [plans, setPlans] = useState<Curriculum[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [major, setMajor] = useState('')
  const [institute, setInstitute] = useState('idei')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editMajor, setEditMajor] = useState('')
  const [editInstitute, setEditInstitute] = useState('idei')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getCurriculums()
      setPlans(data || [])
    } catch (err) {
      console.error('Error loading curriculums:', err)
      setErrorMsg('No se pudo establecer conexión para cargar los planes.')
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

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!major.trim()) {
      setErrorMsg('El nombre de la carrera es obligatorio.')
      return
    }
    if (!selectedFile) {
      setErrorMsg('Debe seleccionar una imagen para el plan.')
      return
    }

    try {
      setSubmitting(true)
      await createCurriculum(major, institute, selectedFile)
      setSuccessMsg('Plan de estudio creado con éxito.')
      setMajor('')
      setInstitute('idei')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      const data = await getCurriculums()
      setPlans(data || [])
    } catch (err: any) {
      console.error('Error creating plan:', err)
      setErrorMsg(err.response?.data?.error || 'Error al guardar el plan de estudio.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeletePlan = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este plan de estudio?')) return
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await deleteCurriculum(id)
      setSuccessMsg('Plan de estudio eliminado con éxito.')
      const data = await getCurriculums()
      setPlans(data || [])
    } catch (err: any) {
      console.error('Error deleting plan:', err)
      setErrorMsg(err.response?.data?.error || 'Error al eliminar el plan de estudio.')
    }
  }

  const handleUpdatePlan = async (id: number) => {
    setErrorMsg('')
    setSuccessMsg('')

    if (!editMajor.trim()) {
      setErrorMsg('El nombre de la carrera es obligatorio.')
      return
    }

    try {
      setSubmitting(true)
      await updateCurriculum(id, editMajor, editInstitute)
      setSuccessMsg('Plan de estudio actualizado con éxito.')
      setEditingId(null)
      const data = await getCurriculums()
      setPlans(data || [])
    } catch (err: any) {
      console.error('Error updating plan:', err)
      setErrorMsg(err.response?.data?.error || 'Error al actualizar el plan de estudio.')
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
        {/* Left Column: Create Form for Plans */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
            <CardTitle className="text-lg font-bold text-white mb-4 flex items-center gap-x-2">
              <Plus className="h-5 w-5 text-[#2b7fff]" />
              <span>Subir Plan de Estudio</span>
            </CardTitle>

            <form onSubmit={handleCreatePlan} className="space-y-4">
              {/* Major Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Nombre de la Carrera</label>
                <Input
                  type="text"
                  placeholder="Ej: Tecnicatura en Turismo"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-xl h-10 px-4 focus-visible:ring-[#2b7fff]/20"
                />
              </div>

              {/* Institute Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Instituto</label>
                <select
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#325579] text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#325579]/20 text-sm cursor-pointer"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                >
                  <option value="idei">IDEI</option>
                  <option value="iec">IEC</option>
                  <option value="icse">ICSE</option>
                  <option value="icpa">ICPA</option>
                </select>
              </div>

              {/* File Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Imagen del Plan (Ficha/Flyer)</label>
                <div className="flex items-center gap-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="plan-file-upload"
                  />
                  <label
                    htmlFor="plan-file-upload"
                    className="flex items-center justify-center gap-x-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Image className="h-4 w-4 text-[#2b7fff]" />
                    <span>{selectedFile ? 'Cambiar archivo' : 'Elegir archivo'}</span>
                  </label>
                  {selectedFile && (
                    <span className="text-xs text-zinc-300 truncate max-w-[150px]">
                      {selectedFile.name}
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
                    <FileText className="h-4 w-4" />
                    <span>Guardar Plan</span>
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column: Manage List of Plans */}
        <div className="lg:col-span-2 space-y-6 animate-in fade-in duration-300">
          <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
            <CardTitle className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Planes Activos</span>
              <span className="bg-white/10 text-white font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                {plans.length} Planes
              </span>
            </CardTitle>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : plans.length > 0 ? (
              <div className="space-y-4">
                {plans.map((plan) => {
                  const isEditing = editingId === plan.id
                  return (
                    <div
                      key={plan.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      {/* Image Thumbnail and details */}
                      <div className="flex items-center gap-x-4 flex-1 min-w-0">
                        <div className="h-16 w-12 bg-white rounded-lg overflow-hidden border border-white/10 shrink-0 flex items-center justify-center p-1">
                          <img
                            src={getMediaUrl(plan.image_path)}
                            alt={plan.major}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        {isEditing ? (
                          <div className="flex-1 space-y-2">
                            <Input
                              type="text"
                              value={editMajor}
                              onChange={(e) => setEditMajor(e.target.value)}
                              className="bg-white text-zinc-800 rounded-lg h-8 px-2 text-xs focus-visible:ring-[#2b7fff]/20 w-full"
                            />
                            <select
                              className="px-2 py-1 rounded-lg bg-white border border-[#325579] text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#325579]/20 text-xs cursor-pointer w-full"
                              value={editInstitute}
                              onChange={(e) => setEditInstitute(e.target.value)}
                            >
                              <option value="idei">IDEI</option>
                              <option value="iec">IEC</option>
                              <option value="icse">ICSE</option>
                              <option value="icpa">ICPA</option>
                            </select>
                          </div>
                        ) : (
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white truncate">{plan.major}</h4>
                            <span className="text-xs font-bold text-[#2b7fff] uppercase tracking-wider block">
                              {plan.institute}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              Subido: {new Date(plan.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-x-2 shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleUpdatePlan(plan.id)}
                              disabled={submitting}
                              className="p-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 cursor-pointer transition-colors"
                              aria-label="Confirmar edición"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
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
                                setEditingId(plan.id)
                                setEditMajor(plan.major)
                                setEditInstitute(plan.institute)
                              }}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer transition-colors"
                              aria-label="Editar plan"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePlan(plan.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                              aria-label="Eliminar plan"
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
                icon={BookOpen}
                title="Sin planes activos"
                description="No hay planes de estudio registrados en la base de datos."
                className="py-12 bg-transparent border-none shadow-none backdrop-blur-none max-w-full"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
