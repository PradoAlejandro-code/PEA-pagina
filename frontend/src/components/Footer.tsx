import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1b324d] text-white py-12 px-6 md:px-12 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Columna Izquierda: Links PEA */}
        <div className="flex flex-col items-start gap-y-3">
          <h6 className="font-bold text-white tracking-wider text-sm uppercase">PEA</h6>
          <div className="flex flex-col gap-y-2 text-sm">
            <a 
              href="https://www.instagram.com/peauntdf" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#5dc1c5] hover:text-white transition-colors duration-200"
            >
              Instagram
            </a>
            <a 
              href="mailto:centro.estudiantes.ush@untdf.edu.ar" 
              className="text-[#5dc1c5] hover:text-white transition-colors duration-200"
            >
              Gmail
            </a>
            <a 
              href="https://wa.me/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#5dc1c5] hover:text-white transition-colors duration-200"
            >
              Whatsapp
            </a>
          </div>
        </div>

        {/* Columna Central: Copyright */}
        <div className="text-zinc-400 text-xs md:text-sm text-center">
          <p>© {year} PEA. Todos los derechos reservados.</p>
        </div>

        {/* Columna Derecha: Institutos */}
        <div className="flex flex-col items-start md:items-end gap-y-3">
          <h6 className="font-bold text-white tracking-wider text-sm uppercase">INSTITUTOS</h6>
          <div className="flex items-center gap-x-4">
            <Link to="/estudiantes/planes-de-estudio?instituto=idei" className="transition-transform duration-200 hover:scale-110">
              <img src="/logo_idei.png" alt="IDEI" className="h-10 w-auto object-contain" />
            </Link>
            <Link to="/estudiantes/planes-de-estudio?instituto=iec" className="transition-transform duration-200 hover:scale-110">
              <img src="/logo_iec.png" alt="IEC" className="h-10 w-auto object-contain" />
            </Link>
            <Link to="/estudiantes/planes-de-estudio?instituto=icse" className="transition-transform duration-200 hover:scale-110">
              <img src="/logo_icse.png" alt="ICSE" className="h-10 w-auto object-contain" />
            </Link>
            <Link to="/estudiantes/planes-de-estudio?instituto=icpa" className="transition-transform duration-200 hover:scale-110">
              <img src="/logo_icpa.png" alt="ICPA" className="h-10 w-auto object-contain" />
            </Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
