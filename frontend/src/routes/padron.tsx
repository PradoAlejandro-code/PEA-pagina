import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Search, Loader2, LogOut, AlertTriangle, Send } from 'lucide-react'
import LoginGuard from '../components/LoginGuard'
import { useAuth } from '../hooks/auth'
import { useRegistros, usePatchVoto } from '../hooks/registros'
import { useCreateVote } from '../hooks/votes'

interface Registro {
  id: number
  orden: number
  nombre: string
  apellido: string
  dni: string
  voto: boolean
}

export const Route = createFileRoute('/padron')({
  component: Padron,
})

function Padron() {
  return (
    <LoginGuard scope="padron">
      <MesaContent />
    </LoginGuard>
  )
}

function MesaContent() {
  const { logout } = useAuth('padron')
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [confirmVoto, setConfirmVoto] = useState<Registro | null>(null)

  const { data: registrosData, isLoading } = useRegistros('todos')
  const registros = registrosData || []
  const votaron = registros.filter((r) => r.voto).length
  const noVotaron = registros.filter((r) => !r.voto).length
  const patchVotoMutation = usePatchVoto()
  const createVoteMutation = useCreateVote()

  const [showCargarVotos, setShowCargarVotos] = useState(false)
  const [peaVotes, setPeaVotes] = useState('')
  const [uplVotes, setUplVotes] = useState('')

  // Reset page when search query changes
  useEffect(() => {
    setPage(1)
  }, [search])

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  // Filter registers by DNI, Orden, Nombre or Apellido
  const filtered = registros
    .filter((r) => {
      if (!search.trim()) return true
      const q = search.toLowerCase().trim()
      return (
        r.dni.toLowerCase().includes(q) ||
        r.orden.toString() === q ||
        r.nombre.toLowerCase().includes(q) ||
        r.apellido.toLowerCase().includes(q)
      )
    })
    // Sort by order number
    .sort((a, b) => a.orden - b.orden)

  // Pagination details (50 by 50)
  const pageSize = 50
  const totalPages = Math.ceil(filtered.length / pageSize) || 1
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize)

  const handleToggleVoto = (id: number, currentVotoStatus: boolean) => {
    patchVotoMutation.mutate(
      { id, voto: !currentVotoStatus },
      {
        onSuccess: () => {
          setConfirmVoto(null)
        },
      }
    )
  }

  const handleCargarVotos = () => {
    const pea = parseInt(peaVotes, 10) || 0
    const upl = parseInt(uplVotes, 10) || 0
    createVoteMutation.mutate({ pea_votes: pea, upl_votes: upl }, {
      onSuccess: () => {
        setShowCargarVotos(false)
        setPeaVotes('')
        setUplVotes('')
        alert('Votos cargados exitosamente')
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#1a2e42] flex flex-col text-white select-none">
      {/* ── Top Header Bar ── */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#152333] border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src="/logo_pea.webp" alt="PEA" className="h-9 w-9 rounded-full object-cover border-2 border-white/20" />
          <div>
            <p className="text-white font-extrabold text-sm leading-tight">Mesa Electoral</p>
            <p className="text-white/40 text-xs">PEA · UNTDF</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150 cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          Salir
        </button>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 px-4 py-6 space-y-6 max-w-5xl mx-auto w-full">

        {/* ── Stats cards ── */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-red-500/10 backdrop-blur-md rounded-2xl border border-red-500/20 p-4 text-center">
            <p className="text-2xl md:text-3xl font-black text-red-400">{noVotaron}</p>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mt-0.5">No votaron</p>
          </div>
          <div className="bg-green-500/10 backdrop-blur-md rounded-2xl border border-green-500/20 p-4 text-center">
            <p className="text-2xl md:text-3xl font-black text-green-400">{votaron}</p>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider mt-0.5">Votaron</p>
          </div>
        </div>

        {/* ── Search Input ── */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por DNI o Nº de Orden..."
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/50 transition-all font-medium"
            />
          </div>
          <button
            onClick={() => setShowCargarVotos(true)}
            className="px-4 py-3 bg-[#2b7fff] hover:bg-[#1a6ee6] text-white font-bold rounded-2xl flex items-center gap-2 transition-colors cursor-pointer shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Cargar Votos</span>
          </button>
        </div>

        {/* ── Voters Grid ── */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-[#2b7fff]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center bg-white/5 rounded-3xl border border-white/10">
            <AlertTriangle className="h-10 w-10 text-white/20" />
            <p className="text-white/40 text-sm font-semibold">No se encontraron votantes</p>
          </div>
        ) : (
          <div className="space-y-6 bg-white/5 rounded-3xl border border-white/10 p-5 shadow-lg">
            {/* Grid of small squares: 5 columns on narrow mobile, 6 on wider mobile, up to 12 columns on desktop */}
            <div className="grid grid-cols-5 min-[370px]:grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3 justify-items-center">
              {paginated.map((r) => (
                <div
                  key={r.id}
                  onClick={() => setConfirmVoto(r)}
                  className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center text-sm font-black transition-all duration-150 select-none cursor-pointer hover:scale-105 active:scale-95 ${
                    r.voto
                      ? 'bg-green-600/30 border-green-500 text-green-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                  title={`${r.apellido}, ${r.nombre} (DNI ${r.dni})`}
                >
                  {r.orden}
                </div>
              ))}
            </div>

            {/* ── Pagination Controls ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-4 border-t border-white/10 mt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold cursor-pointer transition-all"
                >
                  Anterior
                </button>
                <span className="text-xs text-white/40 font-bold">
                  {page} de {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold cursor-pointer transition-all"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Confirmation Modal ── */}
      {confirmVoto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#152333] border border-white/10 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                confirmVoto.voto ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
              }`}>
                {confirmVoto.voto ? 'Desmarcar Voto' : 'Registrar Voto'}
              </span>
              <h3 className="text-base font-extrabold text-white mt-2">
                ¿Confirmar cambio de estado?
              </h3>
              <div className="bg-white/5 rounded-2xl p-4 text-left space-y-1 border border-white/5">
                <p className="text-[10px] text-white/40 font-bold uppercase">Votante</p>
                <p className="text-sm font-black text-white">{confirmVoto.apellido}, {confirmVoto.nombre}</p>
                <p className="text-xs text-white/60">DNI: {confirmVoto.dni}</p>
                <p className="text-xs text-white/60">Nº de Orden: {confirmVoto.orden}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => handleToggleVoto(confirmVoto.id, confirmVoto.voto)}
                disabled={patchVotoMutation.isPending}
                className={`w-full py-3 rounded-xl font-bold text-sm cursor-pointer transition-all duration-150 ${
                  confirmVoto.voto
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {patchVotoMutation.isPending ? 'Procesando...' : confirmVoto.voto ? 'Quitar Voto' : 'Marcar como Votó'}
              </button>
              <button
                onClick={() => setConfirmVoto(null)}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 font-bold text-sm cursor-pointer transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Cargar Votos ── */}
      {showCargarVotos && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-[#152333] border border-white/10 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-extrabold text-white">Cargar Votos Contados</h3>
              <p className="text-white/50 text-xs">Ingresa la cantidad de votos contados en esta mesa.</p>
            </div>

            <div className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Votos PEA</label>
                <input
                  type="number"
                  value={peaVotes}
                  onChange={(e) => setPeaVotes(e.target.value)}
                  placeholder="Ej: 10"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2b7fff]/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Votos UPL</label>
                <input
                  type="number"
                  value={uplVotes}
                  onChange={(e) => setUplVotes(e.target.value)}
                  placeholder="Ej: 5"
                  className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-4">
              <button
                onClick={handleCargarVotos}
                disabled={createVoteMutation.isPending}
                className="w-full py-3 rounded-xl bg-[#2b7fff] hover:bg-[#1a6ee6] text-white font-bold text-sm cursor-pointer transition-all duration-150"
              >
                {createVoteMutation.isPending ? 'Enviando...' : 'Enviar Votos'}
              </button>
              <button
                onClick={() => setShowCargarVotos(false)}
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 font-bold text-sm cursor-pointer transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
