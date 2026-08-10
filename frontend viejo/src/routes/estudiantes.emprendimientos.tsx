import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, Store } from 'lucide-react'
import { Card } from '../components/ui/card'
import { EmptyState } from '../components/ui/empty-state'
import { useEntrepreneurships } from '../hooks/entrepreneurships'
import { env } from '../env'

export const Route = createFileRoute('/estudiantes/emprendimientos')({
  component: Emprendimientos,
})

function Emprendimientos() {
  const { data: items = [], isLoading: loading } = useEntrepreneurships()

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



  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8 select-none">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-white/10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight shrink-0">
          Emprendimientos Estudiantiles
        </h1>
        <span className="bg-[#2b7fff]/10 text-[#2b7fff] border border-[#2b7fff]/20 font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider self-start sm:self-auto">
          Comunidad PEA
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Store}
          title="Sin emprendimientos"
          description="No hay emprendimientos registrados en este momento."
        />
      ) : (
        /* Grid Layout 4xN */
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-in fade-in duration-300">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.contact_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block no-underline focus:outline-none"
            >
              <Card className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 h-full relative overflow-hidden">
                {/* Circular Logo Container with Outline */}
                <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-[#2b7fff] bg-white p-1 mb-4 transition-transform duration-300 group-hover:scale-[1.03] shadow-md flex items-center justify-center">
                  <img
                    src={getMediaUrl(item.image_path)}
                    alt={`Logo de ${item.name}`}
                    className="w-full h-full object-contain rounded-full"
                    loading="lazy"
                  />
                </div>

                {/* Name */}
                <div className="space-y-1 z-10">
                  <h3 className="text-sm md:text-base font-extrabold text-zinc-100 group-hover:text-white transition-colors leading-tight">
                    {item.name}
                  </h3>
                </div>

                {/* Hover visit icon indicator */}
                <div className="absolute top-3 right-3 text-zinc-500 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 duration-200">
                  <ExternalLink className="h-4 w-4" />
                </div>
              </Card>
            </a>
          ))}
        </section>
      )}
    </main>
  )
}
