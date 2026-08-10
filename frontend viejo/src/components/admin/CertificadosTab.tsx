import { useState, useEffect, useRef } from 'react'
import { Plus, Trash2, Edit2, Loader2, Check, X, File, FileText } from 'lucide-react'
import { Card, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { EmptyState } from '../ui/empty-state'
import {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  type Certificate,
} from '../../features/api/certificates'

export function CertificadosTab() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const [certName, setCertName] = useState('')
  const [isFree, setIsFree] = useState(true)
  const [selectedCertFile, setSelectedCertFile] = useState<File | null>(null)
  const [editingCertId, setEditingCertId] = useState<number | null>(null)
  const [editCertName, setEditCertName] = useState('')
  const [editCertIsFree, setEditCertIsFree] = useState(true)
  const certFileInputRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getCertificates()
      setCerts(data || [])
    } catch (err) {
      console.error('Error loading certificates:', err)
      setErrorMsg('No se pudo establecer conexión para cargar los certificados.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateCert = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    if (!certName.trim()) {
      setErrorMsg('El nombre del certificado es obligatorio.')
      return
    }
    if (!selectedCertFile) {
      setErrorMsg('Debe seleccionar un archivo PDF para el certificado.')
      return
    }

    try {
      setSubmitting(true)
      await createCertificate(certName, isFree, selectedCertFile)
      setSuccessMsg('Certificado creado con éxito.')
      setCertName('')
      setIsFree(true)
      setSelectedCertFile(null)
      if (certFileInputRef.current) certFileInputRef.current.value = ''
      const data = await getCertificates()
      setCerts(data || [])
    } catch (err: any) {
      console.error('Error creating certificate:', err)
      setErrorMsg(err.response?.data?.error || 'Error al guardar el certificado.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteCert = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este certificado?')) return
    setErrorMsg('')
    setSuccessMsg('')

    try {
      await deleteCertificate(id)
      setSuccessMsg('Certificado eliminado con éxito.')
      const data = await getCertificates()
      setCerts(data || [])
    } catch (err: any) {
      console.error('Error deleting certificate:', err)
      setErrorMsg(err.response?.data?.error || 'Error al eliminar el certificado.')
    }
  }

  const handleUpdateCert = async (id: number) => {
    setErrorMsg('')
    setSuccessMsg('')

    if (!editCertName.trim()) {
      setErrorMsg('El nombre del certificado es obligatorio.')
      return
    }

    try {
      setSubmitting(true)
      await updateCertificate(id, editCertName, editCertIsFree)
      setSuccessMsg('Certificado actualizado con éxito.')
      setEditingCertId(null)
      const data = await getCertificates()
      setCerts(data || [])
    } catch (err: any) {
      console.error('Error updating certificate:', err)
      setErrorMsg(err.response?.data?.error || 'Error al actualizar el certificado.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Alert messages */}
      {(errorMsg || successMsg) && (
        <div className="space-y-2 animate-in fade-in duration-200">
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-5 py-3 rounded-2xl text-sm font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-200 px-5 py-3 rounded-2xl text-sm font-medium">
              {successMsg}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Form for Certificates */}
        <div className="lg:col-span-1 space-y-6 animate-in fade-in duration-300">
          <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
            <CardTitle className="text-lg font-bold text-white mb-4 flex items-center gap-x-2">
              <Plus className="h-5 w-5 text-[#2b7fff]" />
              <span>Subir Certificado</span>
            </CardTitle>

            <form onSubmit={handleCreateCert} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Nombre del Certificado</label>
                <Input
                  type="text"
                  placeholder="Ej: Certificado de Alumno Regular"
                  value={certName}
                  onChange={(e) => setCertName(e.target.value)}
                  className="w-full bg-white text-zinc-800 placeholder:text-zinc-400 border border-zinc-200 rounded-xl h-10 px-4 focus-visible:ring-[#2b7fff]/20"
                />
              </div>

              {/* PDF File Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Archivo PDF del Certificado</label>
                <div className="flex items-center gap-x-3">
                  <input
                    type="file"
                    accept="application/pdf"
                    ref={certFileInputRef}
                    onChange={(e) => setSelectedCertFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="cert-file-upload"
                  />
                  <label
                    htmlFor="cert-file-upload"
                    className="flex items-center justify-center gap-x-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 py-2 text-xs font-bold cursor-pointer transition-colors"
                  >
                    <File className="h-4 w-4 text-[#2b7fff]" />
                    <span>{selectedCertFile ? 'Cambiar PDF' : 'Elegir PDF'}</span>
                  </label>
                  {selectedCertFile && (
                    <span className="text-xs text-zinc-300 truncate max-w-[150px]">
                      {selectedCertFile.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-x-2 bg-[#2b7fff] hover:bg-[#1a6ee6] disabled:bg-[#2b7fff]/40 !text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Subiendo...</span>
                  </>
                ) : (
                  <>
                    <File className="h-4 w-4" />
                    <span>Subir Certificado</span>
                  </>
                )}
              </button>
            </form>
          </Card>
        </div>

        {/* Right Column: Manage List of Certificates */}
        <div className="lg:col-span-2 space-y-6 animate-in fade-in duration-300">
          <Card className="bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg p-6">
            <CardTitle className="text-lg font-bold text-white mb-4 flex items-center justify-between">
              <span>Certificados Activos</span>
              <span className="bg-white/10 text-white font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                {certs.length} Certificados
              </span>
            </CardTitle>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            ) : certs.length > 0 ? (
              <div className="space-y-4">
                {certs.map((cert) => {
                  const isEditingCert = editingCertId === cert.id
                  return (
                    <div
                      key={cert.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      {/* File detail info */}
                      <div className="flex items-center gap-x-4 flex-1 min-w-0">
                        <div className="h-16 w-12 bg-white/5 rounded-lg overflow-hidden border border-white/10 shrink-0 flex items-center justify-center p-1">
                          <FileText className="h-6 w-6 text-[#2b7fff]" />
                        </div>

                        {isEditingCert ? (
                          <div className="flex-1 space-y-2">
                            <Input
                              type="text"
                              value={editCertName}
                              onChange={(e) => setEditCertName(e.target.value)}
                              className="bg-white text-zinc-800 rounded-lg h-8 px-2 text-xs focus-visible:ring-[#2b7fff]/20 w-full"
                            />
                          </div>
                        ) : (
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm font-bold text-white truncate">{cert.name}</h4>
                            <span className="text-[10px] text-zinc-400 block truncate">
                              PDF: {cert.pdf_path}
                            </span>
                            <div className="flex items-center gap-x-2 mt-1">
                              <span className="text-[10px] text-zinc-400">
                                Subido: {new Date(cert.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-x-2 shrink-0">
                        {isEditingCert ? (
                          <>
                            <button
                              onClick={() => handleUpdateCert(cert.id)}
                              disabled={submitting}
                              className="p-2 rounded-xl bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 cursor-pointer transition-colors"
                              aria-label="Confirmar edición"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingCertId(null)}
                              className="p-2 rounded-xl bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-400 hover:text-zinc-300 cursor-pointer transition-colors"
                              aria-label="Cancelar edición"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                setEditingCertId(cert.id)
                                setEditCertName(cert.name)
                                setEditCertIsFree(cert.is_free)
                              }}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white cursor-pointer transition-colors"
                              aria-label="Editar certificado"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCert(cert.id)}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 cursor-pointer transition-colors"
                              aria-label="Eliminar certificado"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="Sin certificados activos"
                description="No hay certificados registrados en la base de datos."
                className="py-12 bg-transparent border-none shadow-none backdrop-blur-none max-w-full"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
