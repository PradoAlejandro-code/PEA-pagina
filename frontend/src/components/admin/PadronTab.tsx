import { useState, useRef } from 'react'
import { Plus, Trash2, Loader2, FileText, File } from 'lucide-react'
import { Card, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { EmptyState } from '../ui/empty-state'
import { useRegistros, useCreateRegistro, useDeleteRegistro } from '../../hooks/registros'
import * as XLSX from 'xlsx'

export function PadronTab() {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [dni, setDni] = useState('')
  const [orden, setOrden] = useState('')
  const [filter, setFilter] = useState<'todos' | 'true' | 'false'>('todos')
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState<{ done: number; total: number } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: registrosData, isLoading } = useRegistros('todos')
  const registros = registrosData || []
  const total = registros.length
  const votaron = registros.filter(r => r.voto).length
  const noVotaron = registros.filter(r => !r.voto).length
  const createMutation = useCreateRegistro()
  const deleteMutation = useDeleteRegistro()

  const pct = total > 0 ? Math.round((votaron / total) * 100) : 0

  const filtered = registros
    .filter((r) => {
      if (filter === 'true' && !r.voto) return false
      if (filter === 'false' && r.voto) return false

      if (!search.trim()) return true
      const q = search.toLowerCase().trim()
      return (
        r.dni.toLowerCase().includes(q) ||
        r.orden.toString() === q ||
        r.nombre.toLowerCase().includes(q) ||
        r.apellido.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => a.orden - b.orden)

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || !apellido || !dni || !orden) return
    createMutation.mutate(
      { orden: Number(orden), nombre, apellido, dni },
      {
        onSuccess: () => {
          setNombre('')
          setApellido('')
          setDni('')
          setOrden('')
        },
      },
    )
  }

  const handleXlsx = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setImportError(null)
    setImportProgress({ done: 0, total: 0 })

    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 })

      // Filter valid rows (skip header, check if order is number-like)
      const validRows = rows.filter(row => {
        if (!row || row.length < 5) return false
        const ordenNum = Number(row[0])
        return !isNaN(ordenNum) && ordenNum > 0
      })

      if (validRows.length === 0) {
        setImportError('No se encontraron filas válidas en el archivo Excel.')
        setImporting(false)
        return
      }

      setImportProgress({ done: 0, total: validRows.length })

      let doneCount = 0
      for (const row of validRows) {
        const ordenVal = Number(row[0])
        const apellidoVal = (row[1] || '').toString().trim()
        const nombreVal = (row[2] || row[3] || '').toString().trim()
        const dniVal = (row[4] || '').toString().trim()

        if (ordenVal && apellidoVal && nombreVal && dniVal) {
          try {
            await createMutation.mutateAsync({
              orden: ordenVal,
              nombre: nombreVal,
              apellido: apellidoVal,
              dni: dniVal
            })
          } catch (err) {
            console.error(`Error importando registro ${ordenVal}:`, err)
          }
        }
        doneCount++
        setImportProgress({ done: doneCount, total: validRows.length })
      }
    } catch (err) {
      console.error('Error al procesar el archivo Excel:', err)
      setImportError('Error al leer el archivo Excel. Asegurate de que sea un archivo válido.')
    } finally {
      setImporting(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ── Left: Import + Form ── */}
      <div className="lg:col-span-1 space-y-6">

        {/* XLSX Import Card */}
        <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
          <CardTitle className="text-lg font-bold text-white mb-4 flex items-center gap-x-2">
            <FileText className="h-5 w-5 text-[#2b7fff]" />
            Importar desde Excel
          </CardTitle>
          <p className="text-white/40 text-xs mb-4">
            Subí el archivo .xlsx del padrón (Mesa 1 o Mesa 2). Se cargarán todos los votantes automáticamente.
          </p>

          {importProgress && (
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-xs text-white/50">
                <span>{importing ? 'Importando...' : '✅ Importación completa'}</span>
                <span>{importProgress.done}/{importProgress.total}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2b7fff] rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((importProgress.done / importProgress.total) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {importError && (
            <p className="text-red-400 text-xs mb-3">{importError}</p>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleXlsx}
            className="hidden"
            id="xlsx-import"
          />
          <label
            htmlFor="xlsx-import"
            className={`w-full flex items-center justify-center gap-2 border-2 border-dashed border-white/20 hover:border-[#2b7fff]/60 text-white/50 hover:text-white rounded-xl py-3 text-sm font-semibold transition-all ${
              importing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'
            }`}
          >
            {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {importing ? `Importando ${importProgress?.done ?? 0}/${importProgress?.total ?? '?'}...` : 'Elegir archivo .xlsx'}
          </label>
        </Card>

        {/* Manual form card */}
        <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
          <CardTitle className="text-lg font-bold text-white mb-5 flex items-center gap-x-2">
            <Plus className="h-5 w-5 text-[#2b7fff]" />
            Agregar al Padrón
          </CardTitle>

          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Nº Orden</label>
              <Input
                type="number"
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                placeholder="1"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Nombre</label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Juan"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Apellido</label>
              <Input
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                placeholder="Pérez"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase tracking-wider">DNI</label>
              <Input
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="12345678"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                required
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#2b7fff] hover:bg-[#1a6ee6] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl cursor-pointer transition-all"
            >
              <Plus className="h-4 w-4" />
              {createMutation.isPending ? 'Guardando...' : 'Agregar'}
            </button>
          </form>
        </Card>
      </div>

      {/* ── Right: Stats + List ── */}
      <div className="lg:col-span-2 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: total, color: 'text-white' },
            { label: 'Votaron', value: votaron, color: 'text-green-400' },
            { label: 'No votaron', value: noVotaron, color: 'text-red-400' },
            { label: 'Participación', value: `${pct}%`, color: 'text-[#2b7fff]' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-4 text-center">
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
              <p className="text-white/40 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Filter + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="Buscar por DNI, Nº de Orden, Apellido o Nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 flex-1"
          />
          <div className="flex gap-2">
            {(['todos', 'true', 'false'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-[#2b7fff] text-white'
                    : 'bg-white/5 text-white/50 hover:text-white'
                }`}
              >
                {f === 'todos' ? 'Todos' : f === 'true' ? 'Votaron' : 'No votaron'}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#2b7fff]" />
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={File}
              title="Sin registros"
              description="No hay votantes que coincidan con el filtro actual."
              className="py-10 bg-transparent border-none shadow-none backdrop-blur-none max-w-full"
            />
          ) : (
            <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
              {filtered.map((r) => (
                <div
                  key={r.id}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border transition-all duration-150 ${
                    r.voto
                      ? 'bg-green-600/20 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-white/30 text-xs font-mono min-w-[3.5rem] shrink-0">#{r.orden}</span>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{r.apellido}, {r.nombre}</p>
                      <p className="text-white/40 text-xs">DNI {r.dni}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {confirmDelete === r.id ? (
                      <>
                        <button
                          onClick={() => {
                            deleteMutation.mutate(r.id)
                            setConfirmDelete(null)
                          }}
                          className="px-2 py-1 rounded-lg bg-red-500/20 text-red-400 text-xs font-bold cursor-pointer hover:bg-red-500/30"
                        >Confirmar</button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="px-2 py-1 rounded-lg bg-white/10 text-white/60 text-xs font-bold cursor-pointer"
                        >Cancelar</button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(r.id)}
                        className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
