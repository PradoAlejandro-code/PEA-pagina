import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Card } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { EmptyState } from '../components/ui/empty-state'
import { useCertificates } from '../hooks/certificates'
import type { Certificate } from '../features/api/certificates'
import { env } from '../env'

export const Route = createFileRoute('/estudiantes/certificados')({
  component: Certificados,
})

function Certificados() {
  const { data: certs = [], isLoading: loading } = useCertificates()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCerts = certs.filter((cert) =>
    cert.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  const getDownloadName = (cert: Certificate) => {
    return `${cert.name.replace(/\s+/g, '_')}.pdf`
  }

  const handleOpenPDF = (pdfPath: string) => {
    window.open(getMediaUrl(pdfPath), '_blank')
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8 select-none">
      {/* Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-white/10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight shrink-0">
          Certificados
        </h1>

        {/* Search */}
        <div className="w-full md:w-auto">
          <Input
            type="text"
            placeholder="Buscar certificado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-xl h-10 px-4 focus-visible:ring-[#325579]/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      ) : filteredCerts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Sin certificados"
          description={
            certs.length === 0
              ? 'No hay certificados cargados en este momento.'
              : 'No se encontraron certificados que coincidan con la búsqueda.'
          }
        />
      ) : (
        /* Grid 4xN */
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-in fade-in duration-300">
          {filteredCerts.map((cert) => (
            <Card
              key={cert.id}
              onClick={() => handleOpenPDF(cert.pdf_path)}
              className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-between p-6 gap-y-5 cursor-pointer group"
            >
              {/* PDF Icon Graphic */}
              <div className="relative h-20 w-16 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-2 mt-4 select-none shrink-0 group-hover:scale-105 transition-transform duration-300">
                {/* Dog-eared page corner */}
                <div className="absolute top-0 right-0 h-4 w-4 bg-[#325579] rounded-bl-lg border-l border-b border-white/10" />

                {/* Document lines lines indicator */}
                <div className="w-10 h-0.5 bg-zinc-200 rounded-full mb-1 mt-3" />
                <div className="w-10 h-0.5 bg-zinc-200 rounded-full mb-1" />
                <div className="w-6 h-0.5 bg-zinc-200 rounded-full mb-3 self-start ml-2" />

                {/* Red PDF Label */}
                <div className="bg-[#e44d26] text-white font-extrabold text-[8px] tracking-wider px-2 py-0.5 rounded shadow-sm">
                  PDF
                </div>
              </div>

              {/* Title */}
              <div className="flex-1 flex items-center justify-center min-h-[48px]">
                <h3 className="text-base font-bold text-white leading-snug text-center line-clamp-2 px-1">
                  {cert.name}
                </h3>
              </div>

              {/* Centered Download Button */}
              <a
                href={getMediaUrl(cert.pdf_path)}
                download={getDownloadName(cert)}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center bg-[#2b7fff] hover:bg-[#1a6ee6] !text-white font-bold py-2.5 px-6 rounded-full shadow-md transition-all duration-200 hover:scale-[1.02] cursor-pointer no-underline text-xs"
              >
                <span>Descargar PDF</span>
              </a>
            </Card>
          ))}
        </section>
      )}
    </main>
  )
}
