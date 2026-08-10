import { Link, useLocation } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { Menu, X, ChevronDown, Instagram, Mail } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({})
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const location = useLocation()

  const menuItems = [
    { label: 'Historia', to: '/historia', coming: true },
    { label: 'Noticias', to: '/noticias', coming: true },
    {
      label: 'Estudiantes',
      items: [
        { label: 'Planes de Estudio', to: '/estudiantes/planes-de-estudio' },
        { label: 'Clases de apoyo', to: '/estudiantes/clases-de-apoyo', coming: true },
        { label: 'Videos instructivos', to: '/estudiantes/videos-instructivos' },
        { label: 'Certificados', to: '/estudiantes/certificados' },
        { label: 'Emprendimientos', to: '/estudiantes/emprendimientos' },
        { label: 'Descuentos', to: '/estudiantes/descuentos' },
        { label: 'Bolsa de trabajo', to: 'https://docs.google.com/forms/d/e/1FAIpQLSfEsbvz9xmnA7HD6KqTLCyjqzauP33sUxJ5Bq4Av27xfhsYGA/viewform' },
      ],
    },
    { label: 'Secretarías', to: '/secretarias', coming: true },
    { label: 'Donaciones', to: '/donaciones' },
    { label: 'Ayuda', to: '/ayuda' },
  ]

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveDropdown(label)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }

  const isDropdownActive = (items: { to: string }[]) => {
    return items.some(item => !item.to.startsWith('http') && location.pathname.startsWith(item.to))
  }

  return (
    <header className="sticky top-0 z-50 w-full flex flex-col items-center pt-3 pb-3 px-4 bg-[#325579] border-b border-white/10 shadow-md">
      {/* Top Logos Row */}
      <div className="w-full max-w-7xl flex justify-end items-center gap-x-4 mb-2 pr-6 z-10">
        <a href="https://untdf.edu.ar" target="_blank" rel="noreferrer" className="transition-all duration-200">
          <img src="/logo_untdf_sin_letras.png" alt="UNTDF" className="h-7 w-auto object-contain brightness-0 invert" />
        </a>
        <a href="https://autogestion.guarani.siu.edu.ar/" target="_blank" rel="noreferrer" className="transition-all duration-200">
          <img src="/logo_siuguarani.png" alt="SIU Guaraní" className="h-7 w-auto object-contain brightness-0 invert" />
        </a>
        <a href="https://moodle.untdf.edu.ar/" target="_blank" rel="noreferrer" className="transition-all duration-200">
          <img src="/logo_moodle.png" alt="Moodle" className="h-7 w-auto object-contain brightness-0 invert" />
        </a>
        <a href="https://www.instagram.com/peauntdf?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D" target="_blank" rel="noreferrer" className="transition-all duration-200 !text-white hover:!text-zinc-200">
          <Instagram className="h-5 w-5 !text-white" />
        </a>
        <a href="mailto:centro.estudiantes.ush@untdf.edu.ar?subject=Consulta WEB&body=Hola, necesito ayuda con..." className="transition-all duration-200 !text-white hover:!text-zinc-200">
          <Mail className="h-5 w-5 !text-white" />
        </a>
      </div>

      {/* Main Navbar */}
      <nav className="w-full max-w-7xl rounded-full bg-white border border-zinc-200 shadow-[0_8px_32px_rgba(0,0,0,0.08)] px-4 py-1.5 md:py-2 relative flex items-center justify-between">
        
        {/* Overlapping Logo */}
        <div className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20">
          <Link to="/" className="block">
            <img
              src="/logo_pea.webp"
              alt="Logo PEA"
              className="h-24 w-24 md:h-28 md:w-28 rounded-full border-4 border-white shadow-md object-cover transition-transform duration-300 hover:scale-105"
            />
          </Link>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center gap-x-6 md:gap-x-8 pl-24 md:pl-28">
          {menuItems.map((item) => {
            if (item.items) {
              const active = isDropdownActive(item.items)
              const isOpenDropdown = activeDropdown === item.label
              
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`px-3.5 py-1.5 text-sm font-semibold rounded-full border-2 border-transparent !text-black hover:border-[#2b7fff] hover:!text-black transition-all duration-200 flex items-center gap-x-1 outline-none cursor-pointer ${
                      active ? 'border-[#2b7fff] !text-black font-bold' : ''
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpenDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu Card */}
                  {isOpenDropdown && (
                    <div className="absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2 mt-1 min-w-64 rounded-2xl bg-white border border-zinc-200 shadow-xl p-2 z-30 flex flex-col gap-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                      {item.items.map((subItem) => {
                        if (subItem.to.startsWith('http')) {
                          return (
                            <a
                              key={subItem.to}
                              href={subItem.to}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 text-sm font-medium rounded-xl !text-zinc-700 hover:!text-black hover:bg-zinc-100 transition-colors duration-150"
                            >
                              {subItem.label}
                            </a>
                          )
                        }
                        if (subItem.coming) {
                          return (
                            <span
                              key={subItem.label}
                              className="px-4 py-2 text-sm font-medium rounded-xl text-zinc-400 cursor-not-allowed select-none"
                            >
                              {subItem.label}
                            </span>
                          )
                        }
                        return (
                          <Link
                            key={subItem.to}
                            to={subItem.to}
                            className="px-4 py-2 text-sm font-medium rounded-xl !text-zinc-700 hover:!text-black hover:bg-zinc-100 transition-colors duration-150"
                            activeProps={{ className: '!text-black bg-zinc-100 font-semibold' }}
                          >
                            {subItem.label}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            // Coming soon — non-clickable grey item
            if (item.coming) {
              return (
                <span
                  key={item.label}
                  title="Próximamente"
                  className="px-3.5 py-1.5 text-sm font-semibold rounded-full border-2 border-transparent text-zinc-400 cursor-not-allowed select-none"
                >
                  {item.label}
                </span>
              )
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                className="px-3.5 py-1.5 text-sm font-semibold rounded-full border-2 border-transparent !text-black hover:border-[#2b7fff] hover:!text-black transition-all duration-200"
                activeProps={{ className: 'border-[#2b7fff] !text-black font-bold' }}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Mobile Hamburger - Right Side */}
        <div className="ml-auto flex items-center gap-x-2 z-10">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 md:hidden rounded-full hover:bg-zinc-100 !text-black transition-colors duration-200 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 z-30 flex flex-col gap-y-2 p-4 rounded-3xl bg-white border border-zinc-200 shadow-xl md:hidden max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            {menuItems.map((item) => {
              if (item.items) {
                const isExpanded = !!mobileDropdowns[item.label]
                const active = isDropdownActive(item.items)
                
                return (
                  <div key={item.label} className="w-full flex flex-col">
                    <button
                      onClick={() => setMobileDropdowns(prev => ({ ...prev, [item.label]: !prev[item.label] }))}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-transparent !text-black hover:bg-zinc-100 transition-all duration-200 outline-none cursor-pointer ${
                        active ? 'border-[#2b7fff]/30 !text-black font-bold' : ''
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isExpanded && (
                      <div className="pl-6 flex flex-col gap-y-1 mt-1 border-l-2 border-zinc-200">
                        {item.items.map((subItem) => {
                          if (subItem.to.startsWith('http')) {
                            return (
                              <a
                                key={subItem.to}
                                href={subItem.to}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm font-medium rounded-lg !text-zinc-700 hover:!text-black hover:bg-zinc-50 transition-colors duration-150"
                              >
                                {subItem.label}
                              </a>
                            )
                          }
                          if (subItem.coming) {
                            return (
                              <span
                                key={subItem.label}
                                className="px-4 py-2 text-sm font-medium rounded-lg text-zinc-400 cursor-not-allowed select-none block"
                              >
                                {subItem.label}
                              </span>
                            )
                          }
                          return (
                            <Link
                              key={subItem.to}
                              to={subItem.to}
                              onClick={() => setIsOpen(false)}
                              className="px-4 py-2 text-sm font-medium rounded-lg !text-zinc-700 !hover:text-black hover:bg-zinc-50 transition-colors duration-150"
                              activeProps={{ className: '!text-black font-semibold' }}
                            >
                              {subItem.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              // Coming soon — non-clickable grey item
              if (item.coming) {
                return (
                  <span
                    key={item.label}
                    className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-transparent text-zinc-400 cursor-not-allowed select-none block"
                  >
                    {item.label}
                  </span>
                )
              }

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2.5 text-sm font-semibold rounded-xl border-2 border-transparent !text-black hover:border-[#2b7fff] hover:!text-black transition-all duration-200"
                  activeProps={{ className: 'border-[#2b7fff] !text-black font-bold' }}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}
      </nav>
    </header>
  )
}
