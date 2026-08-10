import { Calendar } from '#/components/ui/calendar.tsx'
import { es } from 'date-fns/locale'

const MONTHS_SPANISH = [
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE',
]

interface YearCalendarProps {
  year?: number
}

export default function YearCalendar({ year = 2026 }: YearCalendarProps) {
  return (
    <div className="w-full max-w-7xl mx-auto py-2">
      <div className="flex justify-between items-center mb-4 pb-2 select-none">
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Calendario Académico {year}
        </h2>
        <span className="bg-white/10 text-white font-semibold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
          Anual
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MONTHS_SPANISH.map((monthName, monthIndex) => (
          <div
            key={monthIndex}
            className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-md flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg text-zinc-950"
          >
            {/* Custom Month Header */}
            <div className="bg-[#1a3857] text-white py-2.5 text-center font-bold tracking-wider text-sm select-none">
              {monthName}
            </div>

            {/* shadcn/ui Calendar Component wrapper */}
            <div className="p-3 flex justify-center bg-white">
              <Calendar
                mode="single"
                month={new Date(year, monthIndex)}
                disableNavigation
                locale={es}
                classNames={{
                  month_caption: 'hidden',
                  months: 'w-full',
                  month: 'w-full flex flex-col gap-2',
                  month_grid: 'w-full border-collapse',
                  weekdays: 'flex w-full justify-between',
                  weekday: 'flex-1 text-center font-bold text-xs select-none text-zinc-500',
                  week: 'mt-1 flex w-full justify-between',
                  day: 'flex-1 flex justify-center p-0',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
