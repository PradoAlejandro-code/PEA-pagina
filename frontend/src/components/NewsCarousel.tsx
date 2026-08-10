import { useNoticiasQuery } from '../hooks/useNoticiasQuery';

export default function NewsCarousel() {
  const { data: noticias, isLoading, isError } = useNoticiasQuery();

  if (isLoading) {
    return (
      <div className="w-full flex justify-center p-12">
        <span className="loading loading-spinner loading-lg text-[#325579]"></span>
      </div>
    );
  }

  if (isError || !noticias) {
    return (
      <div className="alert alert-error">
        <span>Hubo un error al cargar las noticias.</span>
      </div>
    );
  }

  // Tomamos solo las últimas 5 noticias (asumiendo que vienen ordenadas o las invertimos)
  // Si vienen en orden cronológico ascendente (las últimas al final), hacemos un .slice(-5).reverse()
  // Por precaución, tomaremos los últimos 5 elementos que el backend devuelve.
  const latestNews = [...noticias].reverse().slice(0, 5);

  if (latestNews.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No hay noticias publicadas recientemente.
      </div>
    );
  }

  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  return (
    <div className="w-full max-w-4xl mx-auto my-4">
      <h2 className="text-3xl font-bold text-center text-[#325579] mb-6">Noticias Destacadas</h2>
      <div className="carousel carousel-center rounded-box shadow-xl bg-white border border-gray-100 p-4 space-x-4 max-w-full">
        {latestNews.map((news, index) => (
          <div key={news.ID} id={`slide${index}`} className="carousel-item w-full md:w-1/2 lg:w-1/3 flex-col gap-4 relative">
            <div className="card w-full bg-base-100 shadow-sm border border-gray-100 h-full">
              <figure className="px-4 pt-4">
                <img
                  src={news.ImagePath ? `${backendUrl}/${news.ImagePath}` : 'https://placehold.co/400x300?text=Noticia'}
                  alt={news.Title}
                  className="rounded-xl object-cover h-48 w-full"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Noticia'; }}
                />
              </figure>
              <div className="card-body items-center text-center p-4">
                <h3 className="card-title text-lg">{news.Title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3">{news.Text}</p>
                <div className="card-actions mt-2">
                  <button className="btn btn-primary btn-sm rounded-full">Leer más</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Indicadores opcionales (botones) si quieres deslizar manualmente, aunque DaisyUI usa scroll snap */}
      <div className="flex justify-center w-full py-4 gap-2">
        {latestNews.map((_, index) => (
          <a key={index} href={`#slide${index}`} className="btn btn-xs btn-circle bg-gray-200 border-none hover:bg-gray-400"></a>
        ))}
      </div>
    </div>
  );
}
