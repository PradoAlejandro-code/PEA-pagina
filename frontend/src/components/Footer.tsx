import { Link } from '@tanstack/react-router'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full bg-[#1b324d] border-t border-white/10 text-white mt-16 py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Left Column: PEA & Text Links (No Icons) */}
        <div className="flex flex-col items-start gap-y-2.5">
          <h3 className="font-bold text-white tracking-wider text-base">PEA</h3>
          <div className="flex flex-col gap-y-1.5 text-sm">
            <a
              href="https://www.instagram.com/peauntdf?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-300 hover:text-white hover:underline transition-colors duration-150"
            >
              Instagram
            </a>
            <a
              href="mailto:centro.estudiantes.ush@untdf.edu.ar?subject=Consulta WEB&body=Hola, necesito ayuda con..."
              className="text-zinc-300 hover:text-white hover:underline transition-colors duration-150"
            >
              Gmail
            </a>
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-300 hover:text-white hover:underline transition-colors duration-150"
            >
              Whatsapp
            </a>
          </div>
        </div>

        {/* Center Column: Rights Placeholder */}
        <div className="text-zinc-400 text-xs md:text-sm text-center order-3 md:order-2">
          <p>© {year} PEA. Todos los derechos reservados.</p>
        </div>

        {/* Right Column: Institutos & Logos */}
        <div className="flex flex-col items-start md:items-end gap-y-3.5 order-2 md:order-3">
          <h3 className="font-bold text-white tracking-wider text-sm">INSTITUTOS</h3>
          <div className="flex items-center gap-x-4">
            <Link
              to="/estudiantes/planes-de-estudio"
              search={{ instituto: 'idei' }}
              className="block transition-transform duration-200 hover:scale-105"
            >
              <img
                src="/logo_idei.png"
                alt="IDEI"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
            <Link
              to="/estudiantes/planes-de-estudio"
              search={{ instituto: 'iec' }}
              className="block transition-transform duration-200 hover:scale-105"
            >
              <img
                src="/logo_iec.png"
                alt="IEC"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
            <Link
              to="/estudiantes/planes-de-estudio"
              search={{ instituto: 'icse' }}
              className="block transition-transform duration-200 hover:scale-105"
            >
              <img
                src="/logo_icse.png"
                alt="ICSE"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
            <Link
              to="/estudiantes/planes-de-estudio"
              search={{ instituto: 'icpa' }}
              className="block transition-transform duration-200 hover:scale-105"
            >
              <img
                src="/logo_icpa.png"
                alt="ICPA"
                className="h-10 md:h-12 w-auto object-contain"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
