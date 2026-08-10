import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Eye, X, Tag } from 'lucide-react'
import { Card, CardContent, CardTitle } from '../components/ui/card'
import { EmptyState } from '../components/ui/empty-state'
import { useDiscounts } from '../hooks/discounts'
import { env } from '../env'

export const Route = createFileRoute('/estudiantes/descuentos')({
  component: Descuentos,
})

function Descuentos() {
  const { data: items = [], isLoading: loading } = useDiscounts()
  const [selectedDiscount, setSelectedDiscount] = useState<(typeof items)[0] | null>(null)

  useEffect(() => {
    if (selectedDiscount) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedDiscount])

  const getMediaUrl = (path: string) => {
    if (!path) return '/plan-tecnicatura-turismo.png'
    if (path.startsWith('http') || path.startsWith('data:')) return path
    if (path.startsWith('/')) return path
    const baseUrl = env.VITE_API_URL.endsWith('/') ? env.VITE_API_URL : `${env.VITE_API_URL}/`
    let cleanPath = path
    if (!cleanPath.startsWith('media/')) {
      cleanPath = `media/${cleanPath}`
    }
    return `${baseUrl}${cleanPath}`
  }

  const parseRequirements = (reqString: string) => {
    if (!reqString) return []
    return reqString
      .split('\n')
      .map((r) => r.trim())
      .filter((r) => r.length > 0)
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8 select-none">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight shrink-0">
          Descuentos para Estudiantes
        </h1>
        <span className="bg-[#2b7fff]/10 text-[#2b7fff] border border-[#2b7fff]/20 font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider self-start sm:self-auto">
          Beneficios Exclusivos
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="Sin descuentos"
          description="No hay descuentos registrados en este momento."
        />
      ) : (
        /* Grid Layout 4xN */
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-in fade-in duration-300">
          {items.map((discount) => (
            <Card
              key={discount.id}
              className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col group/card p-0 gap-0"
            >
              {/* Image Section - Clickable for Modal Preview */}
              <div
                onClick={() => setSelectedDiscount(discount)}
                className="relative aspect-[4/3] w-full overflow-hidden cursor-pointer group/image bg-white p-4"
              >
                <img
                  src={getMediaUrl(discount.image_path)}
                  alt={discount.name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover/image:scale-102"
                  loading="lazy"
                />
                {/* Blur Hover Overlay */}
                <div className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center gap-y-2 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 m-4 rounded-xl">
                  <div className="bg-white text-black p-3 rounded-full shadow-lg">
                    <Eye className="h-5 w-5" />
                  </div>
                  <span className="text-white font-bold text-xs tracking-wide">Ampliar Beneficio</span>
                </div>
              </div>

              {/* Info */}
              <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3 text-center w-full">
                  <div>
                    <CardTitle className="text-sm font-extrabold text-white leading-snug line-clamp-2">
                      {discount.name}
                    </CardTitle>
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider mt-1 block">
                      {discount.category}
                    </span>
                  </div>

                  <p className="text-[11px] text-white leading-relaxed line-clamp-3">
                    {discount.description}
                  </p>

                  {/* Requirements Section */}
                  <div className="pt-2 border-t border-white/5 space-y-1 text-left">
                    <span className="text-[9px] font-extrabold text-white uppercase tracking-widest block text-center">
                      Requisitos:
                    </span>
                    {parseRequirements(discount.requirements).map((req, idx) => (
                      <p key={idx} className="text-[10px] text-white leading-tight">
                        • {req}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {/* Lightbox / Modal Viewer */}
      {selectedDiscount && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col animate-in fade-in duration-200"
          onClick={() => setSelectedDiscount(null)}
        >
          {/* Sticky Top Controls Bar */}
          <div
            className="w-full bg-[#18181b] border-b border-white/10 py-4 px-6 flex justify-between items-center text-white shrink-0 z-20 shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center">
              <h2 className="text-sm md:text-base font-bold truncate pr-4 text-zinc-100">
                {selectedDiscount.name}
              </h2>
              <div className="flex items-center gap-x-3 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedDiscount(null)
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
            onClick={() => setSelectedDiscount(null)}
          >
            {/* Image Container */}
            <div
              className="relative w-full max-w-5xl flex items-center justify-center pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getMediaUrl(selectedDiscount.image_path)}
                alt={selectedDiscount.name}
                className="w-full h-auto object-contain rounded-2xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
