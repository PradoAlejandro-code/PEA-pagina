import { createFileRoute, useNavigate } from '@tanstack/react-router'
import LoginGuard from '../components/LoginGuard'
import { useAuth } from '../hooks/auth'
import { useState } from 'react'
import { X, BookOpen, Tv, FileText, Store, Tag, Users } from 'lucide-react'

// Tab components
import { PlanesTab } from '../components/admin/PlanesTab'
import { VideosTab } from '../components/admin/VideosTab'
import { CertificadosTab } from '../components/admin/CertificadosTab'
import { EmprendimientosTab } from '../components/admin/EmprendimientosTab'
import { DescuentosTab } from '../components/admin/DescuentosTab'
import { PadronTab } from '../components/admin/PadronTab'

export const Route = createFileRoute('/admin')({
  component: AdminPanel,
})

function AdminPanel() {
  return (
    <LoginGuard scope="admin" requiredRole="admin">
      <AdminPanelContent />
    </LoginGuard>
  )
}

function AdminPanelContent() {
  const [activeTab, setActiveTab] = useState<'planes' | 'videos' | 'certificados' | 'emprendimientos' | 'descuentos' | 'padron'>('planes')
  const { logout } = useAuth('admin')
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  const tabs = [
    { id: 'planes', label: 'Planes de Estudio', icon: BookOpen },
    { id: 'videos', label: 'Videos Instructivos', icon: Tv },
    { id: 'certificados', label: 'Certificados', icon: FileText },
    { id: 'emprendimientos', label: 'Emprendimientos', icon: Store },
    { id: 'descuentos', label: 'Descuentos', icon: Tag },
    { id: 'padron', label: 'Padrón Electoral', icon: Users },
  ] as const

  return (
    <div className="flex min-h-screen bg-[#1a2e42] select-none">
      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 flex flex-col bg-[#152333] border-r border-white/10 min-h-screen">
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <img src="/logo_pea.webp" alt="PEA" className="h-10 w-10 rounded-full object-cover border-2 border-white/20" />
          <div>
            <p className="text-white font-extrabold text-sm leading-tight">Panel Admin</p>
            <p className="text-white/40 text-xs">PEA · UNTDF</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer text-left ${
                activeTab === id
                  ? 'bg-[#2b7fff] text-white shadow-md'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer sidebar */}
        <div className="px-4 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150 cursor-pointer"
          >
            <X className="h-3.5 w-3.5 shrink-0" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {tabs.find(t => t.id === activeTab)?.label}
          </h1>
          <span className="bg-[#2b7fff]/10 text-[#2b7fff] border border-[#2b7fff]/20 font-bold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Gestionar Base de Datos
          </span>
        </div>

        {/* Tab content */}
        <div>
          {activeTab === 'planes' && <PlanesTab />}
          {activeTab === 'videos' && <VideosTab />}
          {activeTab === 'certificados' && <CertificadosTab />}
          {activeTab === 'emprendimientos' && <EmprendimientosTab />}
          {activeTab === 'descuentos' && <DescuentosTab />}
          {activeTab === 'padron' && <PadronTab />}
        </div>
      </main>
    </div>
  )
}
