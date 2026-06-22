import { createFileRoute } from '@tanstack/react-router'
import YearCalendar from '../components/YearCalendar'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8">

      {/* News Placeholder Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-center pb-2 select-none">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Últimas Noticias
          </h2>
          <span className="bg-white/5 text-zinc-400 font-semibold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider">
            Próximamente
          </span>
        </div>

        <div className="flex h-[200px] md:h-[250px] flex-col items-center justify-center bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 text-center select-none">
          <p className="text-zinc-400 text-lg font-medium">
            Sección de noticias en desarrollo.
          </p>
          <p className="text-zinc-500 text-sm mt-1">
            Próximamente verás las novedades y anuncios de nuestra comunidad.
          </p>
        </div>
      </section>

      {/* Year Calendar Section */}
      <section>
        <YearCalendar year={2026} />
      </section>
    </main>
  )
}

