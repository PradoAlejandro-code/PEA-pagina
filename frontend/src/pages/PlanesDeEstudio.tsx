import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Eye, X, BookOpen, FileText } from 'lucide-react';
import { useCurriculumsQuery } from '../hooks/useCurriculumsQuery';
import type { Curriculum } from '../hooks/useCurriculumsQuery';

export default function PlanesDeEstudio() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialInstituto = searchParams.get('instituto') || 'all';
  
  const { data: plans = [], isLoading } = useCurriculumsQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState(initialInstituto);
  const [selectedPlan, setSelectedPlan] = useState<Curriculum | null>(null);

  // Update URL if institute changes
  useEffect(() => {
    if (selectedInstitute !== 'all') {
      setSearchParams({ instituto: selectedInstitute });
    } else {
      setSearchParams({});
    }
  }, [selectedInstitute, setSearchParams]);

  // Handle body scroll when modal is open
  useEffect(() => {
    if (selectedPlan) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPlan]);

  const filteredPlans = (plans || []).filter((plan) => {
    const matchesSearch = plan.major.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesInstitute =
      selectedInstitute === 'all' ||
      plan.institute.toLowerCase() === selectedInstitute.toLowerCase();
    return matchesSearch && matchesInstitute;
  });

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/plan-tecnicatura-turismo.png';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) return imagePath;
    if (imagePath.startsWith('/')) return imagePath;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    let cleanPath = imagePath;
    if (!cleanPath.startsWith('media/')) {
      cleanPath = `media/${cleanPath}`;
    }
    return `${normalizedBaseUrl}${cleanPath}`;
  };

  const getDownloadName = (plan: Curriculum) => {
    return `${plan.major.replace(/\s+/g, '_')}_Plan.png`;
  };

  return (
    <div className="w-full space-y-8 select-none py-4">
      {/* Encabezado y Filtros */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#325579]/20">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#325579] tracking-tight">
          Planes de Estudio
        </h1>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar carrera..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input input-bordered w-full sm:w-64 bg-white text-zinc-800 focus:outline-none focus:border-[#325579]"
          />
          {/* Selector de Instituto */}
          <select
            className="select select-bordered w-full sm:w-56 bg-white text-zinc-800 focus:outline-none focus:border-[#325579] font-medium cursor-pointer"
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

      {/* Contenido */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-[#325579]"></span>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl shadow-xl border border-gray-100">
          <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-[#325579] mb-2">Sin planes de estudio</h3>
          <p className="text-gray-500 max-w-md">
            {(plans || []).length === 0
              ? 'No hay planes de estudio cargados en este momento.'
              : 'No se encontraron planes de estudio que coincidan con la búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
            >
              {/* Imagen con Overlay Hover */}
              <div
                onClick={() => setSelectedPlan(plan)}
                className="relative h-72 w-full overflow-hidden cursor-pointer bg-gray-50 flex justify-center items-center"
              >
                <img
                  src={getImageUrl(plan.image_path)}
                  alt={plan.major}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
                  loading="lazy"
                />
                {/* Overlay de Vidrio (Glassmorphism) en Hover */}
                <div className="absolute inset-0 bg-[#325579]/60 backdrop-blur-sm flex flex-col items-center justify-center gap-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white text-[#325579] p-4 rounded-full shadow-2xl scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                    <Eye className="h-8 w-8" />
                  </div>
                  <span className="text-white font-bold text-lg tracking-wide drop-shadow-md">
                    Ver Plan
                  </span>
                </div>
              </div>

              {/* Información y Botones */}
              <div className="p-4 flex flex-col flex-1 justify-between gap-3 border-t border-gray-100">
                <div className="flex flex-col items-center text-center gap-1">
                  <h3 className="text-base font-bold text-gray-800 leading-tight">
                    {plan.major}
                  </h3>
                  <span className="text-[10px] font-black text-[#5dc1c5] uppercase tracking-widest bg-[#5dc1c5]/10 px-2 py-0.5 rounded-full">
                    {plan.institute}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={getImageUrl(plan.image_path)}
                    download={getDownloadName(plan)}
                    onClick={(e) => e.stopPropagation()}
                    className="btn border-none w-full bg-[#325579] hover:bg-[#1b324d] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <Download className="h-5 w-5" />
                    Descargar Plan
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('¡Próximamente!');
                    }}
                    className="btn border-none w-full bg-[#5dc1c5] hover:bg-[#47a8ac] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <FileText className="h-5 w-5" />
                    Apuntes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Visor Modal Pantalla Completa */}
      {selectedPlan && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col animate-fade-in"
          onClick={() => setSelectedPlan(null)}
        >
          {/* Barra superior del visor */}
          <div
            className="w-full bg-[#1b324d] py-4 px-6 flex justify-between items-center shadow-xl z-20 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-7xl mx-auto flex justify-between items-center gap-4">
              <h2 className="text-sm md:text-lg font-bold text-white truncate">
                {selectedPlan.major}
              </h2>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={getImageUrl(selectedPlan.image_path)}
                  download={getDownloadName(selectedPlan)}
                  onClick={(e) => e.stopPropagation()}
                  className="btn btn-sm md:btn-md bg-[#5dc1c5] hover:bg-[#47a8ac] border-none text-white rounded-full flex items-center gap-2 shadow-lg"
                >
                  <Download className="h-4 w-4 md:h-5 md:w-5" />
                  <span className="hidden md:inline">Descargar</span>
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(null);
                  }}
                  className="btn btn-sm md:btn-md btn-circle bg-white/10 hover:bg-white/20 border-none text-white shadow-lg"
                  aria-label="Cerrar modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Área de la imagen con scroll */}
          <div
            className="flex-1 overflow-y-auto w-full p-4 md:p-8 flex justify-center items-start z-10"
            onClick={() => setSelectedPlan(null)}
          >
            <img
              src={getImageUrl(selectedPlan.image_path)}
              alt={selectedPlan.major}
              className="w-full max-w-5xl h-auto object-contain rounded-2xl shadow-2xl animate-zoom-in mt-4 mb-12"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
