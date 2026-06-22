import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Download, Eye, X, BookOpen } from 'lucide-react'
import { Card, CardContent, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { EmptyState } from '../components/ui/empty-state'
import { useCurriculums } from '../hooks/curriculums'
import type { Curriculum } from '../features/api/curriculums'
import { env } from '../env'

type PlanesSearch = {
  instituto?: string
}

export const Route = createFileRoute('/estudiantes/planes-de-estudio')({
  validateSearch: (search: Record<string, unknown>): PlanesSearch => {
    return {
      instituto: (search.instituto as string) || undefined,
    }
  },
  component: PlanesDeEstudio,
})

function PlanesDeEstudio() {
  const { instituto } = Route.useSearch()
  const { data: plans = [], isLoading: loading } = useCurriculums()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInstitute, setSelectedInstitute] = useState(instituto || 'all')
  const [selectedPlan, setSelectedPlan] = useState<(typeof plans)[0] | null>(null)

  useEffect(() => {
    if (instituto) {
      setSelectedInstitute(instituto)
    } else {
      setSelectedInstitute('all')
    }
  }, [instituto])

  useEffect(() => {
    if (selectedPlan) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedPlan])

  const filteredPlans = plans.filter((plan) => {
    const matchesSearch = plan.major.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesInstitute =
      selectedInstitute === 'all' ||
      plan.institute.toLowerCase() === selectedInstitute.toLowerCase()
    return matchesSearch && matchesInstitute
  })

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/plan-tecnicatura-turismo.png'
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath
    if (imagePath.startsWith('/')) return imagePath
    const baseUrl = env.VITE_API_URL.endsWith('/') ? env.VITE_API_URL : `${env.VITE_API_URL}/`
    let cleanPath = imagePath
    if (!cleanPath.startsWith('media/')) {
      cleanPath = `media/${cleanPath}`
    }
    return `${baseUrl}${cleanPath}`
  }

  const getDownloadName = (plan: Curriculum) => {
    return `${plan.major.replace(/\s+/g, '_')}_Plan.png`
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8 select-none">
      {/* Title & Search/Selector Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight shrink-0">
          Planes de Estudio
        </h1>
        
        {/* Search & Selector (Static Visuals) */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <Input
            type="text"
            placeholder="Buscar carrera..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-xl h-10 px-4 focus-visible:ring-[#325579]/20"
          />
          {/* Institute Dropdown Selector */}
          <select
            className="w-full sm:w-56 px-4 py-2.5 rounded-xl bg-white border border-[#325579] text-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#325579]/20 text-sm cursor-pointer"
            value={selectedInstitute}
            onChange={(e) => setSelectedInstitute(e.target.value)}
          >
            <option value="all">Todos los Institutos</option>
            <option value="idei">IDEI</option>
            <option value="iec">IEC</option>
            <option value="icse">ICSE</option>
            <option value="icpa">ICPA</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      ) : filteredPlans.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Sin planes de estudio"
          description={
            plans.length === 0
              ? 'No hay planes de estudio cargados en este momento.'
              : 'No se encontraron planes de estudio que coincidan con la búsqueda.'
          }
        />
      ) : (
        /* Grid 3xN */
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {filteredPlans.map((plan) => (
            <Card
              key={plan.id}
              className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col group/card p-0 gap-0"
            >
              {/* Image Section - Clickable for Modal Preview */}
              <div
                onClick={() => setSelectedPlan(plan)}
                className="relative aspect-[3/4] w-full overflow-hidden cursor-pointer group/image bg-white p-4"
              >
                <img
                  src={getImageUrl(plan.image_path)}
                  alt={plan.major}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover/image:scale-102"
                  loading="lazy"
                />
                {/* Blur Hover Overlay */}
                <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-y-2 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 m-4 rounded-xl">
                  <div className="bg-white text-black p-3 rounded-full shadow-lg">
                    <Eye className="h-5 w-5" />
                  </div>
                  <span className="text-white font-bold text-sm tracking-wide">Ver Plan</span>
                </div>
              </div>

              {/* Info and Download Button */}
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex flex-col justify-center items-center space-y-1">
                  <CardTitle className="text-base font-bold text-white leading-snug text-center">
                    {plan.major}
                  </CardTitle>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {plan.institute}
                  </span>
                </div>

                <a
                  href={getImageUrl(plan.image_path)}
                  download={getDownloadName(plan)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full flex items-center justify-center gap-x-2 bg-[#2b7fff] hover:bg-[#1a6ee6] !text-white font-bold py-3 px-4 rounded-2xl shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer no-underline"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar Plan</span>
                </a>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {/* Lightbox / Modal Viewer */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200"
          onClick={() => setSelectedPlan(null)}
        >
          {/* Sticky Top Controls Bar */}
          <div
            className="w-full bg-[#18181b] border-b border-white/10 py-4 px-6 flex justify-between items-center text-white shrink-0 z-20 shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
              <h2 className="text-sm md:text-base font-bold truncate pr-4 text-zinc-100">
                {selectedPlan.major}
              </h2>
              <div className="flex items-center gap-x-3 shrink-0">
                <a
                  href={getImageUrl(selectedPlan.image_path)}
                  download={getDownloadName(selectedPlan)}
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-x-1.5 bg-[#2b7fff] hover:bg-[#1a6ee6] px-4 py-2 rounded-full text-xs md:text-sm font-bold !text-white transition-all shadow-md no-underline"
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar</span>
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedPlan(null)
                  }}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white cursor-pointer transition-colors"
                  aria-label="Cerrar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Area */}
          <div
            className="flex-1 overflow-y-auto w-full p-4 md:p-8 flex justify-center items-start z-10"
            onClick={() => setSelectedPlan(null)}
          >
            {/* Image Container */}
            <div
              className="relative w-full max-w-5xl flex items-center justify-center pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getImageUrl(selectedPlan.image_path)}
                alt={selectedPlan.major}
                className="w-full h-auto object-contain rounded-2xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
