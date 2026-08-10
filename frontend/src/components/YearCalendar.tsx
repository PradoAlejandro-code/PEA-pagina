import { useState } from 'react';

const MONTHS_SPANISH = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL',
  'MAYO', 'JUNIO', 'JULIO', 'AGOSTO',
  'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
];

const DAYS = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];

const COLOR_REFERENCES = [
  { label: 'Inscripciones', colorClass: 'bg-blue-400' },
  { label: 'Exámenes', colorClass: 'bg-red-400' },
  { label: 'Cursos / CIU', colorClass: 'bg-green-400' },
  { label: 'Feriados / Asuetos', colorClass: 'bg-yellow-400' },
  { label: 'Fechas Importantes', colorClass: 'bg-purple-400' },
  { label: 'Inicio de Cuatrimestre', colorClass: 'bg-cyan-300' },
  { label: 'Fin de Cuatrimestre', colorClass: 'bg-orange-400' },
  { label: 'Recesos / Vacaciones', colorClass: 'bg-gray-400' },
  { label: 'Eventos Institucionales', colorClass: 'bg-pink-400' },
];

// Helper to get days array for a month (including empty slots for padding)
function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday, 1 is Monday...
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Convert JS day (Sun=0, Mon=1) to our format (Mon=0, Tue=1... Sun=6)
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  
  const days = [];
  // previous month padding (optional, we can just put null)
  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  // Next month padding to complete the last row
  while (days.length % 7 !== 0) {
    days.push(null);
  }
  
  return days;
}

export default function YearCalendar() {
  const [year] = useState(2026);

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 rounded-3xl bg-[#325579] my-12 shadow-2xl relative">
      {/* Header */}
      <div className="flex flex-col items-center gap-y-4 mb-8 pb-2 select-none">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight text-center">
          Calendario Académico {year}
        </h2>
        <button 
          className="btn btn-sm bg-transparent border-white text-white hover:bg-transparent hover:border-white hover:text-white md:hidden" 
          onClick={() => (document.getElementById('legend_modal') as HTMLDialogElement)?.showModal()}
        >
          Filtros
        </button>
      </div>

      {/* Leyenda / Referencia de Colores (Desktop) */}
      <div className="hidden md:block w-full bg-[#f4f3ec] rounded-2xl p-6 shadow-lg border border-[#e5e4e7] mb-8">
        <h3 className="text-[#08060d] font-bold text-lg mb-4 tracking-tight">
          Referencia de colores marcados
        </h3>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {COLOR_REFERENCES.map((ref, idx) => (
            <div key={idx} className="flex items-center gap-x-2 w-auto">
              <div className={`w-5 h-5 rounded-md border border-black/10 shadow-sm ${ref.colorClass}`}></div>
              <span className="text-sm font-medium text-[#4a5568]">{ref.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid de Meses (Carousel en Mobile) */}
      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none gap-4 md:gap-6 pb-4 md:pb-0 mb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MONTHS_SPANISH.map((monthName, monthIndex) => {
          const days = getMonthDays(year, monthIndex);
          
          return (
            <div
              key={monthIndex}
              className="snap-center shrink-0 w-[85%] sm:w-[60%] md:w-auto bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col transition-transform duration-200 md:hover:-translate-y-1 md:hover:shadow-xl"
            >
              {/* Month Header */}
              <div className="bg-[#1a3857] text-white py-3 text-center font-bold tracking-wider text-sm select-none">
                {monthName}
              </div>

              {/* Month Body */}
              <div className="p-4 bg-white flex-1">
                {/* Weekdays header */}
                <div className="grid grid-cols-7 mb-2">
                  {DAYS.map((d) => (
                    <div key={d} className="text-center font-semibold text-xs text-gray-400 select-none">
                      {d}
                    </div>
                  ))}
                </div>
                
                {/* Days grid */}
                <div className="grid grid-cols-7 gap-y-2">
                  {days.map((day, idx) => {
                    // Ejemplo estático para mostrar colores de prueba
                    let extraClass = 'text-gray-800 hover:bg-gray-100';
                    if (day === 15 && monthIndex === 1) extraClass = 'bg-red-400 text-white hover:bg-red-500 shadow-sm';
                    if (day === 10 && monthIndex === 2) extraClass = 'bg-blue-400 text-white hover:bg-blue-500 shadow-sm';
                    
                    return (
                      <div 
                        key={idx} 
                        className={`h-8 w-8 mx-auto flex items-center justify-center text-sm font-medium select-none rounded-full cursor-pointer transition-colors
                          ${day ? extraClass : ''}
                        `}
                      >
                        {day || ''}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Leyenda (Mobile) */}
      <dialog id="legend_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-[#f4f3ec] text-[#08060d]">
          <h3 className="font-bold text-lg mb-4">Referencia de colores marcados</h3>
          <div className="flex flex-col gap-y-3">
            {COLOR_REFERENCES.map((ref, idx) => (
              <div key={idx} className="flex items-center gap-x-3">
                <div className={`w-5 h-5 rounded-md border border-black/10 shadow-sm ${ref.colorClass}`}></div>
                <span className="text-sm font-medium text-[#4a5568]">{ref.label}</span>
              </div>
            ))}
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-primary text-white">Cerrar</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
