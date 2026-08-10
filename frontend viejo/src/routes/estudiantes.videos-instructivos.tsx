import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Play, Search, ChevronRight, Tv, Send, MessageSquare } from 'lucide-react'
import { Input } from '../components/ui/input'
import { EmptyState } from '../components/ui/empty-state'
import { Textarea } from '../components/ui/textarea'
import { useTutorials } from '../hooks/tutorials'
import { useCreateSuggestion } from '../hooks/suggestions'
import { env } from '../env'

export const Route = createFileRoute('/estudiantes/videos-instructivos')({
  component: VideosInstructivos,
})

function VideosInstructivos() {
  const { data: videos = [], isLoading: loading } = useTutorials()
  const createSuggestionMutation = useCreateSuggestion()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeVideo, setActiveVideo] = useState<(typeof videos)[0] | null>(null)
  const [suggestionText, setSuggestionText] = useState('')
  const [suggestStatus, setSuggestStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Set first video as active once loaded
  useEffect(() => {
    if (videos.length > 0 && !activeVideo) {
      setActiveVideo(videos[0])
    }
  }, [videos])

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!suggestionText.trim()) return
    setSuggestStatus(null)
    createSuggestionMutation.mutate(suggestionText, {
      onSuccess: () => {
        setSuggestStatus({ type: 'success', text: '¡Sugerencia enviada con éxito! Gracias por tu aporte.' })
        setSuggestionText('')
      },
      onError: () => {
        setSuggestStatus({ type: 'error', text: 'Error al enviar la sugerencia. Por favor intenta de nuevo.' })
      },
    })
  }

  const filteredVideos = videos.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Safe fallback if activeVideo is filtered out or missing
  const currentVideo = activeVideo && filteredVideos.some((v) => v.id === activeVideo.id)
    ? activeVideo
    : filteredVideos[0] || null

  const getVideoUrl = (videoPath: string) => {
    if (!videoPath) return ''
    if (videoPath.startsWith('http') || videoPath.startsWith('data:')) return videoPath
    if (videoPath.startsWith('/')) return videoPath
    const baseUrl = env.VITE_API_URL.endsWith('/') ? env.VITE_API_URL : `${env.VITE_API_URL}/`
    let cleanPath = videoPath
    if (!cleanPath.startsWith('media/')) {
      cleanPath = `media/${cleanPath}`
    }
    return `${baseUrl}${cleanPath}`
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8 select-none">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight shrink-0">
          Videos Instructivos
        </h1>
        <span className="bg-[#2b7fff]/10 text-[#2b7fff] border border-[#2b7fff]/20 font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider self-start sm:self-auto">
          Tutoriales y Guías
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-12">
          {videos.length === 0 ? (
            <EmptyState
              icon={Tv}
              title="Sin videos instructivos"
              description="No hay videos tutoriales cargados en este momento."
            />
          ) : (
            /* Split Screen Layout */
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:items-stretch animate-in fade-in duration-300">
              {/* Left Sidebar - Video list */}
              <aside className="w-full lg:w-80 shrink-0 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden flex flex-col shadow-lg">
                {/* Sidebar Header & Search */}
                <div className="p-5 border-b border-white/10 space-y-4">
                  <div className="flex items-center gap-x-2 text-zinc-400">
                    <Tv className="h-4 w-4 text-[#2b7fff]" />
                    <span className="text-xs font-bold uppercase tracking-wider">Lista de Reproducción</span>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      type="text"
                      placeholder="Buscar video..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-xl h-10 pl-9 pr-4 focus-visible:ring-[#2b7fff]/20"
                    />
                  </div>
                </div>

                {/* Videos Playlist Scroll Area */}
                <div className="divide-y divide-white/5 overflow-y-auto flex-1 h-[400px] lg:h-auto">
                  {filteredVideos.length > 0 ? (
                    filteredVideos.map((video) => {
                      const isActive = currentVideo?.id === video.id
                      return (
                        <button
                          key={video.id}
                          onClick={() => setActiveVideo(video)}
                          className="w-full text-left px-5 py-4 flex items-center justify-between gap-x-4 hover:bg-white/5 transition-all duration-200 group cursor-pointer border-l-4 border-l-transparent data-[active=true]:bg-white/10 data-[active=true]:border-l-[#2b7fff] data-[active=true]:text-white"
                          data-active={isActive}
                        >
                          <div className="flex items-start gap-x-3 min-w-0">
                            <Play
                              className={`h-5 w-5 mt-0.5 shrink-0 transition-colors ${
                                isActive
                                  ? 'text-[#2b7fff] fill-[#2b7fff]/20'
                                  : 'text-zinc-400 group-hover:text-white'
                              }`}
                            />
                            <div className="min-w-0">
                              <h3
                                className={`text-sm font-semibold leading-snug group-hover:text-white transition-colors line-clamp-2 ${
                                  isActive ? 'text-white font-bold' : 'text-zinc-200'
                                }`}
                              >
                                {video.name}
                              </h3>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-zinc-500 shrink-0 group-hover:text-zinc-300 transition-colors" />
                        </button>
                      )
                    })
                  ) : (
                    <div className="p-8 text-center text-zinc-400 text-sm">
                      No se encontraron videos.
                    </div>
                  )}
                </div>
              </aside>

              {/* Right Panel - Video Player */}
              <section className="flex-1 w-full bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-3 flex flex-col justify-center shadow-lg min-h-[300px] lg:min-h-0">
                {currentVideo ? (
                  /* Video aspect-video wrapper */
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl animate-in zoom-in-98 duration-200">
                    <video
                      key={currentVideo.id}
                      className="absolute top-0 left-0 w-full h-full object-contain"
                      src={getVideoUrl(currentVideo.video_path)}
                      controls
                      playsInline
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400 space-y-4 flex-1">
                    <Tv className="h-16 w-16 text-zinc-500" />
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Búsqueda sin resultados</h3>
                      <p className="text-sm text-zinc-400">Intenta buscar otra palabra clave.</p>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* Suggestion Card */}
          <div className="pt-8 border-t border-white/10">
            <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 md:p-8 space-y-6 shadow-lg animate-in fade-in duration-300">
              <div className="flex items-start gap-x-4">
                <div className="h-10 w-10 bg-[#2b7fff]/10 rounded-xl flex items-center justify-center shrink-0 border border-[#2b7fff]/20">
                  <MessageSquare className="h-5 w-5 text-[#2b7fff]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">¿Qué tutorial te gustaría ver en el futuro?</h3>
                  <p className="text-xs text-zinc-300">
                    Envíanos tus sugerencias para nuevos videos instructivos o guías que te gustaría que preparemos.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSuggestSubmit} className="space-y-4">
                <Textarea
                  placeholder="Escribe tu sugerencia aquí..."
                  value={suggestionText}
                  onChange={(e) => setSuggestionText(e.target.value)}
                  className="w-full bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-2xl p-4 focus-visible:ring-[#2b7fff]/20 min-h-[100px] resize-none text-sm"
                  required
                />
                
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <button
                    type="submit"
                    disabled={createSuggestionMutation.isPending}
                    className="flex items-center justify-center gap-x-2 bg-[#2b7fff] hover:bg-[#1a6ee6] disabled:bg-[#2b7fff]/40 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed text-xs"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{createSuggestionMutation.isPending ? 'Enviando...' : 'Enviar Sugerencia'}</span>
                  </button>

                  {suggestStatus && (
                    <p
                      className={`text-xs font-semibold ${
                        suggestStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {suggestStatus.text}
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
