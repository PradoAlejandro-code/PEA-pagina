import NewsCarousel from '../components/NewsCarousel';
import YearCalendar from '../components/YearCalendar';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-start min-h-[60vh] bg-base-100 shadow-sm rounded-3xl p-4 md:p-8 border border-gray-100">
      
      {/* Sección de Carrusel de Noticias */}
      <div className="w-full">
        <NewsCarousel />
      </div>

      {/* Sección de Calendario */}
      <div className="w-full mt-12 border-t border-gray-100 pt-8">
        <YearCalendar />
      </div>
      
    </div>
  );
}
