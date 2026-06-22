import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit2, Loader2, Check, X, Tv, Video } from 'lucide-react'
import { Card, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { EmptyState } from '../ui/empty-state'
import {
  getTutorials,
  createTutorial,
  updateTutorial,
  deleteTutorial,
  type Tutorial,
} from '../../features/api/tutorials'
import {
  getSuggestions,
  deleteSuggestion,
  type TutorialSuggestion,
} from '../../features/api/suggestions'

export function VideosTab() {
  const [videos, setVideos] = useState<Tutorial[]>([])
  const [suggestions, setSuggestions] = useState<TutorialSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [videoName, setVideoName] = useState('')
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null)
  const [editingVideoId, setEditingVideoId] = useState<number | null>(null)
  const [editVideoName, setEditVideoName] = useState('')
  const videoFileInputRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const [videosData, suggestionsData] = await Promise.all([
        getTutorials().catch((e) => {
          console.error(e)
          return []
        }),
        getSuggestions().catch((e) => {
          console.error(e)
          return []
        }),
      ])
      setVideos(videosData || [])
      setSuggestions(suggestionsData || [])
    } catch (err) {
      console.error('Error loading video data:', err)
      setErrorMsg('No se pudo establecer conexión para cargar los datos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!videoName.trim()) {
      setErrorMsg('El título del video es obligatorio.')
      return
    }
    if (!selectedVideoFile) {
      setErrorMsg('Debe seleccionar un archivo de video.')
      return
    }

    try {
      setSubmitting(true)
      await createTutorial(videoName, selectedVideoFile)
      setSuccessMsg('Video instructivo subido con éxito.')
      setVideoName('')
      setSelectedVideoFile(null)
      if (videoFileInputRef.current) videoFileInputRef.current.value = ''
      const data = await getTutorials()
      setVideos(data || [])
    } catch (err: any) {
      console.error('Error creating video:', err)
      setErrorMsg(err.response?.data?.error || 'Error al guardar el video instructivo.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteVideo = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este video instructivo?')) return
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await deleteTutorial(id)
      setSuccessMsg('Video instructivo eliminado con éxito.')
      const data = await getTutorials()
      setVideos(data || [])
    } catch (err: any) {
      console.error('Error deleting video:', err)
      setErrorMsg(err.response?.data?.error || 'Error al eliminar el video.')
    }
  }

  const handleUpdateVideo = async (id: number) => {
    setErrorMsg('')
    setSuccessMsg('')

    if (!editVideoName.trim()) {
      setErrorMsg('El título no puede estar vacío.')
      return
    }

    try {
      setSubmitting(true)
      await updateTutorial(id, editVideoName)
      setSuccessMsg('Título del video actualizado con éxito.')
      setEditingVideoId(null)
      const data = await getTutorials()
      setVideos(data || [])
    } catch (err: any) {
      console.error('Error updating video:', err)
      setErrorMsg(err.response?.data?.error || 'Error al actualizar el video.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSuggestion = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta sugerencia?')) return
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await deleteSuggestion(id)
      setSuccessMsg('Sugerencia eliminada con éxito.')
      const data = await getSuggestions()
      setSuggestions(data || [])
    } catch (err: any) {
      console.error('Error deleting suggestion:', err)
      setErrorMsg(err.response?.data?.error || 'Error al eliminar la sugerencia.')
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
        {/* Left Column: Create Form for Videos */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
            <CardTitle className="text-lg font-bold text-white mb-4 flex items-center gap-x-2">
              <Plus className="h-5 w-5 text-[#2b7fff]" />
              <span>Subir Video Instructivo</span>
            </CardTitle>

            <form onSubmit={handleCreateVideo} className="space-y-4">
              {/* Video Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Título del Video</label>
                <Input
                  type="text"
                  placeholder="Ej: SIU Guaraní: Inscripción a materias"
                  value={videoName}
                  onChange={(e) => setVideoName(e.target.value)}
                  className="w-full bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-xl h-10 px-4 focus-visible:ring-[#2b7fff]/20"
                />
              </div>

              {/* Video File Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Archivo de Video (.mp4, etc.)</label>
                <div className="flex items-center gap-x-3">
                  <input
                    type="file"
                    accept="video/*"
                    ref={videoFileInputRef}
                    onChange={(e) => setSelectedVideoFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="video-file-upload"
                  />
                  <label
                    htmlFor="video-file-upload"
                    className="flex items-center justify-center gap-x-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <Video className="h-4 w-4 text-[#2b7fff]" />
                    <span>{selectedVideoFile ? 'Cambiar archivo' : 'Elegir archivo'}</span>
                  </label>
                  {selectedVideoFile && (
                    <span className="text-xs text-zinc-300 truncate max-w-[150px]">
                      {selectedVideoFile.name}
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
                    <span>Subiendo...</span>
                  </>
                ) : (
                  <>
                    <Video className="h-4 w-4" />
                    <span>Subir Video</span>
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column: Manage List of Videos */}
        <div className="lg:col-span-2 space-y-6 animate-in fade-in duration-300">
          <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
            <CardTitle className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Videos Activos</span>
              <span className="bg-white/10 text-white font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                {videos.length} Videos
              </span>
            </CardTitle>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : videos.length > 0 ? (
              <div className="space-y-4">
                {videos.map((video) => {
                  const isEditingVideo = editingVideoId === video.id
                  return (
                    <div
                      key={video.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      {/* Video thumbnail design */}
                      <div className="flex items-center gap-x-4 flex-1 min-w-0">
                        <div className="h-16 w-16 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0 flex items-center justify-center p-1">
                          <Video className="h-6 w-6 text-[#2b7fff]" />
                        </div>

                        {isEditingVideo ? (
                          <div className="flex-1">
                            <Input
                              type="text"
                              value={editVideoName}
                              onChange={(e) => setEditVideoName(e.target.value)}
                              className="bg-white text-zinc-800 rounded-lg h-8 px-2 text-xs focus-visible:ring-[#2b7fff]/20 w-full"
                            />
                          </div>
                        ) : (
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white truncate">{video.name}</h4>
                            <span className="text-[10px] text-zinc-400 block truncate">
                              Ruta: {video.video_path}
                            </span>
                            <span className="text-[10px] text-zinc-400">
                              Subido: {new Date(video.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-x-2 shrink-0">
                        {isEditingVideo ? (
                          <>
                            <button
                              onClick={() => handleUpdateVideo(video.id)}
                              disabled={submitting}
                              className="p-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 cursor-pointer transition-colors"
                              aria-label="Confirmar edición"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingVideoId(null)}
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
                                setEditingVideoId(video.id)
                                setEditVideoName(video.name)
                              }}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer transition-colors"
                              aria-label="Editar video"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteVideo(video.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                              aria-label="Eliminar video"
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
                icon={Tv}
                title="Sin videos activos"
                description="No hay videos instructivos registrados en la base de datos."
                className="py-12 bg-transparent border-none shadow-none backdrop-blur-none max-w-full"
              />
            )}
          </Card>

          {/* Student Suggestions Card */}
          <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
            <CardTitle className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Sugerencias de Estudiantes</span>
              <span className="bg-white/10 text-white font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                {suggestions.length} Sugerencias
              </span>
            </CardTitle>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-xs text-white whitespace-pre-wrap break-words">{suggestion.Text}</p>
                      <p className="text-[10px] text-zinc-400">
                        {new Date(suggestion.created_at).toLocaleString('es-AR')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSuggestion(suggestion.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer transition-colors shrink-0"
                      title="Eliminar sugerencia"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Tv}
                title="Sin sugerencias"
                description="No hay sugerencias para futuros tutoriales enviadas por estudiantes."
                className="py-12 bg-transparent border-none shadow-none backdrop-blur-none max-w-full"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
