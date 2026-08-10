import { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Mail } from 'lucide-react';

const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
  ];

  const isDropdownActive = (items: { to: string }[]) => {
    return items.some(item => !item.to.startsWith('http') && location.pathname.startsWith(item.to));
  };

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
        <a href="https://www.instagram.com/peauntdf" target="_blank" rel="noreferrer" className="transition-all duration-200 text-white hover:text-zinc-200">
          <Instagram className="h-5 w-5" />
        </a>
        <a href="mailto:centro.estudiantes.ush@untdf.edu.ar" className="transition-all duration-200 text-white hover:text-zinc-200">
          <Mail className="h-5 w-5" />
        </a>
      </div>

      {/* Main Navbar */}
      <nav className="w-full max-w-7xl navbar bg-white rounded-full shadow-lg min-h-[3.5rem] md:min-h-[4rem] relative">
        
        {/* Overlapping Logo */}
        <div className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-20">
          <Link to="/" className="block">
            <img
              src="/logo_pea.webp"
              alt="Logo PEA"
              className="h-28 w-28 md:h-36 md:w-36 rounded-full border-[6px] border-white shadow-xl object-cover transition-transform duration-300 hover:scale-105 bg-white"
            />
          </Link>
        </div>

        {/* Navigation Links - Desktop (Hidden on mobile) */}
        <div className="hidden lg:flex w-full pl-28 pr-6">
          <ul className="menu menu-horizontal px-1 gap-1 w-full justify-start items-center font-semibold text-gray-700">
            {menuItems.map((item) => {
              if (item.items) {
                const active = isDropdownActive(item.items);
                return (
                  <li key={item.label}>
                    <details className="dropdown">
                      <summary className={`hover:bg-blue-50 hover:text-blue-600 rounded-full ${active ? 'text-blue-600 bg-blue-50' : ''}`}>
                        {item.label}
                      </summary>
                      <ul className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-box w-56 z-[100] mt-6 border border-gray-100">
                        {item.items.map((subItem) => {
                          if (subItem.to.startsWith('http')) {
                            return (
                              <li key={subItem.to}>
                                <a href={subItem.to} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                  {subItem.label}
                                </a>
                              </li>
                            );
                          }
                          if (subItem.coming) {
                            return (
                              <li key={subItem.label} className="disabled">
                                <span className="text-gray-400">{subItem.label}</span>
                              </li>
                            );
                          }
                          return (
                            <li key={subItem.to}>
                              <NavLink 
                                to={subItem.to} 
                                className={({isActive}) => isActive ? "bg-blue-50 text-blue-600 font-bold" : "hover:text-blue-600"}
                              >
                                {subItem.label}
                              </NavLink>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  </li>
                );
              }

              if (item.coming) {
                return (
                  <li key={item.label} className="disabled">
                    <span className="text-gray-400 cursor-not-allowed hover:bg-transparent">{item.label}</span>
                  </li>
                );
              }

              return (
                <li key={item.to}>
                  <NavLink 
                    to={item.to}
                    className={({isActive}) => `rounded-full hover:bg-blue-50 hover:text-blue-600 ${isActive ? 'text-blue-600 bg-blue-50 font-bold' : ''}`}
                  >
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="flex-none lg:hidden ml-auto pr-2 z-[100]">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </div>
            {isOpen && (
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[100] p-2 shadow-xl bg-white rounded-box w-64 border border-gray-100 max-h-[70vh] overflow-y-auto">
                {menuItems.map((item) => {
                  if (item.items) {
                    return (
                      <li key={item.label}>
                        <details>
                          <summary className="font-semibold text-gray-700">{item.label}</summary>
                          <ul>
                            {item.items.map((subItem) => {
                              if (subItem.to.startsWith('http')) {
                                return (
                                  <li key={subItem.to}>
                                    <a href={subItem.to} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>{subItem.label}</a>
                                  </li>
                                );
                              }
                              if (subItem.coming) {
                                return (
                                  <li key={subItem.label} className="disabled">
                                    <span className="text-gray-400">{subItem.label}</span>
                                  </li>
                                );
                              }
                              return (
                                <li key={subItem.to}>
                                  <NavLink to={subItem.to} onClick={() => setIsOpen(false)} className={({isActive}) => isActive ? "bg-blue-50 text-blue-600 font-bold" : ""}>
                                    {subItem.label}
                                  </NavLink>
                                </li>
                              );
                            })}
                          </ul>
                        </details>
                      </li>
                    );
                  }

                  if (item.coming) {
                    return (
                      <li key={item.label} className="disabled">
                        <span className="text-gray-400 font-semibold">{item.label}</span>
                      </li>
                    );
                  }

                  return (
                    <li key={item.to}>
                      <NavLink to={item.to} onClick={() => setIsOpen(false)} className={({isActive}) => `font-semibold ${isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}>
                        {item.label}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
